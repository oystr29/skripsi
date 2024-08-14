from flask import Flask
from flask import request

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/detect", methods=['POST'])
def detect():
    return {
        'halo': request.form['test']
    }

