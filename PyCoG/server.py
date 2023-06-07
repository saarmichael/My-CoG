import ast
import json
from flask import request, jsonify, send_file, session
from video import graph_video
from db_write import update_data_dir
from export_data import export_coherence_to_mat
from granger import calculate_granger_for_all_pairs
from util import convert_path_to_tree, dataProvider, find_first_eeg_file, find_file
from cache_check import data_in_db, user_in_db
from db_write import write_calculation, write_user
from coherence import coherence_over_time
from coherence import coherence_time_frame, get_recording_duration
from consts import bcolors
from server_config import User, Calculation, db, app
from image_generator import get_azi_ele_dist_lists, get_brain_image
import os
import threading
from datetime import datetime
import math

data_provider = dataProvider(session)


@app.before_first_request
def create_tables():
    db.create_all()


@app.route("/login", methods=["GET"])
def login():
    name = request.args.get("username")
    # get user from db
    user = user_in_db(name, User.query)
    if not user:
        return jsonify({"message": "No user found!"}), 404
    # return user's data directory
    session.permanent = True
    print(find_file(ast.literal_eval(user.user_root_dir)[0], os.getcwd()))
    session["user_root_dir"] = ast.literal_eval(user.user_root_dir)[0]
    session["user_data_dir"] = find_first_eeg_file(
        find_file(ast.literal_eval(user.user_root_dir)[0], os.getcwd())
    )
    session["username"] = user.username
    data_provider = dataProvider(session)
    print(f"{bcolors.GETREQUEST}user logged in: {user.username}{bcolors.ENDC}")
    return jsonify({"data_dir": user.user_root_dir})


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    print(f'user:{data["username"]}.')
    # check if user exists
    if data["username"] == "":
        return jsonify({"message": "Username cannot be empty!"}), 400
    if user_in_db(data["username"], User.query):
        return jsonify({"message": "User already exists!"}), 400
    write_user(data["username"], data["data"], data["settings"])
    return jsonify({"message": "User created successfully!"})


@app.route("/addFile", methods=["POST"])
def add_file():
    data = request.get_json()
    update_data_dir(session["username"], data["file"])
    return jsonify({"message": "File added successfully!"})


@app.route("/saveSettings", methods=["POST"])
def save_settings():
    data = request.get_json()
    # check if user exists
    if not "username" in session:
        return jsonify({"message": "Session error"}), 400
    user = user_in_db(session["username"], User.query)
    user.settings = data["requestSettings"]
    db.session.commit()
    return jsonify({"message": "Settings saved successfully!"})


@app.route("/setFile", methods=["POST"])
def set_file():
    print(session["user_data_dir"])
    session["user_data_dir"] = request.get_json()["file"]
    return jsonify({"message": "File set successfully!"})


@app.route("/getGraphVideo", methods=["POST"])
def get_graph_video():
    request_data = request.get_json()
    data = data_provider.get_data()
    sfreq = data_provider.get_sampling_rate()
    channels = data_provider.get_channel_names()
    duration = request_data["duration"]
    video_name = request_data["videoName"]
    video = graph_video(data, channels, sfreq, duration, video_name, epoch_duration=0.5)
    return jsonify({"message": "Video created successfully!"})


###############################################
############### GET REQUESTS ##################
###############################################


@app.route("/getSettings", methods=["GET"])
def get_settings():
    if not "username" in session:
        return jsonify({"message": "Session error"}), 400
    user = user_in_db(session["username"], User.query)
    return jsonify(user.settings)


@app.route("/frequencies", methods=["GET"])
def getFrequencies():
    file = data_provider.get_data()
    sfreq = data_provider.get_sampling_rate()
    f, _ = coherence_time_frame(file, sfreq, 0, 1)
    print(
        f"{bcolors.GETREQUEST}frequencies returned with {len(f)} frequencies{bcolors.ENDC}"
    )
    return jsonify(f.tolist())


@app.route("/duration", methods=["GET"])
def get_time_range():
    data = data_provider.get_data()
    sfreq = data_provider.get_sampling_rate()
    result = get_recording_duration(data, sfreq)
    print(f"{bcolors.GETREQUEST}returned duration: {result}{bcolors.ENDC}")
    return jsonify(result)


@app.route("/getFiles", methods=["GET"])
def get_files():
    return jsonify(
        convert_path_to_tree(find_file(session["user_root_dir"], os.getcwd()))
    )


# get_coherence_matrices
#   Parameters:
#       start: start time of the time frame
#       end: end time of the time frame
#   Returns:
#       f: frequency vector
#       CM: coherence matrix
#       the CM that corresponds to the time frame specified by the start and end parameters
@app.route("/time", methods=["GET"])
def get_coherence_matrices():
    start = request.args.get("start")
    end = request.args.get("end")
    print(f"{bcolors.DEBUG}start: {start}, end: {end}{bcolors.ENDC}")
    file_name = session["user_data_dir"]
    cal = data_in_db(file_name, request.url, Calculation.query)
    if cal:
        return jsonify(cal.data)
    # error handling
    if start is None:
        start = "0"
        # end will be the last time frame
    if end is None:
        end = "1"
    if int(math.floor(float(start))) > int(math.floor(float(end))):
        end = str(int(start) + 1)
    data = data_provider.get_data()
    print(f"{bcolors.DEBUG}in time/ : data shape: {data.shape}{bcolors.ENDC}")
    sfreq = data_provider.get_sampling_rate()
    f, CM = coherence_time_frame(data, sfreq, start, end)
    print(f"{bcolors.DEBUG}{CM.tolist()[0][0]}{bcolors.ENDC}")
    result = {"f": f.tolist(), "CM": CM.tolist()}
    write_calculation(file_name, request.url, result, session["username"])
    print(
        f"{bcolors.GETREQUEST}CM returned with {len(f)} frequencies and {len(CM[0][0])} edges {bcolors.ENDC}"
    )
    return jsonify(result)


