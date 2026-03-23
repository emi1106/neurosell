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


def _should_auto_invert(gray_image: np.ndarray) -> bool:
    h, w = gray_image.shape
    border = max(1, int(min(h, w) * 0.1))

    top = gray_image[:border, :]
    bottom = gray_image[-border:, :]
    left = gray_image[:, :border]
    right = gray_image[:, -border:]
    border_pixels = np.concatenate(
        [top.reshape(-1), bottom.reshape(-1), left.reshape(-1), right.reshape(-1)]
    )

    cy0, cy1 = int(h * 0.25), int(h * 0.75)
    cx0, cx1 = int(w * 0.25), int(w * 0.75)
    center_pixels = gray_image[cy0:cy1, cx0:cx1].reshape(-1)

    border_mean = float(np.mean(border_pixels))
    center_mean = float(np.mean(center_pixels))

    # In Fashion-MNIST, background is dark and object is bright.
    return border_mean > center_mean


def _contrast_stretch(gray_image: np.ndarray) -> np.ndarray:
    low, high = np.percentile(gray_image, [2, 98])
    if high <= low:
        return np.clip(gray_image, 0.0, 255.0)

    stretched = (gray_image - low) * (255.0 / (high - low))
    return np.clip(stretched, 0.0, 255.0)


def _crop_and_center(
    gray_image: np.ndarray,
    threshold: int,
    pad_ratio: float,
    pad_value: int = 0,
    shift_x: int = 0,
    shift_y: int = 0,
) -> np.ndarray:
    mask = gray_image > threshold

    if np.any(mask):
        ys, xs = np.where(mask)
        y0, y1 = ys.min(), ys.max() + 1
        x0, x1 = xs.min(), xs.max() + 1
        cropped = gray_image[y0:y1, x0:x1]
    else:
        cropped = gray_image

    h, w = cropped.shape
    side = max(h, w)
    margin = int(np.ceil(side * pad_ratio))
    side = side + 2 * margin

    pad_top = (side - h) // 2 + shift_y
    pad_left = (side - w) // 2 + shift_x

    # Clamp to keep valid padding and preserve final square size.
    pad_top = int(np.clip(pad_top, 0, side - h))
    pad_left = int(np.clip(pad_left, 0, side - w))

    pad_bottom = side - h - pad_top
    pad_right = side - w - pad_left

    squared = np.pad(
        cropped,
        ((pad_top, pad_bottom), (pad_left, pad_right)),
        mode="constant",
        constant_values=pad_value,
    )
    return squared


def _to_28x28(gray_image: np.ndarray) -> np.ndarray:
    image_tensor = tf.convert_to_tensor(gray_image[:, :, np.newaxis], dtype=tf.float32)
    image_tensor = tf.image.resize(image_tensor, [28, 28], method="bilinear")
    image_tensor = tf.clip_by_value(tf.round(image_tensor), 0.0, 255.0)
    return tf.cast(image_tensor, tf.uint8).numpy().squeeze(-1)


def image_to_fashion_mnist_row(
    image_path: Path,
    label: int = -1,
    invert: bool = False,
    auto_invert: bool = True,
    threshold: int = 25,
    pad_ratio: float = 0.15,
    pad_value: int = 0,
    shift_x: int = 0,
    shift_y: int = 0,
):
    image_bytes = tf.io.read_file(str(image_path))
    image = tf.io.decode_image(image_bytes, channels=3, expand_animations=False)
    image = tf.image.rgb_to_grayscale(image)
    gray = tf.cast(image, tf.float32).numpy().squeeze(-1)

    if invert:
        gray = 255.0 - gray
    elif auto_invert and _should_auto_invert(gray):
        gray = 255.0 - gray

    gray = _contrast_stretch(gray)
    gray = _crop_and_center(
        gray,
        threshold=threshold,
        pad_ratio=pad_ratio,
        pad_value=pad_value,
        shift_x=shift_x,
        shift_y=shift_y,
    )
    image_28 = _to_28x28(gray)

    pixels = image_28.reshape(-1).astype(np.int32)
    return [int(label), *pixels.tolist()], image_28


def build_columns():
    return ["label"] + [f"pixel{i}" for i in range(1, 785)]


