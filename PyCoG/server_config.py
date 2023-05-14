from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
app.secret_key = "mysecretkey"

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