@app.route("/granger", methods=["GET"])
def granger():
    data = data_provider.get_data()
    result = calculate_granger_for_all_pairs(data)  # calculate Granger causality
    return jsonify(result)  # return the result as JSON


# get_graph_basic_info
#   Parameters:
#      None
#  Returns:
#     layout,
#     nodes: { id, label, x?, y?,  }
#     edges: { id, from, to, label?, }
@app.route("/graph", methods=["GET"])
def get_graph_basic_info():
    # get the number of nodes according to "coherence_over_time.json" file
    # open the json file and get the value of "coherence_matrices" key
    file_name = session["user_data_dir"].split("/")[-1]
    data = data_provider.get_data()
    channel_names = data_provider.get_channel_names()
    num_nodes = data.shape[1]
    # create the ids and labels.
    nodes = []
    for i in range(num_nodes):
        nodes.append({"id": str(i), "style": {"label": {"value": channel_names[i]}}})
    # create the edges. theres an edge between every node
    edges = []
    for i in range(num_nodes):
        for j in range(i + 1, num_nodes):
            edges.append(
                {
                    "id": nodes[i]["id"] + "-" + nodes[j]["id"],
                    "source": nodes[i]["id"],
                    "target": nodes[j]["id"],
                }
            )
    layout = "circular"
    # return the result
    print(
        f"{bcolors.GETREQUEST}graph returned with {num_nodes} nodes and {len(edges)} edges{bcolors.ENDC}"
    )
    return jsonify({"layout": layout, "nodes": nodes, "edges": edges})


@app.route("/logout", methods=["GET"])
def logout():
    if "username" in session:
        print(
            f"{bcolors.GETREQUEST}user logged out: {session['username']}{bcolors.ENDC}"
        )
        session.pop("username", None)
        session.pop("user_root_dir", None)
        session.pop("user_data_dir", None)
        return jsonify({"message": "Logged out successfully!"})
    return jsonify({"message": "No user logged in!"}), 400


def get_brain_image_async(file_name, azimuth=0, elevation=90, distance=360, **kwargs):
    get_brain_image(
        file_name, azimuth=azimuth, elevation=elevation, distance=distance, **kwargs
    )


@app.route("/brainImage", methods=["GET"])
def brain_image():
    # the fields are azimuth, elevation, and distance
    azi = request.args.get("azimuth")
    ele = request.args.get("elevation")
    dis = request.args.get("distance")
    print(f"{bcolors.DEBUG}azi: {azi}, ele: {ele}, dis: {dis}{bcolors.ENDC}")
    # build file name
    file_name = "brain_images/" + "brain_image-azi_{}_ele_{}_dist_{}.png".format(
        azi, ele, dis
    )
    # check if the file exists
    # if not os.path.isfile(file_name):
    #     t = threading.Thread(
    #         target=get_brain_image_async, args=(file_name, azi, ele, dis)
    #     )
    #     t.start()
    #     t.join()
    # return the png file to the client side
    return send_file(file_name, mimetype="image/gif")


@app.route("/brainImageParamsList", methods=["GET"])
def get_image_params():
    azi_list, rot_list, ele_list = get_azi_ele_dist_lists()
    return (
        jsonify(
            {
                "azi_list": sorted(azi_list),
                "ele_list": sorted(rot_list),
                "dist_list": sorted(ele_list),
            }
        ),
        200,
    )


###############################################
############### POST REQUESTS #################
###############################################


@app.route("/data", methods=["POST"])
def receive_data():
    data = request.json
    print(data)
    # do something with data
    return "Data received"


@app.route("/exportData", methods=["POST"])
def export_data():
    print(f"{bcolors.DEBUG}exporting data{bcolors.ENDC}")
    data = request.json
    print(f"{bcolors.DEBUG}data: {data}{bcolors.ENDC}")
    start = data["time"]["start"]
    end = data["time"]["end"]
    resolution = data["time"]["resolution"]
    file_name = data["fileName"]
    connectivityMeasure = data["connectivityMeasure"]
    print(
        f"{bcolors.DEBUG}start: {start}, end: {end}, resolution: {resolution} connectivityMeasure: {connectivityMeasure}{bcolors.ENDC}"
    )
    if not os.path.isdir("exported_mat"):
        os.mkdir("exported_mat")

    date_time = datetime.now().strftime("%m-%d-%Y_%H-%M-%S")

    if not file_name:
        file_name = session["username"] + "_" + date_time

    file_name = "exported_mat/" + file_name
    # check if file is already exists
    if os.path.isfile(file_name + ".mat"):
        return jsonify({"message": "File already exists!"}), 400
    data = data_provider.get_data()
    sfreq = data_provider.get_sampling_rate()
    electrodes = data_provider.get_channel_names()
    bids_file_name = session["user_data_dir"].split("/")[-1]
    meta_data = {
        "bids_file_name": bids_file_name,
        "electrodes": electrodes,
        "date_time": date_time,
    }
    export_coherence_to_mat(
        name=file_name,
        data=data,
        sfreq=sfreq,
        start=start,
        end=end,
        meta_data=meta_data,
    )
    # do something with data
    return jsonify({"message": "Data exported successfully!"}), 200


if __name__ == "__main__":
    app.run()
