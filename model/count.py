import os
import json

data = {
    'img': {
        'train': {},
        'test': {},
        'sum_train': 0,
        'sum_test': 0,
    },
    'sum_img': 0,
    'txt': {
        'train': {},
        'test': {},
        'sum_train': 0,
        'sum_test': 0,
    },
    'sum_txt': 0
}

dataset_root = 'image_dataset'
training_dir = os.path.join(dataset_root, 'train')
test_dir = os.path.join(dataset_root, 'val')

# Train Image
for root, dirs, files in os.walk(training_dir):
    for directory in sorted(dirs):
        source_dir = os.path.join(training_dir, directory)
        data['img']['train'][directory] = len(os.listdir(source_dir))
        data['img']['sum_train']+= len(os.listdir(source_dir))



# Test Image
for root, dirs, files in os.walk(test_dir):
    for directory in sorted(dirs):
        source_dir = os.path.join(test_dir, directory)
        data['img']['test'][directory] = len(os.listdir(source_dir))
        data['img']['sum_test']+= len(os.listdir(source_dir))

data['sum_img'] = data['img']['sum_train'] + data['img']['sum_test']


#### TEXT ####

dataset_root = 'dataset_text'
training_dir = os.path.join(dataset_root, 'training')
test_dir = os.path.join(dataset_root, 'test')

# Train Txt
for root, dirs, files in os.walk(training_dir):
    for directory in sorted(dirs):
        source_dir = os.path.join(training_dir, directory)
        data['txt']['train'][directory] = len(os.listdir(source_dir))
        data['txt']['sum_train']+= len(os.listdir(source_dir))



# Test Image
for root, dirs, files in os.walk(test_dir):
    for directory in sorted(dirs):
        source_dir = os.path.join(test_dir, directory)
        data['txt']['test'][directory] = len(os.listdir(source_dir))
        data['txt']['sum_test']+= len(os.listdir(source_dir))

data['sum_txt'] = data['txt']['sum_train'] + data['txt']['sum_test']

print(data)
with open('count.json', 'w') as fp:
    json.dump(data, fp)

git filter-repo --commit-callback "
if commit.original_id == b'7e1938d5a89404c7ffca4e17d220eba9929264a1':
    print('gilsss')
    commit.ignore = True"
