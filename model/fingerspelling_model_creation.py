import os
import sys
import numpy as np
from sklearn.svm import SVC
from sklearn.metrics import classification_report
import joblib

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
model_name = 'asl_fingerspelling_model.pkl'
if isTwo():
    model_name = 'asl_fingerspelling_model_2.pkl'
elif isOne():
    model_name = 'asl_fingerspelling_model_1.pkl'

# joblib.dump(model, model_name)

# Model Evaluation using the Test Set
y_pred = model.predict(test_data.reshape(test_data.shape[0], -1))
report = classification_report(test_labels, y_pred)

print(test_labels)
print('----------------')
print(y_pred)


# Print the report to a file
""" if isTwo():
    with open('model_evaluation_report_2.txt', 'w') as f:
        print(report, file=f)
elif isOne():
    with open('model_evaluation_report_1.txt', 'w') as f:
        print(report, file=f)
else:
    with open('model_evaluation_report.txt', 'w') as f:
        print(report, file=f) """
