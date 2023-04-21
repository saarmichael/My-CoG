from flask import Flask, request, jsonify
from flask_cors import CORS
from scipy.io import loadmat
from coherence import coherence_time_frame
import json
from consts import bcolors

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# load the data
finger_bp = loadmat("bp_fingerflex.mat")
bp_data = finger_bp["data"]
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
    f = open("coherence_over_time.json", "r")
    CM = json.load(f)["coherence_matrices"]
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
