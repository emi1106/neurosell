from pathlib import Path

from config.settings import default_config
from training.trainer import train_and_evaluate


def main():
	base_dir = Path(__file__).resolve().parent
	config = default_config(base_dir)

	_, test_loss, test_accuracy = train_and_evaluate(config)
	print(f"Best model checkpoint: {config.checkpoint_path}")
	print(f"Test loss: {test_loss:.4f}")
	print(f"Test accuracy: {test_accuracy:.4f}")


if __name__ == "__main__":
	main()

