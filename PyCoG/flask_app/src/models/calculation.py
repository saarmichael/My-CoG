from src.extensions import db

class Calculation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.DateTime, nullable=False)
    file_name = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(50), nullable=False)
    data = db.Column(db.JSON, nullable=False)
    created_by = db.Column(db.String(50), nullable=False)