import pytest
import random
import json
from app import app 

@pytest.fixture
def client():
    """A Test client for the app"""
    with app.test_client() as client:
        yield client

i = [[{"x": 0, "y": 0, "z": 0}]]
with open('i.json', encoding="utf-8") as json_file:
    i = json.load(json_file)
def test_detect(client):
    print("Test API /words")
    res = client.post('/detect', data=json.dumps({'letter': 'I', 'results':i}), 
    headers={'Content-Type': 'application/json', 'Accept': 'application/json'})
    assert res.status_code == 200

def test_detect_failed(client):
    print("Test API /words but failed")
    res = client.post('/detect', data=json.dumps({'letter': 'A', 'results':i}), 
    headers={'Content-Type': 'application/json', 'Accept': 'application/json'})
    assert res.status_code == 500

def test_no_api(client):
    res = client.get('/no-route')
    assert res.status_code == 404

def test_report(client):
    print("Test API /report")
    res = client.get('/report')
    letters = {"1": ['C', 'E', 'I', 'J', 'L', 'O', 'R', 'U', 'V', 'Z'], 
    "2": ['A', 'B', 'D', 'F', 'G', 'H', 'K', 'M', 'N', 'P', 'Q', 'S', 'T', 'W', 'X', 'Y']}
    num = str(random.randrange(1,2+1))
    data = res.json
    rl = random.choice(letters[num])
    assert res.status_code == 200
    assert "cm_image" and "cm_report" in data
    assert "1" and "2" in res.json['cm_image'] and data['cm_report']
    assert ".png" in res.json['cm_image']['1'] and data['cm_image']['2']
    assert all(item in [*data['cm_report'][num].keys()] for item in letters[num])
    assert 'f1-score' and 'precision' and 'recall' and 'support' in data['cm_report'][num][rl]
    assert 'accuracy' and 'macro avg' and 'weighted avg' in data['cm_report'][num]

def test_words_level(client):
    print("Test API /words/<level>")
    level = str(random.randrange(1,4+1))
    res = client.get(f'/words/{level}')
    data = res.json
    assert res.status_code == 200
    assert 'letters' and 'words' in data
    assert len(data['letters']) > 0
    assert len(data['words']) > 0



