import tensorflow as tf

from config.settings import TrainingConfig
from data.pipeline import get_datasets
from models.fashion_cnn import build_model
from training.callbacks import build_callbacks


def train_and_evaluate(config: TrainingConfig):
    train_dataset, test_dataset = get_datasets(
        train_csv=str(config.train_csv),
        test_csv=str(config.test_csv),
        batch_size=config.batch_size,
    )

    model = build_model(num_classes=config.num_classes)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=config.learning_rate),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )

    callbacks = build_callbacks(config.checkpoint_path)
    model.fit(
        train_dataset,
        epochs=config.epochs,
        validation_data=test_dataset,
        callbacks=callbacks,
        verbose=1,
    )

    test_loss, test_accuracy = model.evaluate(test_dataset, verbose=0)
    return model, test_loss, test_accuracy
