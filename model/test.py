import sys
import os

two = ['A', 'B', 'F']
""" print(sys.argv)


a = filter(lambda n: n[0].split('/')[-1] in two, os.walk('dataset_text/training'))

for root in a:
    print(root[0].split('/')[-1]) """




training_directory = 'dataset_text/training'
test_directory = 'dataset_text/test'
training_labels = []
test_labels = []
for claz in os.listdir(training_directory):
    training_subdirectory = os.path.join(training_directory, claz)
    training_class_data_number = len(os.listdir(training_subdirectory))
    training_labels.extend([claz] * training_class_data_number)
training_labels = list(filter(lambda n: n in two, training_labels))
print(training_labels)
