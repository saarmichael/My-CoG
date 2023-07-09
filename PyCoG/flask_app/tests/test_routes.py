import random
import sys
import os
import pytest
from flask import session
from flask.testing import FlaskClient
# get the parent of the current directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from src import create_app
from src.main.tools.bids_handler import dataProvider
from src.models.user import User
from src.models.calculation import Calculation
from src.main.analysis.connectivity import Connectivity as Conn
from unittest.mock import Mock, patch
import pytest
from datetime import datetime
from src.extensions import db

# randomize the username
name = 'testuser' + str(random.randint(1, 1000))

# This function can be used to create a client for your tests.
@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            yield client
    

# # A dummy session for testing purposes
# def _mock_session(user):
#     return {"username": user.username, "user_root_dir": user.user_root_dir, "user_data_dir": user.user_data_dir}


# A dummy user for testing purposes
def _mock_user(name):
    return User(username=name, user_root_dir='bids', settings='dummy_settings')


# # A dummy calculation for testing purposes
# def _mock_calculation():
#     return Calculation('dummy_file_name', 'dummy_url', 'dummy_data', 'dummy_user')


# # A dummy data provider for testing purposes
# def _mock_data_provider():
#     return dataProvider(Mock())



def test_register(client):
    with patch('src.main.tools.cache_check.user_in_db') as mock_user_in_db:
        mock_user = _mock_user(name)
        mock_user_in_db.return_value = None  # Ensure user does not exist

        response = client.post("/register", json={
            "username": mock_user.username,
            "data": mock_user.user_root_dir,
            "settings": mock_user.settings
        })
        print(response.get_json(), response.status_code)
        assert response.status_code == 200
        assert response.get_json() == {"message": "User created successfully!"}

def test_login(client):
    with patch('src.main.tools.cache_check.user_in_db') as mock_user_in_db:
        mock_user = _mock_user(name)
        mock_user_in_db.return_value = mock_user
        response = client.get(f"/login?username={name}")

        assert response.status_code == 200
        assert {'user_root_dir': mock_user.user_root_dir} == {"user_root_dir": mock_user.user_root_dir.split('/')[-1]}



def test_get_settings(client):
    with patch('src.main.tools') as mock_user_in_db:
        mock_user = _mock_user(name)
        mock_user_in_db.return_value = mock_user

        with client.session_transaction() as sess:
            sess['username'] = mock_user.username

        response = client.get("/getSettings")

        assert response.status_code == 200
        assert response.get_json() == mock_user.settings





def test_logout(client):
    with client.session_transaction() as sess:
        sess['username'] = name
        user = User.query.filter_by(username=name).first()
        db.session.delete(user)
        db.session.commit()

    response = client.get("/logout")
    # delete the user from the db
    

    assert response.status_code == 200
    assert response.get_json() == {"message": "Logged out successfully!"}


# Tests for other routes can be created in a similar fashion.
