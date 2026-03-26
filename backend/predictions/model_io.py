import os

import joblib


# Central path for the serialized ML model artifact.
MODEL_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "model.pkl")


def save_trained_model(model, model_path=MODEL_FILE):
    """Persist a trained ML model so Django can load it for inference."""
    joblib.dump(model, model_path)


def load_trained_model(model_path=MODEL_FILE):
    """Load a persisted model artifact if it exists; otherwise return None."""
    if not os.path.exists(model_path):
        return None
    return joblib.load(model_path)
