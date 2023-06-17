from src.extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    user_root_dir = db.Column(db.String(50), nullable=False)
    settings = db.Column(db.JSON, nullable=True)
    load_instance = True