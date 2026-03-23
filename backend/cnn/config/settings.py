from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class TrainingConfig:
    train_csv: Path
    test_csv: Path
    batch_size: int = 256
    epochs: int = 20
    learning_rate: float = 1e-3
    num_classes: int = 10
    checkpoint_path: Path = Path("artifacts/best_model.keras")


def default_config(base_dir: Path) -> TrainingConfig:
    return TrainingConfig(
        train_csv=base_dir / "dataset" / "fashion-mnist_train.csv",
        test_csv=base_dir / "dataset" / "fashion-mnist_test.csv",
    )
