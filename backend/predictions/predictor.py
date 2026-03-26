from functools import lru_cache

from .model_io import load_trained_model


@lru_cache(maxsize=1)
def _load_model_bundle():
    """Load model artifact once per process.

    Expected formats:
    1) dict bundle: {"model": model, "label_encoders": {...}, "feature_columns": [...]}
    2) raw fitted sklearn estimator
    """
    artifact = load_trained_model()
    if artifact is None:
        return None, {}, None

    if isinstance(artifact, dict):
        model = artifact.get("model")
        encoders = artifact.get("label_encoders") or {}
        feature_columns = artifact.get("feature_columns")
        return model, encoders, feature_columns

    return artifact, {}, None


def _encode_soil(soil_type, encoders):
    soil_encoder = encoders.get("Soil_Type") or encoders.get("soil_type")
    if soil_encoder is not None:
        return int(soil_encoder.transform([str(soil_type)])[0])

    # Fallback consistent with LabelEncoder alphabetical behavior for expected soil values.
    fallback_map = {
        "Clay": 0,
        "Loamy": 1,
        "Peaty": 2,
        "Sandy": 3,
        "Silt": 4,
    }
    return fallback_map.get(str(soil_type), 0)


def _row_for_model(soil_type, irrigation, fertilizer_used, days_of_harvest, temperature, rainfall, encoders, feature_columns, model):
    """Build feature vector in the same order expected by the trained model."""
    encoded_soil = _encode_soil(soil_type, encoders)
    base = {
        "Soil_Type": encoded_soil,
        "soil_type": encoded_soil,
        "Rainfall_mm": float(rainfall),
        "rainfall": float(rainfall),
        "Temperature_C": float(temperature),
        "Temperature_Celsius": float(temperature),
        "temperature": float(temperature),
        "Fertilizer": int(bool(fertilizer_used)),
        "Fertilizer_Used": int(bool(fertilizer_used)),
        "fertilizer_used": int(bool(fertilizer_used)),
        "Irrigation": int(bool(irrigation)),
        "Irrigation_Used": int(bool(irrigation)),
        "irrigation": int(bool(irrigation)),
        "Days_to_Harvest": int(days_of_harvest),
        "days_of_harvest": int(days_of_harvest),
    }

    ordered_features = feature_columns
    if not ordered_features and hasattr(model, "feature_names_in_"):
        ordered_features = list(model.feature_names_in_)

    if ordered_features:
        return [[base.get(col, 0) for col in ordered_features]]

    # Last resort for raw estimators with no feature names metadata.
    return [[
        encoded_soil,
        float(rainfall),
        float(temperature),
        int(bool(fertilizer_used)),
        int(bool(irrigation)),
        int(days_of_harvest),
    ]]


def _fallback_rule_based(soil_type, irrigation, fertilizer_used, days_of_harvest, temperature, rainfall):
    score = 0

    if soil_type == "Loamy":
        score += 2
    elif soil_type in {"Silt", "Peaty"}:
        score += 1

    if irrigation:
        score += 1

    if fertilizer_used:
        score += 1

    if 85 <= int(days_of_harvest) <= 130:
        score += 1

    if 20 <= float(temperature) <= 30:
        score += 1

    if 40 <= float(rainfall) <= 120:
        score += 1

    if score >= 6:
        return "High"
    if score >= 3:
        return "Medium"
    return "Low"


def predict_yield_level(soil_type, irrigation, fertilizer_used, days_of_harvest, temperature, rainfall):
    """Predict yield class using trained model.pkl when available."""
    model, encoders, feature_columns = _load_model_bundle()
    if model is None:
        return _fallback_rule_based(
            soil_type,
            irrigation,
            fertilizer_used,
            days_of_harvest,
            temperature,
            rainfall,
        )

    try:
        row = _row_for_model(
            soil_type,
            irrigation,
            fertilizer_used,
            days_of_harvest,
            temperature,
            rainfall,
            encoders,
            feature_columns,
            model,
        )
        predicted = model.predict(row)[0]
        return str(predicted)
    except Exception:
        # Keep API resilient if artifact schema and runtime input drift.
        return _fallback_rule_based(
            soil_type,
            irrigation,
            fertilizer_used,
            days_of_harvest,
            temperature,
            rainfall,
        )
