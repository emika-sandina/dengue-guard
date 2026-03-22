
# Dengue Case Prediction 



import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Set to True if   run weather_fetch.py first.
# False = use historical weather from test.csv 
# True  = use live weather from data/current_weather.csv
USE_LIVE_WEATHER = True

#  LOAD SAVED MODEL AND ENCODER

# The model was trained and saved by train_model.py.
# The encoder maps MOH area names → integers, so we need it to stay consistent.

model   = joblib.load("models/dengue_model.pkl")
encoder = joblib.load("models/encoder.pkl")



#  DEFINE FEATURE SET

# Must match exactly the features used during training.

FEATURES = [
    # Area identifier (label-encoded)
    "area_encoded",

    # Current week's weather
    "avg_temperature_2m_mean",
    "avg_temperature_2m_max",
    "avg_precipitation_sum",
    "avg_relative_humidity_2m_mean",
    "temp_range",
    "heat_humidity_index",

    # Seasonal cycle (sin/cos encoding of week number)
    "week_sin",
    "week_cos",

    # Historical case lag features
    "cases_lag1",
    "cases_lag2",
    "cases_lag3",
    "cases_roll_mean4",
    "cases_trend",

    # Last week's weather (lagged to prevent data leakage)
    "temp_lag1",
    "precip_lag1",
    "humidity_lag1",
]



#  LOAD TEST DATA AND GRAB THE MOST RECENT WEEK PER AREA

# We predict from the final known week for each MOH area.
# Sorting by week first ensures `.tail(1)` always gives the latest row.

test_df = pd.read_csv("data/test.csv")

# Grab the very last week for each area — that's our prediction input
last_week_df = test_df.sort_values("week").groupby("moh_area").tail(1)

last_week_df = last_week_df.copy()

# update week_sin / week_cos for the NEXT week we are predicting
next_week = int(test_df["week"].max()) + 1
last_week_df["week_sin"] = np.sin(2 * np.pi * next_week / 52)
last_week_df["week_cos"] = np.cos(2 * np.pi * next_week / 52)

# re-encode area names in case the column is missing
last_week_df["area_encoded"] = encoder.transform(last_week_df["moh_area"])

if USE_LIVE_WEATHER:
    # swap the 6 weather columns for fresh API values from weather_fetch.py
    # lag features (cases_lag1 etc.) still come from test.csv — no live case API exists
    WEATHER_COLS = [
        "avg_temperature_2m_mean", "avg_temperature_2m_max",
        "avg_precipitation_sum", "avg_relative_humidity_2m_mean",
        "temp_range", "heat_humidity_index",
    ]
    live_df = pd.read_csv("data/current_weather.csv")
    last_week_df = last_week_df.drop(columns=WEATHER_COLS)
    last_week_df = last_week_df.merge(live_df, on="moh_area", how="left")
    print(f"Using LIVE weather   — predicting week #{next_week}")
else:
    print(f"Using HISTORICAL weather — predicting week #{next_week}")

X = last_week_df[FEATURES]

#  GENERATE PREDICTIONS

# The model was trained on log1p(cases), so we reverse that with expm1.
# clip(0) ensures we never output a negative case count.
# round() → int gives whole-number case counts.

preds = np.expm1(model.predict(X.values)).clip(0)
preds = np.round(preds).astype(int)

# Build a clean results DataFrame sorted highest → lowest
results_df = pd.DataFrame({
    "moh_area"       : last_week_df["moh_area"].values,
    "predicted_cases": preds
}).sort_values("predicted_cases", ascending=False).reset_index(drop=True)



#  PRINT SUMMARY


print("Top 10 highest predicted areas:")
print(results_df.head(10).to_string(index=False))

print(f"\nAverage : {results_df['predicted_cases'].mean():.1f}")
print(f"Max     : {results_df['predicted_cases'].max()}")



#  VISUALISE — TOP 20 AREAS BAR CHART


top20 = results_df.head(20)

# plt.figure(figsize=(12, 6))
# plt.barh(
#     top20["moh_area"][::-1],        # reverse so highest is at the top
#     top20["predicted_cases"][::-1],
#     color="steelblue", edgecolor="white"
# )
# plt.xlabel("Predicted Cases")
# plt.title("Top 20 MOH Areas — Predicted Dengue Cases")
# plt.tight_layout()
# plt.show()



#  SAVE PREDICTIONS TO DISK

# Saves two formats:
#   predictions.csv  — spreadsheet-friendly table
#   predictions.json — easy to load in another application or API

os.makedirs("outputs", exist_ok=True)

results_df.to_csv("outputs/predictions.csv", index=False)

with open("outputs/predictions.json", "w") as f:
    json.dump(
        results_df.set_index("moh_area")["predicted_cases"].to_dict(),
        f,
        indent=4
    )

print("\nSaved outputs/predictions.csv")
print("Saved outputs/predictions.json")