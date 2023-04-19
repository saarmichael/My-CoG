from flask import Flask, request, jsonify, g
from flask_cors import CORS
from scipy.io import loadmat
from coherence import coherence_time_frame
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    auth_code = db.Column(db.String(50), nullable=False)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/users', methods=['GET', 'POST'])
def users():
    if request.method == 'POST':
        data = request.get_json()
        new_user = User(username=data['username'], auth_code=data['auth_code'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully!'})
    else:
        users = User.query.all()
        output = []
        for user in users:
            user_data = {}
            user_data['id'] = user.id
            user_data['username'] = user.username
            user_data['auth_code'] = user.auth_code
            output.append(user_data)
        return jsonify({'users': output})

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
    