def predict_yield_level(soil_type, irrigation, fertilizer_used, temperature, rainfall):
    """Placeholder prediction logic.

    # TODO: Load trained model here and replace placeholder logic
    Replace this function body with something like:
        model = joblib.load("path/to/model.joblib")
        features = [[...]]
        return model.predict(features)[0]
    """

    score = 0

    if soil_type == "Loamy":
        score += 2
    elif soil_type in {"Silt", "Peaty"}:
        score += 1

    if irrigation:
        score += 1

    if fertilizer_used:
        score += 1

    if 20 <= float(temperature) <= 30:
        score += 1

    if 40 <= float(rainfall) <= 120:
        score += 1

    if score >= 5:
        return "High"
    if score >= 3:
        return "Medium"
    return "Low"
