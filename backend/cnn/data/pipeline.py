import pandas as pd
import tensorflow as tf


def _load_fashion_mnist_csv(csv_file: str):
    data_frame = pd.read_csv(csv_file)
    labels = data_frame.iloc[:, 0].values.astype("int64")
    images = data_frame.iloc[:, 1:].values.astype("float32")
    images = images.reshape(-1, 28, 28, 1) / 255.0
    return images, labels


def get_datasets(train_csv: str, test_csv: str, batch_size: int = 128, shuffle_buffer: int = 10000):
    train_images, train_labels = _load_fashion_mnist_csv(train_csv)
    test_images, test_labels = _load_fashion_mnist_csv(test_csv)

    train_buffer = min(len(train_images), shuffle_buffer)

    train_dataset = tf.data.Dataset.from_tensor_slices((train_images, train_labels))
    train_dataset = train_dataset.cache()
    train_dataset = train_dataset.shuffle(train_buffer)
    train_dataset = train_dataset.batch(batch_size).prefetch(tf.data.AUTOTUNE)

    test_dataset = tf.data.Dataset.from_tensor_slices((test_images, test_labels))
    test_dataset = test_dataset.cache()
    test_dataset = test_dataset.batch(batch_size).prefetch(tf.data.AUTOTUNE)

    return train_dataset, test_dataset
