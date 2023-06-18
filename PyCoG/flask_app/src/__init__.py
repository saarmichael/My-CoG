from flask import Flask
from flask_cors import CORS
from config import Config
from src.extensions import db
from src.main import bp as main_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    # Initialize Flask extensions here
    db.init_app(app)

    # Initialize blueprints here
    app.register_blueprint(main_bp)

    return app