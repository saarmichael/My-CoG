import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from scipy.io import loadmat
from coherence import coherence_over_time
from output import write_coherence_over_time
from coherence import coherence_time_frame
from flask_sqlalchemy import SQLAlchemy
from consts import bcolors
import json


app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
app.secret_key = 'mysecretkey'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///CogDb.db'

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    data_dir = db.Column(db.String(50), nullable=False)
    settings = db.Column(db.JSON, nullable=True)
    
class Calculation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(50), nullable=False)
    data = db.Column(db.JSON, nullable=False)
    created_by = db.Column(db.String(50), nullable=False)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/users', methods=['GET', 'POST'])
def users():
    if request.method == 'POST':
        data = request.get_json()
        new_user = User(username=data['username'], data_dir='users_data/' + data['data'].split('\\')[-1], settings=None)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully!'})
    else:
        user = request.args.get('username')
        # get user from db
        users = User.query.filter_by(username=user).all()
        if not users:
            return jsonify({'message': 'No user found!'})
        # return user's data directory
        session["user_data_dir"] = users[0].data_dir
        session["username"] = users[0].username
        return jsonify({'data_dir': users[0].data_dir})

# load the data
finger_bp = loadmat('users_data/bp_fingerflex.mat')
bp_data = finger_bp['data']
bp_data = bp_data[:, 0:10]



###############################################
############### GET REQUESTS ##################
###############################################


@app.route("/", methods=["GET"])
def hello():
    return "Hello, World!"


# get_time_frame
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
    f, CM = coherence_time_frame(data, 1000, start, end)
    result = {"f": f.tolist(), "CM": CM.tolist()}
    print(
        f"{bcolors.GETREQUEST} CM returned with {len(f)} frequencies and {len(CM)} electrodes {bcolors.ENDC}"
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
    file_name = session["user_data_dir"].split('/')[-1]
    cals = Calculation.query
    if not cals.filter_by(file_name=file_name).first():
        finger_bp = loadmat(session["user_data_dir"])
        bp_data = finger_bp['data']
        bp_data = bp_data[:, 0:10]
        f, window_time, t, CM = coherence_over_time(bp_data, 1000, 10, 0.5)
        calculation = {'f': f.tolist(), 'window_time': window_time, 't': t.tolist(), 'CM': CM.tolist()}
        db_cal = Calculation(file_name=file_name, url=request.url, data=calculation, created_by=session["username"])
        db.session.add(db_cal)
        db.session.commit()
    cals = cals.filter_by(file_name=file_name)[0]    
    CM = cals.data['CM']
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
        return jsonify({'message': 'Logged out successfully!'})
    return jsonify({'message': 'No user logged in!'})

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
