import os
import sys
import numpy as np
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, ConfusionMatrixDisplay
import joblib
import json


two_hands = ['A', 'B', 'D', 'F', 'G', 'H', 'K', 'M', 'N', 'P', 'Q', 'S', 'T', 'W', 'X', 'Y']
one_hand = ['C', 'E', 'I', 'J', 'L', 'O', 'R', 'U', 'V', 'Z']

# Specifying directories
training_directory = 'dataset_text/training'
test_directory = 'dataset_text/test'

def isTwo():
    return '2'in sys.argv 

def isOne():
    return '1'in sys.argv

# Data loading from a .txt file
def load_data_from_file(file_path):
    data = []
    with open(file_path, 'r') as file:
        for line in file:
            coordinates = [float(valore) for valore in line.strip().split()]
            data.append(coordinates)
    return data

# Data loading from directory and subdirectories
def load_data_from_dir(cartella):
    data = []
    filter_dir = os.walk(cartella)
    if isTwo():
        filter_dir = filter(lambda n: n[0].split('/')[-1] in two_hands, os.walk(cartella))
    elif isOne(): 
        filter_dir = filter(lambda n: n[0].split('/')[-1] in one_hand, os.walk(cartella))
    for root, _, files in filter_dir:
        for file in files:
            if file.endswith(".txt"):
                file_path = os.path.join(root, file)
                file_data = load_data_from_file(file_path)
                data.append(file_data)
    return np.array(data)



# Training data loading
training_data = load_data_from_dir(training_directory)
test_data = load_data_from_dir(test_directory)

# Labels loading
training_labels = []
test_labels = []
for claz in os.listdir(training_directory):
    training_subdirectory = os.path.join(training_directory, claz)
    training_class_data_number = len(os.listdir(training_subdirectory))
    training_labels.extend([claz] * training_class_data_number)

for claz in os.listdir(test_directory):
    test_subdirectory = os.path.join(test_directory, claz)
    test_class_data_number = len(os.listdir(test_subdirectory))
    test_labels.extend([claz] * test_class_data_number)
if isTwo():
    training_labels = list(filter(lambda n: n in two_hands, training_labels ))
    test_labels = list(filter(lambda n: n in two_hands, test_labels ))
elif isOne():
    training_labels = list(filter(lambda n: n in one_hand, training_labels ))
    test_labels = list(filter(lambda n: n in one_hand, test_labels ))


# SVM classifier creation
model = SVC(kernel='poly')

# SVM Training
model.fit(training_data.reshape(training_data.shape[0], -1), training_labels)

# Model saving
model_name = ''
if isTwo():
    model_name = 'bisindo_model_2.pkl'
elif isOne():
    model_name = 'bisindo_model_1.pkl'
else:
    model_name = 'bisindo_model.pkl'

joblib.dump(model, model_name)

# Evaluasi Model menggunakan data tes
y_pred = model.predict(test_data.reshape(test_data.shape[0], -1))

# Hasil dalam bentuk text
report = classification_report(test_labels, y_pred)
# Hasil dalam bentuk dictionary
report_dict = classification_report(test_labels, y_pred, output_dict=True)

# Testing Model Menggunakan Confusion Matrix
cm = confusion_matrix(test_labels, y_pred)

v = cm.ravel()
print(v)
# Tampilkan tabel Confusion matrix dalam bentuk gambar
disp = ConfusionMatrixDisplay.from_predictions(test_labels, y_pred)


# Print the report to a file
if isTwo():
    disp.plot().figure_.savefig('cm2.png')
    with open('model_report_2.json', 'w') as f:
        json.dump(report_dict, f)
    with open('model_evaluation_report_2.txt', 'w') as f:
        print(report, file=f)
elif isOne():
    disp.plot().figure_.savefig('cm1.png')
    with open('model_report_1.json', 'w') as f:
        json.dump(report_dict, f)
    with open('model_evaluation_report_1.txt', 'w') as f:
        print(report, file=f)
else:
    with open('model_evaluation_report.txt', 'w') as f:
        print(report, file=f)
