from __future__ import annotations

from pathlib import Path

import pandas as pd


PROCESSED_DIR = Path(__file__).resolve().parent.parent / "data" / "processed"


def save_processed_dataset(df: pd.DataFrame, output_path: str | Path | None = None) -> Path:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    target = Path(output_path) if output_path else PROCESSED_DIR / "processed_dataset.csv"
    df.to_csv(target, index=False)
    return target
