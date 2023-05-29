from flask import request, jsonify, send_file, session
from granger import calculate_granger_for_all_pairs
from util import get_data
from cache_check import data_in_db, user_in_db
from db_write import write_calculation, write_user
from coherence import coherence_over_time
from coherence import coherence_time_frame, get_recording_duration
from consts import bcolors
from server_config import User, Calculation, db, app
from image_generator import get_brain_image
import os
import threading


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
    session["user_data_dir"] = user.data_dir
    session["username"] = user.username
    print(f"{bcolors.GETREQUEST}user logged in: {user.username}{bcolors.ENDC}")
    return jsonify({"data_dir": user.data_dir})


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    # check if user exists
    if user_in_db(data["username"], User.query):
        return jsonify({"message": "User already exists!"}), 400
    write_user(data["username"], data["data"], data["settings"])
    return jsonify({"message": "User created successfully!"})


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
    file = get_data()
    f, _ = coherence_time_frame(file, 1000, 0, 1)
    print(
        f"{bcolors.GETREQUEST}frequencies returned with {len(f)} frequencies{bcolors.ENDC}"
    )
    return jsonify(f.tolist())


@app.route("/duration", methods=["GET"])
def get_time_range():
    data = get_data()
    result = get_recording_duration(data, 1000)
    print(f"{bcolors.GETREQUEST}returned duration: {result}{bcolors.ENDC}")
    return jsonify(result)


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
    file_name = session["user_data_dir"].split("/")[-1]
    cal = data_in_db(file_name, request.url, Calculation.query)
    if cal:
        return jsonify(cal.data)
    # error handling
    if start is None:
        start = "0"
        # end will be the last time frame
    if end is None:
        end = "1"
    if int(start) > int(end):
        end = str(int(start) + 1)
    data = get_data()
    print(f"{bcolors.DEBUG}in time/ : data shape: {data.shape}{bcolors.ENDC}")
    f, CM = coherence_time_frame(data, 1000, start, end)
    print(f"{bcolors.DEBUG}{CM.tolist()[0][0]}{bcolors.ENDC}")
    result = {"f": f.tolist(), "CM": CM.tolist()}
    # db_cal = write_calculation(file_name, request.url, result, session["username"])
    print(
        f"{bcolors.GETREQUEST}CM returned with {len(f)} frequencies and {len(CM[0][0])} edges {bcolors.ENDC}"
    )
    return jsonify(result)


@app.route("/granger", methods=["GET"])
def granger():
    data = get_data()
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
    num_nodes = get_data().shape[1]
    # create the ids and labels.
    nodes = []
    for i in range(num_nodes):
        nodes.append({"id": str(i), "label": "Electrode " + str(i)})
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
    file_name = "brain_images/" + "brain_image_" + azi + "_" + ele + "_" + dis + ".png"
    # check if the file exists
    if not os.path.isfile(file_name):
        t = threading.Thread(
            target=get_brain_image_async, args=(file_name, azi, ele, dis)
        )
        t.start()
        t.join()
    # return the png file to the client side
    return send_file(file_name, mimetype="image/gif")


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
    # do something with data
    return "Data received"


if __name__ == "__main__":
    app.run()
