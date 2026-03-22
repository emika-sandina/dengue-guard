# Dengue Dataset — Feature Engineering & Train/Val/Test Split 
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder
import joblib


#  LOAD DATA

def load_data(path):
    """
    Load the cleaned CSV and sort rows by area + week.
    Sorting is critical — lag features must be computed in chronological
    order per MOH area, otherwise values from the wrong week leak in.
    """
    df = pd.read_csv(path)

    # Sort so each area's records go week 1 → week N in order
    df = df.sort_values(["moh_area", "week"])

    print(f"Shape      : {df.shape}")
    print(f"MOH areas  : {df['moh_area'].nunique()}")
    return df



df = load_data(r".\data\Cleaned_Dengue_Data.csv")

print("\nFirst 5 rows:")
print(df.head())


#  FEATURE ENGINEERING

def engineer_features(df):
    """
    Add time-series and domain-specific features to each row.

    Why each feature exists:
      - area_encoded      : Converts the string area name to a number so
                            tree-based models can use it directly.
      - cases_lag1/2/3    : Cases from 1, 2, and 3 weeks ago. Dengue has an
                            incubation period, so past case counts are strong
                            predictors of future counts.
      - cases_roll_mean4  : Rolling 4-week average of past cases. Raw weekly
                            counts are noisy (e.g. admin delays), so smoothing
                            gives the model a more stable baseline signal.
      - cases_trend       : Difference between lag1 and lag2 — tells the model
                            whether cases are rising or falling right now.
      - temp_lag1 / precip_lag1 / humidity_lag1
                          : Last week's weather. Used instead of this week's
                            weather to avoid data leakage (we wouldn't know
                            the current week's weather at prediction time).
      - cases_log1p       : log(1 + cases). Dengue counts are right-skewed
                            (mostly small, occasionally huge spikes). The log
                            transform compresses those spikes so the model
                            learns the underlying trend, not just the outliers.
    """

    # Encode MOH area names as integers (required by tree-based models)
    encoder = LabelEncoder()
    df["area_encoded"] = encoder.fit_transform(df["moh_area"])

    # --- Lag features (shift cases within each area group) ---
    df["cases_lag1"] = df.groupby("moh_area")["cases"].shift(1)   # 1 week ago
    df["cases_lag2"] = df.groupby("moh_area")["cases"].shift(2)   # 2 weeks ago
    df["cases_lag3"] = df.groupby("moh_area")["cases"].shift(3)   # 3 weeks ago

    # --- Rolling 4-week average of past cases ---
    # shift(1) ensures we only look at *past* weeks, not the current week
    df["cases_roll_mean4"] = (
        df.groupby("moh_area")["cases"]
        .shift(1)
        .transform(lambda x: x.rolling(4, min_periods=1).mean())
    )

    # --- Trend: is dengue going up or down compared to last week? ---
    df["cases_trend"] = df["cases_lag1"] - df["cases_lag2"]

    # --- Lagged weather features (previous week's conditions) ---
    df["temp_lag1"]     = df.groupby("moh_area")["avg_temperature_2m_mean"].shift(1)
    df["precip_lag1"]   = df.groupby("moh_area")["avg_precipitation_sum"].shift(1)
    df["humidity_lag1"] = df.groupby("moh_area")["avg_relative_humidity_2m_mean"].shift(1)

    # --- Log-transform the target to reduce skewness ---
    # log1p(x) = log(1 + x), which safely handles x = 0
    df["cases_log1p"] = np.log1p(df["cases"])

    # Drop rows that have NaN in any lag column (the first few rows per area
    # won't have a full history yet), then reset the index cleanly
    df = df.dropna().reset_index(drop=True)

    print(f"Shape after feature engineering: {df.shape}")
    return df, encoder


df, encoder = engineer_features(df)

print("\nFirst 5 rows after feature engineering:")
print(df.head())


#  VISUALISE TARGET DISTRIBUTION 

# This plot shows why we log-transform cases:
#   - Left  : raw counts are heavily right-skewed (a few huge values)
#   - Right : log1p values follow a much more symmetric distribution,
#             which is easier for most ML models to learn from

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].hist(df["cases"], bins=40, color="steelblue", edgecolor="white")
axes[0].set(title="Raw Cases (skewed)", xlabel="Cases", ylabel="Frequency")

