
import os
import json
import time
import requests
import numpy as np
import pandas as pd
import concurrent.futures


# LOAD COORDINATES

with open("data/valid_moh_coords.json", "r") as f:
    MOH_COORDS = json.load(f)

print(f"Loaded coordinates for {len(MOH_COORDS)} MOH areas")


# LOAD WEATHER SCALING STATS 
# These were saved by preprocessn.py — they contain the mean and std
# of each weather column from the training data.
# We use them to z-score the live API values so they match the scale
# the model was trained on.

with open("models/weather_stats.json", "r") as f:
    WEATHER_STATS = json.load(f)

print("Loaded weather scaling stats from models/weather_stats.json")


# FETCH WEATHER FOR ONE AREA 

def get_weekly_weather(area_name, max_retries=3):
    """
    Fetches 7-day weather forecast for one MOH area from Open-Meteo.
    Returns a dict of raw (unscaled) weekly weather values.
    Returns None if the request fails after all retries.
    """
    if area_name not in MOH_COORDS:
        return None

    lat, lon = MOH_COORDS[area_name]

    url = (
        "https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}"
        "&daily=temperature_2m_max,temperature_2m_min,"
        "precipitation_sum,relative_humidity_2m_mean"
        "&forecast_days=7"
        "&timezone=auto"
    )

    for attempt in range(max_retries):
        try:
            r = requests.get(url, timeout=15)
            r.raise_for_status()
            daily = r.json()["daily"]

            tmax     = pd.Series(daily["temperature_2m_max"]).dropna()
            tmin     = pd.Series(daily["temperature_2m_min"]).dropna()
            rain     = pd.Series(daily["precipitation_sum"]).dropna()
            humidity = pd.Series(daily["relative_humidity_2m_mean"]).dropna()

            temp_mean  = (tmax.mean() + tmin.mean()) / 2
            temp_range = tmax.mean() - tmin.mean()          # daily swing
            hhi        = temp_mean * humidity.mean() / 100  # heat-humidity index

            time.sleep(0.3)  # stay polite to the API

            return {
                "moh_area"                     : area_name,
                "avg_temperature_2m_mean"      : round(temp_mean,       4),
                "avg_temperature_2m_max"       : round(tmax.mean(),     4),
                "avg_precipitation_sum"        : round(rain.sum(),      4),
                "avg_relative_humidity_2m_mean": round(humidity.mean(), 4),
                "temp_range"                   : round(temp_range,      4),
                "heat_humidity_index"           : round(hhi,             4),
            }

        except requests.exceptions.Timeout:
            print(f"Timeout for {area_name}. Retry {attempt + 1}/{max_retries}...")
            time.sleep(1)

        except requests.exceptions.RequestException as e:
            print(f"Network error for {area_name}: {e}")
            break

    print(f"Failed to fetch weather for {area_name} after {max_retries} attempts.")
    return None