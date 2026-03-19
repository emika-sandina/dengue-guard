# Dengue Dataset Cleaning 


import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
import warnings

warnings.filterwarnings("ignore")


#  LOAD DATA

df = pd.read_csv('MASTER SHEET - transformed_cases_2024.csv')

print("--- Data Preview (first 5 rows) ---")
print(df.head())

print("\n--- Data Types ---")
print(df.dtypes)

print("\n--- Basic Statistics ---")
print(df.describe())


#  CHECK FOR DUPLICATES

duplicate_count = df.duplicated().sum()
print(f"\nDuplicate rows found: {duplicate_count}")
print(f"Dataset shape: {df.shape}")


#  HANDLE MISSING VALUES

# Calculate how many values are missing per column and what % they represent
miss       = df.isnull().sum()
miss_pct   = (miss / len(df) * 100).round(3)
miss_df    = pd.DataFrame({'missing_count': miss, 'missing_%': miss_pct})
miss_df    = miss_df[miss_df['missing_count'] > 0]   # only show columns with missing data

print("\nMissing value summary:")
print(miss_df.to_string())

# Missing data is extremely minimal (max 0.279%), so we simply drop those rows
cols_to_check = [
    'cases',
    'avg_temperature_2m_mean',
    'avg_temperature_2m_max',
    'avg_temperature_2m_min',
    'avg_precipitation_sum',
    'avg_relative_humidity_2m_mean'
]

initial_rows = len(df)
df.dropna(subset=cols_to_check, inplace=True)

print(f"\nCleaned! Removed {initial_rows - len(df)} rows with missing values.")
print(f"Remaining rows: {len(df)}")


#  FIX DATA TYPES

TARGET_COL = "cases"

# Convert cases and week to integers (they should never be decimals)
df[TARGET_COL] = df[TARGET_COL].astype(int)
df['week']     = df['week'].astype(int)

# Strip any accidental leading/trailing whitespace from the area name column
df['moh_area'] = df['moh_area'].str.strip()

print("\nUpdated dtypes:")
print(df.dtypes)


#  LOGICAL / DOMAIN VALIDATION FILTERS

# Fill any remaining NaN cases with 0 (means no reported cases that week)
df["cases"] = df["cases"].fillna(0)

# Drop rows where max temp is less than min temp — physically impossible
df = df[df["avg_temperature_2m_max"] >= df["avg_temperature_2m_min"]]

# Keep only rows within realistic temperature bounds for Sri Lanka
df = df[
    (df["avg_temperature_2m_min"]  > 10) & (df["avg_temperature_2m_min"]  < 40) &
    (df["avg_temperature_2m_mean"] > 10) & (df["avg_temperature_2m_mean"] < 40) &
    (df["avg_temperature_2m_max"]  < 45)
]

print(f"\nAfter validation filters — shape: {df.shape}")


#  OUTLIER CAPPING (IQR METHOD)
# Instead of removing outliers, we clip them to the IQR fence values.
# This keeps all rows while reducing the influence of extreme values.

ALL_NUMERIC = [
    "avg_temperature_2m_mean",
    "avg_temperature_2m_max",
    "avg_temperature_2m_min",
    "avg_precipitation_sum",
    "avg_relative_humidity_2m_mean",
]

for col in ALL_NUMERIC:
    Q1  = df[col].quantile(0.25)
    Q3  = df[col].quantile(0.75)
    IQR = Q3 - Q1

    lower = Q1 - 1.5 * IQR   # anything below this is an outlier
    upper = Q3 + 1.5 * IQR   # anything above this is an outlier

    # clip() replaces values outside [lower, upper] with the fence values
    df[col] = df[col].clip(lower=lower, upper=upper)

print(f"Outlier capping complete. Shape: {df.shape}")


#  FEATURE ENGINEERING

# Create new columns that may help a model learn better patterns.

# Diurnal temperature range — dengue mosquitoes are sensitive to temp swings
df['temp_range'] = df['avg_temperature_2m_max'] - df['avg_temperature_2m_min']

# Heat-Humidity Index — combines temperature and humidity into one signal
df['heat_humidity_index'] = (
    df['avg_temperature_2m_mean'] * df['avg_relative_humidity_2m_mean'] / 100
)

# Cyclical (sine/cosine) encoding of week number — captures yearly seasonality.
# Using sin/cos ensures week 1 and week 52 are numerically close (they are!).
df['week_sin'] = np.sin(2 * np.pi * df['week'] / 52)
df['week_cos'] = np.cos(2 * np.pi * df['week'] / 52)

# Label-encode the MOH area string column so tree-based models can use it
le = LabelEncoder()
df['moh_area_encoded'] = le.fit_transform(df['moh_area'])

# Log1p-transform the target — case counts are right-skewed, log smooths that
df['cases_log1p'] = np.log1p(df[TARGET_COL])

new_cols = ['temp_range', 'heat_humidity_index', 'week_sin', 'week_cos',
            'moh_area_encoded', 'cases_log1p']

print("\nNew features created:")
print(df[new_cols].describe().round(3))


#  DROP REDUNDANT COLUMNS

# avg_temperature_2m_min is highly correlated with avg_temperature_2m_mean,
# keeping both would add redundancy without giving the model new information.
df = df.drop(columns=['avg_temperature_2m_min'])

print(f"\nDropped 'avg_temperature_2m_min'. New shape: {df.shape}")


#  SCALE NUMERIC FEATURES

# StandardScaler transforms each column to have mean=0 and std=1.
# This is important for distance-based and gradient-based models.

scale_features = [
    'avg_temperature_2m_mean',
    'avg_temperature_2m_max',
    'avg_precipitation_sum',
    'avg_relative_humidity_2m_mean',
    'temp_range',
    'heat_humidity_index',
    'week_sin',
    'week_cos'
]

ss = StandardScaler()
df[scale_features] = ss.fit_transform(df[scale_features])

print("\nScaled features preview (first 3 rows):")
print(df[scale_features].head(3).round(3).to_string())


#  SAVE CLEANED DATASET

output_path = "./data/Cleaned_Dengue_Data.csv"
df.to_csv(output_path, index=False)

print(f"\nCleaned dataset saved to: {output_path}")
print(f"Final shape: {df.shape}")