axes[1].hist(df["cases_log1p"], bins=40, color="darkorange", edgecolor="white")
axes[1].set(title="log1p(Cases) — less skewed", xlabel="log1p(Cases)", ylabel="Frequency")

plt.tight_layout()
plt.show()


#  DEFINE FEATURE SET AND TARGETS

FEATURES = [
    # Area identifier (encoded as integer)
    "area_encoded",

    # Current week's weather conditions
    "avg_temperature_2m_mean",
    "avg_temperature_2m_max",
    "avg_precipitation_sum",
    "avg_relative_humidity_2m_mean",
    "temp_range",
    "heat_humidity_index",

    # Temporal features (week number + cyclical encoding)
    "week",
    "week_sin",
    "week_cos",

    # Lag and rolling case history
    "cases_lag1",
    "cases_lag2",
    "cases_lag3",
    "cases_roll_mean4",
    "cases_trend",

    # Last week's weather (lagged to prevent leakage)
    "temp_lag1",
    "precip_lag1",
    "humidity_lag1",
]

TARGET_RAW = "cases"         # Raw integer count — used for final evaluation
TARGET_LOG = "cases_log1p"   # Log-transformed count — used during training

print("\nSelected features:")
for f in FEATURES:
    print(f"  {f}")


#  TIME-BASED TRAIN / VALIDATION / TEST SPLIT

# We split by week number instead of randomly, because this is time-series
# data. A random split would let the model "see the future" during training,
# which would give falsely good results.
#
#   Weeks  1 – 80  →  Training set   (learning patterns)
#   Weeks 81 – 93  →  Validation set (tuning hyperparameters)
#   Weeks 94+      →  Test set       (final unbiased evaluation)

TRAIN_END = 80   # Last week included in the training set
VAL_END   = 93   # Last week included in the validation set


def split_data(df):
    """Split the dataset into train, validation, and test sets by week."""
    train_df = df[df["week"] <= TRAIN_END].copy()
    val_df   = df[(df["week"] > TRAIN_END) & (df["week"] <= VAL_END)].copy()
    test_df  = df[df["week"] > VAL_END].copy()

    print(f"Train  {len(train_df):,} rows  (weeks 1–{TRAIN_END})")
    print(f"Val    {len(val_df):,} rows  (weeks {TRAIN_END+1}–{VAL_END})")
    print(f"Test   {len(test_df):,} rows  (weeks {VAL_END+1}+)")

    return train_df, val_df, test_df


results = split_data(df)
train_df = results[0]
val_df   = results[1]
test_df  = results[2]


# ── SAVE WEATHER SCALING STATS ────────────────────────────────────────────────
# The weather columns in the CSV are z-scored (mean=0, std=1).
# When we fetch live weather from the API, values like temp=29°C would be
# completely out of range for the model.
# Solution: save the mean and std from the TRAINING set so weather_fetch.py
# can apply the exact same scaling to new API data before predicting.

WEATHER_COLS = [
    "avg_temperature_2m_mean",
    "avg_temperature_2m_max",
    "avg_precipitation_sum",
    "avg_relative_humidity_2m_mean",
    "temp_range",
    "heat_humidity_index",
]

weather_stats = {
    col: {
        "mean": float(train_df[col].mean()),
        "std" : float(train_df[col].std())
    }
    for col in WEATHER_COLS
}

os.makedirs("models", exist_ok=True)
with open("models/weather_stats.json", "w") as f:
    json.dump(weather_stats, f, indent=2)

print("\nWeather scaling stats saved to models/weather_stats.json")


# ── SAVE SPLITS AND ENCODER ───────────────────────────────────────────────────

os.makedirs("data", exist_ok=True)

train_df.to_csv(os.path.join("data", "train.csv"), index=False)
val_df.to_csv(  os.path.join("data", "val.csv"),   index=False)
test_df.to_csv( os.path.join("data", "test.csv"),  index=False)

joblib.dump(encoder, "models/encoder.pkl")
print("Splits saved  -> data/train.csv, data/val.csv, data/test.csv")
print("Encoder saved -> models/encoder.pkl")
