import os
import sys
import pytest
import requests

from src import create_app

base_url = "http://localhost:5000"
# get the parent of the current directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

@pytest.fixture()
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            yield client

def test_login(headers):
    response = requests.get(f"{base_url}/login?username=test_user", headers=headers)
    assert response.status_code == 200

def test_get_settings(headers):
    response = requests.get(f"{base_url}/getSettings", headers=headers)
    assert response.status_code == 200

def test_get_frequencies(headers):
    response = requests.get(f"{base_url}/frequencies", headers=headers)
    assert response.status_code == 200

def test_get_time_range(headers):
    response = requests.get(f"{base_url}/duration", headers=headers)
    assert response.status_code == 200

def test_get_files(headers):
    response = requests.get(f"{base_url}/getFiles", headers=headers)
    assert response.status_code == 200

def test_get_file(headers):
    response = requests.get(f"{base_url}/getFile", headers=headers)
    assert response.status_code == 200

def test_get_coherence_matrices(headers):
    response = requests.get(f"{base_url}/connectivity", headers=headers)
    assert response.status_code == 200

def test_cache_connectivity(headers):
    response = requests.get(f"{base_url}/cacheConnectivity", headers=headers)
    assert response.status_code == 200

def test_granger(headers):
    response = requests.get(f"{base_url}/granger", headers=headers)
    assert response.status_code == 200

def test_get_time_series(headers):
    response = requests.get(f"{base_url}/timeSeries", headers=headers)
    assert response.status_code == 200

def test_get_graph_basic_info(headers):
    response = requests.get(f"{base_url}/graph", headers=headers)
    assert response.status_code == 200

def test_logout(headers):
    response = requests.get(f"{base_url}/logout", headers=headers)
    assert response.status_code == 200

def test_brain_image(headers):
    response = requests.get(f"{base_url}/brainImage", headers=headers)
    assert response.status_code == 200

def test_get_image_params(headers):
    response = requests.get(f"{base_url}/brainImageParamsList", headers=headers)
    assert response.status_code == 200

def test_connectivity_list(headers):
    response = requests.get(f"{base_url}/connectivityMeasuresList", headers=headers)
    assert response.status_code == 200

def test_register(headers):
    response = requests.post(f"{base_url}/register", headers=headers, json={"username": "test", "data": "data", "settings": "settings"})
    assert response.status_code == 200

def test_add_file(headers):
    response = requests.post(f"{base_url}/addFile", headers=headers, json={"file": "test_file"})
    assert response.status_code == 200

def test_save_settings(headers):
    response = requests.post(f"{base_url}/saveSettings", headers=headers, json={"settings": "settings"})
    assert response.status_code == 200

def test_set_file(headers):
    response = requests.post(f"{base_url}/setFile", headers=headers, json={"file": "test_file[]"})

