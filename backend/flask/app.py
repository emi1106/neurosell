
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import tempfile
import numpy as np
import tensorflow as tf

from cnn.image_to_csv import image_to_fashion_mnist_row
from cnn.test import evaluate_or_predict, label_to_name

app = Flask(__name__)
CORS(app)

# Load model once at startup for efficiency
MODEL_PATH = Path(__file__).parent.parent / "cnn" / "artifacts" / "best_model.keras"
MODEL = tf.keras.models.load_model(str(MODEL_PATH)) if MODEL_PATH.exists() else None


def predict_category(image_file):
    """
    Convert user image to CSV format and use CNN model to predict clothing category.
    """
    if MODEL is None:
        return "Error: Model not loaded"
    
    try:
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_file:
            image_file.save(tmp_file.name)
            tmp_path = Path(tmp_file.name)
        
        # Convert image to Fashion MNIST format
        row, image_28 = image_to_fashion_mnist_row(
            image_path=tmp_path,
            label=-1,  # Unknown label since this is user input
            auto_invert=True
        )
        
        # Prepare image for prediction (convert row to image array)
        image_array = np.array(row[1:], dtype="float32").reshape(1, 28, 28, 1) / 255.0
        
        # Make prediction
        predictions, confidences, _ = evaluate_or_predict(
            model=MODEL,
            images=image_array,
            labels=None,
            batch_size=1
        )
        
        predicted_label = predictions[0]
        confidence = float(confidences[0])
        category_name = label_to_name(predicted_label)
        
        return {
            "category": category_name,
            # "confidence": confidence,
            "label": int(predicted_label)
        }
    
    except Exception as e:
        return {"error": str(e)}


@app.route("/create-listing", methods=["POST"])
def create_listing():

    image = request.files["image"]

    data = request.form

    brand = data.get("brand")
    size = data.get("size")
    color = data.get("color")
    condition = data.get("condition")

    # Predict category from image
    prediction_result = predict_category(image)
    
    if isinstance(prediction_result, dict) and "error" in prediction_result:
        return jsonify({"error": prediction_result["error"]}), 400
    
    category = prediction_result.get("category", "Unknown")

    # TODO: Implement recommend_price
    price = 0  # recommend_price(brand, size, condition, category)

    # TODO: Implement generate_description
    description = ""  # generate_description(brand, category, color, condition)

    return jsonify({
        "category": category,
        "confidence": prediction_result.get("confidence"),
        "recommended_price": price,
        "description": description
    })

if __name__ == "__main__":
    app.run(debug=True)
    