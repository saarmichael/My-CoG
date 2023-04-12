from flask import Flask, request, jsonify
from flask_cors import CORS
from scipy.io import loadmat
from coherence import coherence_time_frame

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# load the data
finger_bp = loadmat('bp_fingerflex.mat')
bp_data = finger_bp['data']
bp_data = bp_data[:, 0:10]

@app.route('/', methods=['GET'])
def hello():
    return 'Hello, World!'

@app.route('/time', methods=['GET'])
def get_time_frame():
    data = bp_data
    start = request.args.get('start')
    end = request.args.get('end')
    f, CM = coherence_time_frame(data, 1000, start, end)
    result = {'f': f.tolist(), 'CM': CM.tolist()}
    return jsonify(result)

@app.route('/data', methods=['POST'])
def receive_data():
    data = request.json
    print(data)
    # do something with data
    return 'Data received'

if __name__ == '__main__':
    app.run()
    