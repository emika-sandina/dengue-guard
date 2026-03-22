
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

# FETCH ALL AREAS IN PARALLEL 
# ThreadPoolExecutor fetches 10 areas at the same time instead of one by one.
# This reduces wait time from ~30 mins to ~3 mins for 367 areas.

all_areas       = list(MOH_COORDS.keys())
weather_results = []
failed_areas    = []

print(f"\nFetching weather for {len(all_areas)} areas. Please wait...")

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    future_to_area = {
        executor.submit(get_weekly_weather, area): area
        for area in all_areas
    }

    for future in concurrent.futures.as_completed(future_to_area):
        area   = future_to_area[future]
        result = future.result()

        if result is not None:
            weather_results.append(result)
        else:
            failed_areas.append(area)

print(f"\nFetched : {len(weather_results)} areas")
print(f"Failed  : {len(failed_areas)} areas")
if failed_areas:
    print(f"Failed areas: {failed_areas}")


# SCALE TO MATCH TRAINING DATA 
# The model was trained on z-scored weather (mean=0, std=1).
# Raw API values like temp=29°C would be out of range and break predictions.
# We apply the exact same scaling that was used during training.

weather_df = pd.DataFrame(weather_results)

WEATHER_COLS = [
    "avg_temperature_2m_mean",
    "avg_temperature_2m_max",
    "avg_precipitation_sum",
    "avg_relative_humidity_2m_mean",
    "temp_range",
    "heat_humidity_index",
]

for col in WEATHER_COLS:
    mean = WEATHER_STATS[col]["mean"]
    std  = WEATHER_STATS[col]["std"]
    weather_df[col] = (weather_df[col] - mean) / std

print("\nSample of scaled weather (should look like values between -3 and 3):")
print(weather_df[WEATHER_COLS].head(3).round(3).to_string())


# SAVE 

os.makedirs("data", exist_ok=True)
weather_df.to_csv("data/current_weather.csv", index=False)

print("\nSaved to data/current_weather.csv")    