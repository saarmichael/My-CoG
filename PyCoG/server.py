import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from scipy.io import loadmat
from coherence import coherence_over_time
from output import write_coherence_over_time
from coherence import coherence_time_frame, get_recording_duration
from flask_sqlalchemy import SQLAlchemy
from consts import bcolors
import json


app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
app.secret_key = "mysecretkey"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    data_dir = db.Column(db.String(50), nullable=False)


class Calculation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data_dir = db.Column(db.String(50), nullable=False)
    coherence_calculation = db.Column(db.JSON, nullable=False)


@app.before_first_request
def create_tables():
    db.create_all()


@app.route("/login", methods=["GET"])
def login():
    name = request.args.get("username")
    # get user from db
    user = User.query.filter_by(username=name).all()
    if not user:
        return jsonify({"message": "No user found!"})
    # return user's data directory
    session["user_data_dir"] = user[0].data_dir
    session["username"] = user[0].username
    return jsonify({"data_dir": user[0].data_dir})


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    new_user = User(
        username=data["username"],
        data_dir="users_data/" + data["data"].split("\\")[-1],
    )
    db.session.add(new_user)
    db.session.commit()
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
    data = bp_data
    start = request.args.get("start")
    end = request.args.get("end")
    print(f"{bcolors.DEBUG}start: {start}, end: {end}{bcolors.ENDC}")
    # error handling
    if start is None or end is None:
        start = 0
        # end will be the last time frame
        end = get_recording_duration(data, 1000)
    f, CM = coherence_time_frame(data, 1000, start, end)
    print(f"{bcolors.DEBUG}{CM.tolist()[0][0]}{bcolors.ENDC}")
    result = {"f": f.tolist(), "CM": CM.tolist()}
    print(
        f"{bcolors.GETREQUEST}CM returned with {len(f)} frequencies and {len(CM)} electrodes {bcolors.ENDC}"
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
    user_data_dir = session["user_data_dir"].split("/")[-1]
    cals = Calculation.query
    if not cals.filter_by(data_dir=user_data_dir).first():
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
        db_cal = Calculation(
            data_dir="bp_fingerflex.mat", coherence_calculation=calculation
        )
        db.session.add(db_cal)
        db.session.commit()
    cals = cals.filter_by(data_dir=user_data_dir)[0]
    CM = cals.coherence_calculation["CM"]
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
        session.pop("username", None)
        session.pop("user_data_dir", None)
        return jsonify({"message": "Logged out successfully!"})
    return jsonify({"message": "No user logged in!"})


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
