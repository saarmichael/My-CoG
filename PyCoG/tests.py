import pytest
from flask import session
from server_config import app, db
from server_config import User, Calculation


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
    db.session.remove()
    db.drop_all()


def test_register_new_user(client):
    response = client.post('/register', json={
        'username': 'testuser',
        'data': 'somedata',
        'settings': 'somesettings'
    })
    assert response.status_code == 200
    assert response.get_json()['message'] == 'User created successfully!'


def test_login_existent_user(client):
    testuser = User(username='testuser', user_root_dir='somedata', settings='somesettings')
    db.session.add(testuser)
    db.session.commit()
    response = client.get('/login?username=testuser')
    assert response.status_code == 200


def test_get_settings_without_login(client):
    response = client.get('/getSettings')
    assert response.status_code == 400
    assert response.get_json()['message'] == 'Session error'


def test_get_settings_with_login(client):
    testuser = User(username='testuser', user_root_dir='somedata', settings='somesettings')
    db.session.add(testuser)
    db.session.commit()
    client.get('/login?username=testuser')
    response = client.get('/getSettings')
    assert response.status_code == 200
    assert response.get_json() == 'somesettings'
