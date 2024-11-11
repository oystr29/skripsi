from flask import Flask, abort, json
from flask import request
from flask_cors import CORS
from flasgger import Swagger
import numpy as np
import joblib

app = Flask(__name__)
swagger = Swagger(app)
CORS(app)

cm_report = {
    "1": None,
    "2": None,
}

count = {'': ''}
ravel = {
    "1": {
        "ravel": [],
        "letter": []
    },
    "2": {
        "ravel": [],
        "letter": []
    },
}

with open('model/model_report_1.json', encoding="utf-8") as json_file:
    cm_report['1'] = json.load(json_file)
with open('model/model_report_2.json', encoding="utf-8") as json_file:
    cm_report['2'] = json.load(json_file)
with open('model/count.json', encoding="utf-8") as json_file:
    count = json.load(json_file)
with open('model/ravel1.json', encoding="utf-8") as json_file:
    ravel['1'] = json.load(json_file)
with open('model/ravel2.json', encoding="utf-8") as json_file:
    ravel['2'] = json.load(json_file)
# print(cm_report)


data_text = {
    '1': {
        'letters': ['C', 'E', 'I', 'L', 'O', 'U', 'V'],
        'words': [
            'LOVE',
            'OLI',
            'LECI',
            'OVI',
            'ULUR',
        ]
    },
    '2': {
        'letters': ['A', 'B', 'D', 'F', 'G', 'H', 'K', 'M', 'N', 'P', 'Q'  ],
        'words': [
            'BAN',
            'DAMI',
            'FANA',
            'QALBU',
            'HALDA',
            'PAHAT',
            'KAKA'
        ]
    },
    '3': {
        'letters': ['J', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
        'words': [
            'JIRA',
            'HERU',
            'LARA',
            'QORIN',
            'FAJAR',
            'XAVI',
            'ZOD',
            'SAWAH',
        ]
    },
    '4': {
        'letters': ['Semua Huruf'],
        'words': [
            'OKTA',
            'YUJU',
            'YEOCHIN',
            'NAVI',
            'KEREN',
        ]
    }
}

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/count")
def counts():
    return count

@app.route("/report")
def report():
    """
        API untuk mendapatkan report confussion matrix

        ---
        responses:
            200:
                description: A successful response
                examples:
                    application/json: {
                    'cm_report': 'Hahah',
                    'cm'
                    }
    """
    return {
        'cm_report': cm_report,
        'cm_image': {
            '1': f'{request.url_root}static/img/cm/cm1.png',
            '2': f'{request.url_root}static/img/cm/cm2.png'
        },
        'ravel': ravel
    }

@app.route("/words/<level>", methods=['GET'])
def words(level):
    """
        Endpoint untuk mendapatkan list huruf berdasarkan level
        ---
        responses:
            200:
                description: A successful response
    """
    return data_text[level]

@app.route("/img/<letter>", methods=['GET'])
def img(letter):
    return {
        'data': f'{request.url_root}static/img/{letter}.png'
    }

@app.route("/detect", methods=['POST'])
def detect():
    """
        Endpoint untuk deteksi alfabet menggunakan model 
        ---
        responses:
            200:
                description: A successful response
    """
    multi_hand_landmarks = request.json['results']
    letter = request.json['letter']
    if multi_hand_landmarks is None and letter is None: 
        abort(500, 'Error gak ada data')

    hand_data_points = []
    for hand in multi_hand_landmarks:
        hand_data_point = []
        for landmark in hand:
            min_x = min([landmark['x'] for landmark in hand ])
            max_x = max([landmark['x'] for landmark in hand ])
            min_y = min([landmark['y'] for landmark in hand ])
            max_y = max([landmark['y'] for landmark in hand ])

            bbox_width = max_x - min_x
            bbox_height = max_y - min_y

            normalized_x = (landmark['x'] - min_x) / bbox_width
            normalized_y = (landmark['y'] - min_y) / bbox_height
            hand_data_point.extend([normalized_x, normalized_y, landmark['z']])
        hand_data_points.append(hand_data_point)

    model_path = 'model/bisindo_fingerspelling_model.pkl'
    zero = []
    for _ in range(63):
        zero.append(0.0)
    if len(hand_data_points) == 1:
        hand_data_points[0] += zero
        model_path = 'model/bisindo_fingerspelling_model_1.pkl'
    elif len(hand_data_points) == 2:
        hand_data_points = [hand_data_points[0] + hand_data_points[1]]
        model_path = 'model/bisindo_fingerspelling_model_2.pkl'
    hand_data_points = np.array(hand_data_points)
    hand_data_points = hand_data_points.reshape(hand_data_points.shape[0], -1)
    # print(hand_data_points)

    model = joblib.load(model_path)

    prediction = model.predict(hand_data_points)
    emoji =  '✅' if letter == prediction[0] else '❌'
    print(f"""
    --------------------------
    |
    | INPUT: {letter}
    | OUTPUT: {prediction[0]}
    | {emoji}
    |
    ---------------------------
    """)

    if letter != prediction[0]:
        abort(500, 'Error gan')
    
    print(f'prediction: {prediction[0]}')
    return {
        'message': 'Berhasil Detect Huruf',
    } 

