from pathlib import Path
import tensorflow as tf


def build_callbacks(checkpoint_path: Path):
    checkpoint_path.parent.mkdir(parents=True, exist_ok=True)

    return [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_accuracy",
            patience=5,
            mode="max",
            restore_best_weights=True,
            verbose=1,
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=2,
            min_lr=1e-6,
            verbose=1,
        ),
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(checkpoint_path),
            monitor="val_accuracy",
            mode="max",
            save_best_only=True,
            verbose=1,
        ),
    ]