def _save_preview(image_28: np.ndarray, preview_path: Path):
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    preview_tensor = tf.convert_to_tensor(image_28[:, :, np.newaxis], dtype=tf.uint8)
    png_bytes = tf.io.encode_png(preview_tensor)
    tf.io.write_file(str(preview_path), png_bytes)


def _parse_int_list(value: str):
    return [int(x.strip()) for x in value.split(",") if x.strip()]


def _parse_float_list(value: str):
    return [float(x.strip()) for x in value.split(",") if x.strip()]


def _predict_probabilities(model, image_28: np.ndarray):
    sample = image_28.astype("float32")[np.newaxis, :, :, np.newaxis] / 255.0
    probabilities = model.predict(sample, verbose=0)[0]
    return probabilities


def _search_best_conversion(
    image_path: Path,
    label: int,
    model_path: Path,
    search_output_dir: Path,
    thresholds,
    pad_ratios,
    invert_modes,
    target_classes,
    pad_value,
    shift_x,
    shift_y,
):
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found for search: {model_path}")

    model = tf.keras.models.load_model(model_path)
    search_output_dir.mkdir(parents=True, exist_ok=True)

    results = []

    for threshold in thresholds:
        for pad_ratio in pad_ratios:
            for invert_mode in invert_modes:
                if invert_mode not in {"auto", "invert", "no-invert"}:
                    raise ValueError(
                        "Search invert mode must be one of: auto, invert, no-invert"
                    )

                invert = invert_mode == "invert"
                auto_invert = invert_mode == "auto"

                row, image_28 = image_to_fashion_mnist_row(
                    image_path=image_path,
                    label=label,
                    invert=invert,
                    auto_invert=auto_invert,
                    threshold=threshold,
                    pad_ratio=pad_ratio,
                    pad_value=pad_value,
                    shift_x=shift_x,
                    shift_y=shift_y,
                )

                probabilities = _predict_probabilities(model, image_28)
                predicted_label = int(np.argmax(probabilities))
                confidence = float(np.max(probabilities))
                target_score = float(np.sum([probabilities[c] for c in target_classes]))

                preview_name = (
                    f"thr{threshold}_pad{pad_ratio:.2f}_{invert_mode.replace('-', '_')}.png"
                )
                preview_path = search_output_dir / preview_name
                _save_preview(image_28, preview_path)

                results.append(
                    {
                        "row": row,
                        "image_28": image_28,
                        "threshold": threshold,
                        "pad_ratio": pad_ratio,
                        "invert_mode": invert_mode,
                        "predicted_label": predicted_label,
                        "predicted_name": CLASS_NAMES.get(predicted_label, "Unknown"),
                        "confidence": confidence,
                        "target_score": target_score,
                        "preview_path": preview_path,
                    }
                )

    # Prefer settings that maximize shoe-class probability, then confidence.
    results.sort(key=lambda x: (x["target_score"], x["confidence"]), reverse=True)
    return results[0], results


