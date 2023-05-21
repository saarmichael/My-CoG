from flask import request, jsonify, session, send_file
from scipy.io import loadmat
from cache_check import data_in_db, user_in_db
from db_write import write_calculation, write_user
from coherence import coherence_over_time
from coherence import coherence_time_frame, get_recording_duration
from flask_sqlalchemy import SQLAlchemy
from consts import bcolors
from server_config import User, Calculation, db, app
from image_generator import get_brain_image
import os


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
    print(f"{bcolors.GETREQUEST}user logged in: {user.username}{bcolors.ENDC}")
    session["user_data_dir"] = user.data_dir
    session["username"] = user.username
    return jsonify({"data_dir": user.data_dir})


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    # check if user exists
    if user_in_db(data["username"], User.query):
        return jsonify({"message": "User already exists!"}), 400
    new_user = write_user(data["username"], data["data"], None)
    return jsonify({"message": "User created successfully!"})


# load the data
finger_bp = loadmat("users_data/bp_fingerflex.mat")
bp_data = finger_bp["data"]
# bp_data = bp_data[:, 0:10]


###############################################
############### GET REQUESTS ##################
###############################################


@app.route("/", methods=["GET"])
def hello():
    return "Hello, World!"


@app.route("/frequencies", methods=["GET"])
def getFrequencies():
    f, _ = coherence_time_frame(bp_data, 1000, 0, 1)
    print(
        f"{bcolors.GETREQUEST}frequencies returned with {len(f)} frequencies{bcolors.ENDC}"
    )
    return jsonify(f.tolist())


@app.route("/duration", methods=["GET"])
def get_time_range():
    result = get_recording_duration(bp_data, 1000)
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
    if not "user_data_dir" in session:
        session["username"] = "test"
        session["user_data_dir"] = "users_data/bp_fingerflex.mat"

    data = bp_data
    start = request.args.get("start")
    end = request.args.get("end")
    print(f"{bcolors.DEBUG}start: {start}, end: {end}{bcolors.ENDC}")
    file_name = session["user_data_dir"].split("/")[-1]
    cal = data_in_db(file_name, request.url, Calculation.query)
    if cal:
        return jsonify(cal.data)
    # error handling
    if ((start is None) or (start == "0")) or ((end is None) or (end == "0")):
        start = "0"
        # end will be the last time frame
        end = "1"
    f, CM = coherence_time_frame(data, 1000, start, end)
    print(f"{bcolors.DEBUG}{CM.tolist()[0][0]}{bcolors.ENDC}")
    result = {"f": f.tolist(), "CM": CM.tolist()}
    db_cal = write_calculation(file_name, request.url, result, session["username"])
    print(
        f"{bcolors.GETREQUEST}CM returned with {len(f)} frequencies and {len(CM[0][0])} edges {bcolors.ENDC}"
    )
    return jsonify(result)


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

    if not "user_data_dir" in session:
        session["username"] = "test"
        session["user_data_dir"] = "users_data/bp_fingerflex.mat"
    file_name = session["user_data_dir"].split("/")[-1]
    cal = data_in_db(file_name, request.url, Calculation.query)
    if cal:
        CM = cal.data["CM"]
    else:
        finger_bp = loadmat(session["user_data_dir"])
        bp_data = finger_bp["data"]
        bp_data = bp_data[:, 0:10]
        f, window_time, t, CM = coherence_over_time(bp_data, 1000, 10, 0.5)
        calculation = {
            "f": f.tolist(),
            "window_time": window_time,
            "t": t.tolist(),
            "CM": CM.tolist(),
        }
        cal = write_calculation(
            file_name, request.url, calculation, session["username"]
        )

    num_nodes = len(CM[0][0][0])
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
    if "user" in session:
        print("d")
        session.pop("username", None)
        session.pop("user_data_dir", None)
        return jsonify({"message": "Logged out successfully!"})
    return jsonify({"message": "No user logged in!"})


import threading


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


if __name__ == "__main__":
    app.run()
