from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

@app.route('/', methods=['GET'])
def hello():
    return 'Hello, World!'

@app.route('/data', methods=['POST'])
def receive_data():
    data = request.json
    print(data)
    # do something with data
    return 'Data received'

if __name__ == '__main__':
    app.run()
    