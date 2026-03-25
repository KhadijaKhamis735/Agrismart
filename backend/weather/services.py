import os

import requests


class WeatherServiceError(Exception):
    pass


def fetch_weather(location=None, lat=None, lon=None):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise WeatherServiceError("OpenWeatherMap API key is not configured.")

    base_url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"appid": api_key, "units": "metric"}

    if location:
        params["q"] = location
    elif lat is not None and lon is not None:
        params["lat"] = lat
        params["lon"] = lon
    else:
        raise WeatherServiceError("Provide either location or coordinates.")

    response = requests.get(base_url, params=params, timeout=10)
    if response.status_code != 200:
        raise WeatherServiceError("Unable to fetch weather for the provided location.")

    payload = response.json()
    temp = payload.get("main", {}).get("temp")
    rain_1h = payload.get("rain", {}).get("1h", 0)

    if temp is None:
        raise WeatherServiceError("Temperature data unavailable from weather provider.")

    return {
        "location": payload.get("name", location),
        "temperature": temp,
        "rainfall": rain_1h,
    }
