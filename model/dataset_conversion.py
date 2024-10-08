import os
import cv2
import mediapipe as mp
from sklearn.preprocessing import MinMaxScaler

amounts = {
    'A': 2,
    'B': 2,
    'C': 1,
    'D': 2,
    'E': 1,
    'F': 2,
    'G': 2,
    'H': 2,
    'I': 1,
    'J': 1,
    'K': 2,
    'L': 1,
    'M': 2,
    'N': 2,
    'O': 1,
    'P': 2,
    'Q': 2,
    'R': 1,
    'S': 2,
    'T': 2,
    'U': 1,
    'V': 1,
    'W': 2,
    'X': 2,
    'Y': 2,
    'Z': 1,
}

# Specifying directories
dataset_root = 'image_dataset'
training_dir = os.path.join(dataset_root, 'train')
test_dir = os.path.join(dataset_root, 'val')
new_dataset_root = 'dataset_text'
new_training_dir = os.path.join(new_dataset_root, 'training')
new_test_dir = os.path.join(new_dataset_root, 'test')

# MediaPipe Hands init, mp = mediapipe
mp_hands = mp.solutions.hands.Hands(
            static_image_mode=True, 
            max_num_hands=2, 
            min_detection_confidence=0.26)

# Hand Data Points retrieving
def detect_hand_data_points(image_path):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # HDP detection
    results = mp_hands.process(image_rgb)

    hand_data_points = []

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Coordinates extractions
            landmarks = hand_landmarks.landmark
            for landmark in landmarks:
                min_x = min([landmark.x for landmark in landmarks])
                max_x = max([landmark.x for landmark in landmarks])
                min_y = min([landmark.y for landmark in landmarks])
                max_y = max([landmark.y for landmark in landmarks])

                # Width & Height of the Hand Bounding Box
                bbox_width = max_x - min_x
                bbox_height = max_y - min_y

                # Normalization of x / y landmarks coordinates in the bounding box.
                normalized_lm_x = (landmark.x - min_x) / bbox_width
                normalized_lm_y = (landmark.y - min_y) / bbox_height
                hand_data_points.append((normalized_lm_x, normalized_lm_y, landmark.z))

    return hand_data_points


# Dataset creation with HDP coordinates
def create_new_dataset():
    # New dataset directories creation
    os.makedirs(new_training_dir, exist_ok=True)
    os.makedirs(new_test_dir, exist_ok=True)

    # Training dataset elaboration starting ...
    for root, dirs, files in os.walk(training_dir):
        for directory in sorted(dirs):
            source_dir = os.path.join(training_dir, directory)
            target_dir = os.path.join(new_training_dir, directory)
            os.makedirs(target_dir, exist_ok=True)
            print(f"Start Training {directory}")
            for file in os.listdir(source_dir):
                image_path = os.path.join(source_dir, file)
                hand_data_points = detect_hand_data_points(image_path)
                if hand_data_points and 21*amounts[directory] == len(hand_data_points) :
                    text_file_path = os.path.join(target_dir, directory + '_' + os.path.splitext(file)[0] + '.txt')
                    with open(text_file_path, 'w') as f:
                        for point in hand_data_points:
                            f.write(f'{point[0]} {point[1]} {point[2]}\n')
                        if 21*amounts[directory] == 21:
                            for _ in range(len(hand_data_points)):
                                f.write('0.0 0.0 0.0\n')



    # Test dataset elaboration starting ...
    for root, dirs, files in os.walk(test_dir):
        for directory in sorted(dirs):
            source_dir = os.path.join(test_dir, directory)
            target_dir = os.path.join(new_test_dir, directory)
            os.makedirs(target_dir, exist_ok=True)
            print(f"Start Test {directory}")
            for file in os.listdir(source_dir):
                image_path = os.path.join(source_dir, file)
                hand_data_points = detect_hand_data_points(image_path)
                if hand_data_points and 21*amounts[directory] == len(hand_data_points):
                    text_file_path = os.path.join(target_dir, directory + '_' + os.path.splitext(file)[0] + '.txt')
                    with open(text_file_path, 'w') as f:
                        for point in hand_data_points:
                            f.write(f'{point[0]} {point[1]} {point[2]}\n')
                        if 21*amounts[directory] == 21:
                            for _ in range(len(hand_data_points)):
                                f.write('0.0 0.0 0.0\n')

# Dataset creation function call
create_new_dataset()
