import argparse
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf


CLASS_NAMES = {
    0: "T-shirt/top",
    1: "Trouser",
    2: "Pullover",
    3: "Dress",
    4: "Coat",
    5: "Sandal",
    6: "Shirt",
    7: "Sneaker",
    8: "Bag",
    9: "Ankle boot",
}


def label_to_name(label: int) -> str:
    return CLASS_NAMES.get(int(label), "Unknown")


def load_csv(csv_path: Path):
    data_frame = pd.read_csv(csv_path)

    if data_frame.shape[1] not in (784, 785):
        raise ValueError(
            "CSV must have either 784 columns (pixels only) or 785 columns "
            "(label + 784 pixels)."
        )

    labels = None
    pixel_frame = data_frame

    if data_frame.shape[1] == 785:
        labels = data_frame.iloc[:, 0].values.astype("int64")
        pixel_frame = data_frame.iloc[:, 1:]

    images = pixel_frame.values.astype("float32").reshape(-1, 28, 28, 1) / 255.0
    return images, labels


def evaluate_or_predict(model, images, labels, batch_size):
    probabilities = model.predict(images, batch_size=batch_size, verbose=0)
    predictions = np.argmax(probabilities, axis=1)
    confidences = np.max(probabilities, axis=1)

    metrics = None
    if labels is not None:
        valid_mask = (labels >= 0) & (labels <= 9)
        if np.any(valid_mask):
            valid_images = images[valid_mask]
            valid_labels = labels[valid_mask]
            test_loss, test_accuracy = model.evaluate(
                valid_images,
                valid_labels,
                batch_size=batch_size,
                verbose=0,
            )
            metrics = {
                "loss": float(test_loss),
                "accuracy": float(test_accuracy),
                "evaluated_samples": int(valid_mask.sum()),
            }

    return predictions, confidences, metrics


def main():
    parser = argparse.ArgumentParser(
        description="Test any Fashion-MNIST-style CSV against a saved Keras model."
    )
    parser.add_argument("--csv", required=True, help="Path to CSV file to test.")
    parser.add_argument(
        "--model",
        default="artifacts/best_model.keras",
        help="Path to saved .keras model (default: artifacts/best_model.keras).",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=256,
        help="Batch size for prediction/evaluation (default: 256).",
    )
    parser.add_argument(
        "--save-predictions",
        help="Optional output CSV path to save predictions and confidences.",
    )
    args = parser.parse_args()

    csv_path = Path(args.csv)
    model_path = Path(args.model)

    if not csv_path.exists():
        raise FileNotFoundError(f"CSV file not found: {csv_path}")
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    images, labels = load_csv(csv_path)
    model = tf.keras.models.load_model(model_path)

    predictions, confidences, metrics = evaluate_or_predict(
        model=model,
        images=images,
        labels=labels,
        batch_size=args.batch_size,
    )

    print(f"Samples: {len(images)}")
    print("First 10 predicted labels:", predictions[:10].tolist())
    print("First 10 predicted types:", [label_to_name(x) for x in predictions[:10]])

    if len(predictions) == 1:
        print(f"Predicted clothing type: {label_to_name(predictions[0])}")

    if metrics is not None:
        print(f"Evaluated samples: {metrics['evaluated_samples']}")
        print(f"Loss: {metrics['loss']:.4f}")
        print(f"Accuracy: {metrics['accuracy']:.4f}")
    else:
        print("No valid labels found for evaluation; predictions only.")

    if args.save_predictions:
        output_path = Path(args.save_predictions)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        result_frame = pd.DataFrame(
            {
                "predicted_label": predictions.astype(int),
                "predicted_type": [label_to_name(x) for x in predictions],
                "confidence": confidences.astype(float),
            }
        )

        if labels is not None:
            result_frame.insert(0, "actual_label", labels.astype(int))
            result_frame.insert(1, "actual_type", [label_to_name(x) for x in labels])
            valid_actual = (labels >= 0) & (labels <= 9)
            correct = np.where(valid_actual, predictions == labels, False)
            result_frame["correct"] = correct

        result_frame.to_csv(output_path, index=False)
        print(f"Saved predictions to: {output_path}")


if __name__ == "__main__":
    main()
