
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import tempfile
import sys
import numpy as np
import tensorflow as tf
import uuid

# Add parent directory to path to allow importing cnn module
sys.path.insert(0, str(Path(__file__).parent.parent))

from cnn.image_to_csv import image_to_fashion_mnist_row
from cnn.test import evaluate_or_predict, label_to_name
from database import init_db
from models import Listing
from ProductDescriptionLLM import generate_description

app = Flask(__name__)
CORS(app)

# Initialize database on startup
init_db()

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


@app.route("/predict-category", methods=["POST", "OPTIONS"])
def predict_category_endpoint():
    """Predict clothing category from uploaded image."""
    # Handle CORS preflight request
    if request.method == "OPTIONS":
        return "", 204

    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files["image"]
    
    if image.filename == "":
        return jsonify({"error": "No image selected"}), 400

    # Predict category from image
    prediction_result = predict_category(image)
    
    if isinstance(prediction_result, dict) and "error" in prediction_result:
        return jsonify({"error": prediction_result["error"]}), 400
    
    return jsonify({
        "category": prediction_result.get("category"),
        "label": prediction_result.get("label")
    })


@app.route("/create-listing", methods=["POST", "OPTIONS"])
def create_listing():
    # Handle CORS preflight request
    if request.method == "OPTIONS":
        return "", 204

    image = request.files["image"]

    data = request.form

    brand = data.get("brand")
    size = data.get("size")
    color = data.get("color")
    condition = data.get("condition")
    user_id = data.get("user_id", str(uuid.uuid4()))  # Generate user_id if not provided
    predicted_label_from_frontend = data.get("predicted_label")

    # Use predicted label from frontend if available, otherwise predict from image
    if predicted_label_from_frontend is not None:
        # Label was already predicted when image was uploaded
        predicted_label = int(predicted_label_from_frontend)
        category = label_to_name(predicted_label)
        confidence = None
    else:
        # Predict category from image
        prediction_result = predict_category(image)
        
        if isinstance(prediction_result, dict) and "error" in prediction_result:
            return jsonify({"error": prediction_result["error"]}), 400
        
        category = prediction_result.get("category", "Unknown")
        predicted_label = prediction_result.get("label")
        confidence = prediction_result.get("confidence")

    # TODO: Implement recommend_price
    price = 0  # recommend_price(brand, size, condition, category)

    # TODO: Implement generate_description
    description = ""  # generate_description(brand, category, color, condition)

    # Save listing to database
    result = Listing.create(
        user_id=user_id,
        brand=brand,
        size=size,
        color=color,
        condition=condition,
        category=category,
        predicted_label=predicted_label,
        confidence=confidence,
        recommended_price=price,
        description=description,
        image_path=None  # TODO: Save image and store path
    )
    
    if not result["success"]:
        return jsonify({"error": result.get("error", "Failed to save listing")}), 500

    return jsonify({
        "listing_id": result["listing_id"],
        "category": category,
        "confidence": confidence,
        "recommended_price": price,
        "description": description
    })

@app.route("/listings/<user_id>", methods=["GET"])
def get_user_listings(user_id):
    """Retrieve all listings for a user."""
    listings = Listing.get_by_user(user_id)
    return jsonify({"listings": listings, "count": len(listings)})

@app.route("/listing/<int:listing_id>", methods=["GET"])
def get_listing(listing_id):
    """Retrieve a specific listing by ID."""
    listing = Listing.get_by_id(listing_id)
    
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    
    return jsonify(listing)

@app.route("/listing/<int:listing_id>", methods=["PUT"])
def update_listing(listing_id):
    """Update a listing."""
    data = request.get_json()
    
    result = Listing.update(listing_id, **data)
    
    if not result["success"]:
        return jsonify({"error": result.get("error", "Failed to update listing")}), 500
    
    # Return updated listing
    listing = Listing.get_by_id(listing_id)
    return jsonify(listing)

@app.route("/listing/<int:listing_id>", methods=["DELETE"])
def delete_listing(listing_id):
    """Delete a listing."""
    result = Listing.delete(listing_id)
    
    if not result["success"]:
        return jsonify({"error": result.get("error", "Failed to delete listing")}), 500
    
    return jsonify({"success": True, "message": "Listing deleted successfully"})

@app.route("/listing/<int:listing_id>/label", methods=["GET"])
def get_listing_label(listing_id):
    """Get predicted label for a specific listing."""
    listing = Listing.get_by_id(listing_id)
    
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    
    return jsonify({
        "listing_id": listing_id,
        "predicted_label": listing["predicted_label"],
        "category": listing["category"],
        "confidence": listing["confidence"]
    })

@app.route("/labels/<user_id>", methods=["GET"])
def get_user_labels(user_id):
    """Get all predicted labels for a user's listings."""
    listings = Listing.get_by_user(user_id)
    
    labels_data = []
    for listing in listings:
        labels_data.append({
            "listing_id": listing["id"],
            "predicted_label": listing["predicted_label"],
            "category": listing["category"],
            "confidence": listing["confidence"],
            "created_at": listing["created_at"]
        })
    
    return jsonify({
        "user_id": user_id,
        "labels": labels_data,
        "count": len(labels_data)
    })

@app.route("/label-info", methods=["GET"])
def get_label_info():
    """Get mapping of all available clothing labels."""
    # Fashion MNIST categories (0-9)
    label_mapping = {}
    for i in range(10):
        label_mapping[i] = label_to_name(i)
    
    return jsonify({
        "labels": label_mapping,
        "total_categories": len(label_mapping)
    })

@app.route("/generate-description", methods=["POST", "OPTIONS"])
def generate_item_description():
    """Generate product description using LLM."""
    # Handle CORS preflight request
    if request.method == "OPTIONS":
        return "", 204
    
    try:
        data = request.get_json()
        
        # Extract only the required fields
        condition = data.get("condition", "")
        size = data.get("size", "")
        category = data.get("category", "")
        brand = data.get("brand", "")
        
        print(f"DEBUG: Generating description with - condition: {condition}, size: {size}, category: {category}, brand: {brand}")
        
        # Call the LLM to generate description
        description = generate_description(
            condition=condition,
            size=size,
            category=category,
            brand=brand
        )
        
        print(f"DEBUG: Description generated: {description}")
        
        return jsonify({
            "success": True,
            "description": description
        })
    
    except Exception as e:
        import traceback
        error_msg = str(e)
        traceback.print_exc()
        print(f"ERROR: {error_msg}")
        return jsonify({
            "error": f"Failed to generate description: {error_msg}"
        }), 500

if __name__ == "__main__":
    app.run(debug=True)
    