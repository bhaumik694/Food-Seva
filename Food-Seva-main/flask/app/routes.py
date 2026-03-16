from datetime import timedelta
import cloudinary
import cloudinary.uploader
from flask import Blueprint,request,jsonify
from geopy.distance import geodesic
from app.utils.sendSms import sendSms
from app.utils.getResponse import getResponse
import requests
import cv2
import tensorflow as tf
from PIL import Image
import numpy as np
from io import BytesIO
import os

routes = Blueprint('routes', __name__)
cloudinary.config( 
    cloud_name = "dgnvupmsf", 
    api_key = "625988952518527", 
    api_secret = os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)
model = tf.keras.models.load_model(r"C:\AAGAM SHAH\New folder\Food-Seva\flask\app\utils\food_classifier.h5")

def upload_to_cloudinary(file):
    response = cloudinary.uploader.upload(file)
    return response["secure_url"]

@routes.route('/')
def index():
    return 'hello world'

def calculate_distance(coord1, coord2):
    return geodesic(coord1, coord2).km

NGO_LIST = [
    {"name": "Helping Hands", "phone": "+917045454218", "address": {"coordinates": [18.940123, 72.842345]}},
    {"name": "Food Relief NGO", "phone": "+918779631531", "address": {"coordinates": [18.936541, 72.815234]}},
    {"name": "Hunger Free India", "phone": "+919152747228", "address": {"coordinates": [28.6900, 77.1200]}},
    {"name": "GareebDesh", "phone": "+917045454218", "address": {"coordinates": [19.280967, 72.855766]}},
]
def predict_image(image_url):
    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content)).convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    prediction = model.predict(image_array)
    label = "Fresh" if prediction[0] > 0.5 else "Rotten"
    return label
@routes.route("/upload-food", methods=["POST"])
def upload_food():
    try:
        data = request.get_json()
        donor_name=data["donor"]
        food_details = ", ".join([f"{item['totalQuantity']} of {item['foodName']}" for item in data["foodItems"]])
        donor_location = (data["pickupLocation"]["coordinates"]["lat"], data["pickupLocation"]["coordinates"]["lng"])
        print(data['pickupLocation']["coordinates"]['lat'])

        nearby_ngos = [
              ngo for ngo in NGO_LIST if calculate_distance(donor_location, ngo["address"]["coordinates"]) <= 5
        ]
        if not nearby_ngos:
            return jsonify({"message": "No NGOs found within 5 km"}), 200

        sms_results = []
        for ngo in nearby_ngos:
            sms_sid = sendSms(ngo, donor_name, food_details)
            sms_results.append({"ngo": ngo["name"], "sms_sid": sms_sid})

        return jsonify({
            "message": f"{len(nearby_ngos)} NGOs notified",
            "nearby_ngos": nearby_ngos
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@routes.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        print(data["user_input"])
        response = getResponse(data["user_input"])
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@routes.route("/uploadoncloud", methods=["POST"])
def uploadoncloud():
    if "images" not in request.files:
        return jsonify({"error": "No images uploaded"}), 400

    predictions = []
    files = request.files.getlist("images")

    for file in files:
        image_url = upload_to_cloudinary(file)
        if image_url:
            label = predict_image(image_url)
            predictions.append({"image_url": image_url, "prediction": label})
        else:
            return jsonify({"error": "Image upload failed"}), 500

    if not predictions:
        return jsonify({"error": "No valid predictions"}), 400
    
    return jsonify({"message": "Upload successful", "predictions": predictions}), 200
