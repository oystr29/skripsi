import cv2
from mediapipe.python.solutions import drawing_utils
from mediapipe.python.solutions.hands import Hands
from sklearn.metrics import accuracy_score  # Import accuracy_score to evaluate the model
import numpy as np
import joblib

# MediaPipe Hands init
hands = Hands(max_num_hands=2, min_detection_confidence=0.2)
mpDraw = drawing_utils

path = './image_dataset/val/A/augmented_image_0.jpg'
src = cv2.imread(path)
image = cv2.cvtColor(src, cv2.COLOR_BGR2RGB)
results = hands.process(image)


if results.multi_hand_landmarks:
    print(results.multi_hand_landmarks)
    print('------------------------------')
    hand_data_points = []
    for hand in results.multi_hand_landmarks:
        hand_data_point = []
        landmarks = hand.landmark
        for landmark in landmarks:
            min_x = min([landmark.x for landmark in landmarks])
            max_x = max([landmark.x for landmark in landmarks])
            min_y = min([landmark.y for landmark in landmarks])
            max_y = max([landmark.y for landmark in landmarks])

            # Width & Height of the Hand Bounding Box
            bbox_width = max_x - min_x
            bbox_height = max_y - min_y

            # Normalization of x / y landmarks coordinates in the bounding box.
            normalized_x = (landmark.x - min_x) / bbox_width
            normalized_y = (landmark.y - min_y) / bbox_height
            z = landmark.z
            hand_data_point.extend([normalized_x, normalized_y, z])
        hand_data_points.append(hand_data_point)

         # Load saved Model
    model_path = 'bisindo_fingerspelling_model.pkl'
    zero = []
    for i in range(63):
        zero.append(0.0)
    if len(hand_data_points) == 1:
        hand_data_points[0] += zero
        modal_path = 'bisindo_fingerspelling_model_1.pkl'
    elif len(hand_data_points) == 2:
        hand_data_points = [hand_data_points[0] + hand_data_points[1]]
        modal_path = 'bisindo_fingerspelling_model_2.pkl'
    print(hand_data_points)
    hand_data_points = np.array(hand_data_points)
    hand_data_points = hand_data_points.reshape(hand_data_points.shape[0], -1)

    model = joblib.load(model_path)
    prediction = model.predict(hand_data_points)
    # accuracy = accuracy_score(model, prediction)
    print(prediction)

    predicted_letter = prediction[0]