def main():
    parser = argparse.ArgumentParser(
        description="Convert a regular image into Fashion-MNIST CSV format."
    )
    parser.add_argument("--image", required=True, help="Path to input image.")
    parser.add_argument("--output", required=True, help="Path to output CSV file.")
    parser.add_argument(
        "--label",
        type=int,
        default=-1,
        help="Class label to write in the first column (default: -1).",
    )
    parser.add_argument(
        "--invert",
        action="store_true",
        help="Invert colors (useful when background/foreground are reversed).",
    )
    parser.add_argument(
        "--no-auto-invert",
        action="store_true",
        help="Disable automatic invert detection.",
    )
    parser.add_argument(
        "--threshold",
        type=int,
        default=25,
        help="Foreground threshold (0-255) used for auto-cropping (default: 25).",
    )
    parser.add_argument(
        "--pad-ratio",
        type=float,
        default=0.15,
        help="Padding ratio around cropped object before resize (default: 0.15).",
    )
    parser.add_argument(
        "--pad-value",
        type=int,
        default=0,
        help="Padding intensity (0-255). Use >0 for gray padding (default: 0).",
    )
    parser.add_argument(
        "--shift-x",
        type=int,
        default=0,
        help="Horizontal shift in square canvas. Positive adds more left padding.",
    )
    parser.add_argument(
        "--shift-y",
        type=int,
        default=0,
        help="Vertical shift in square canvas. Positive adds more top padding.",
    )
    parser.add_argument(
        "--append",
        action="store_true",
        help="Append row to existing CSV instead of overwriting.",
    )
    parser.add_argument(
        "--preview",
        help="Optional output path to save the final 28x28 processed image (PNG recommended).",
    )
    parser.add_argument(
        "--search",
        action="store_true",
        help="Try multiple preprocessing settings and auto-select the best one using model probabilities.",
    )
    parser.add_argument(
        "--model",
        default="artifacts/best_model.keras",
        help="Model path used for --search scoring (default: artifacts/best_model.keras).",
    )
    parser.add_argument(
        "--search-thresholds",
        default="20,30,40,50",
        help="Comma-separated thresholds to try in --search mode.",
    )
    parser.add_argument(
        "--search-pad-ratios",
        default="0.05,0.10,0.15,0.20",
        help="Comma-separated pad ratios to try in --search mode.",
    )
    parser.add_argument(
        "--search-invert-modes",
        default="auto,invert,no-invert",
        help="Comma-separated invert modes for --search mode: auto,invert,no-invert.",
    )
    parser.add_argument(
        "--target-classes",
        default="5,7,9",
        help="Comma-separated class ids to favor when scoring --search results (default: shoe classes 5,7,9).",
    )
    parser.add_argument(
        "--search-output-dir",
        default="artifacts/search_previews",
        help="Directory to save per-candidate preview images in --search mode.",
    )
    args = parser.parse_args()

    image_path = Path(args.image)
    output_path = Path(args.output)

    if not image_path.exists():
        raise FileNotFoundError(f"Input image not found: {image_path}")

    if not (0 <= args.pad_value <= 255):
        raise ValueError("--pad-value must be between 0 and 255")

    if args.search:
        thresholds = _parse_int_list(args.search_thresholds)
        pad_ratios = _parse_float_list(args.search_pad_ratios)
        invert_modes = [x.strip() for x in args.search_invert_modes.split(",") if x.strip()]
        target_classes = _parse_int_list(args.target_classes)

        best, all_results = _search_best_conversion(
            image_path=image_path,
            label=args.label,
            model_path=Path(args.model),
            search_output_dir=Path(args.search_output_dir),
            thresholds=thresholds,
            pad_ratios=pad_ratios,
            invert_modes=invert_modes,
            target_classes=target_classes,
            pad_value=args.pad_value,
            shift_x=args.shift_x,
            shift_y=args.shift_y,
        )

        row = best["row"]
        image_28 = best["image_28"]

        print("Search complete. Top candidates:")
        for result in all_results[:5]:
            print(
                "  "
                f"thr={result['threshold']} "
                f"pad={result['pad_ratio']:.2f} "
                f"invert={result['invert_mode']} "
                f"pred={result['predicted_label']} ({result['predicted_name']}) "
                f"conf={result['confidence']:.4f} "
                f"target_score={result['target_score']:.4f}"
            )

        print(
            "Selected best candidate: "
            f"pred={best['predicted_label']} ({best['predicted_name']}), "
            f"conf={best['confidence']:.4f}, "
            f"target_score={best['target_score']:.4f}, "
            f"preview={best['preview_path']}"
        )
    else:
        row, image_28 = image_to_fashion_mnist_row(
            image_path=image_path,
            label=args.label,
            invert=args.invert,
            auto_invert=not args.no_auto_invert,
            threshold=args.threshold,
            pad_ratio=args.pad_ratio,
            pad_value=args.pad_value,
            shift_x=args.shift_x,
            shift_y=args.shift_y,
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    columns = build_columns()

    row_df = pd.DataFrame([row], columns=columns)

    if args.append and output_path.exists():
        row_df.to_csv(output_path, mode="a", header=False, index=False)
    else:
        row_df.to_csv(output_path, index=False)

    print(f"Saved CSV row to: {output_path}")

    if args.preview:
        preview_path = Path(args.preview)
        _save_preview(image_28, preview_path)
        print(f"Saved preview image to: {preview_path}")


if __name__ == "__main__":
    main()
