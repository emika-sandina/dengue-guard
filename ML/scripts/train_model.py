# Dengue Case Prediction — XGBoost Model Training


import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import joblib
import xgboost as xgb

from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


#  LOAD DATA

train_df = pd.read_csv("data/train.csv")
val_df   = pd.read_csv("data/val.csv")
test_df  = pd.read_csv("data/test.csv")


#  DEFINE FEATURES AND TARGETS

FEATURES = [
    # Area identifier
    "area_encoded",

    # Current week's weather
    "avg_temperature_2m_mean",
    "avg_temperature_2m_max",
    "avg_precipitation_sum",
    "avg_relative_humidity_2m_mean",
    "temp_range",
    "heat_humidity_index",

    # Seasonal position — sin/cos tell the model WHERE in the year we are.
    # week_sin peaks at mid-year, week_cos peaks at start/end of year.
    "week_sin",
    "week_cos",

    # Lag/rolling case features — recent case counts are the strongest signal
    "cases_lag1",
    "cases_lag2",
    "cases_lag3",
    "cases_roll_mean4",
    "cases_trend",

    # Last week's weather (lagged to prevent data leakage).
    # Mosquito breeding reacts to rain/heat with roughly a 1-week delay.
    "temp_lag1",
    "precip_lag1",
    "humidity_lag1",
]

X_train = train_df[FEATURES]
X_val   = val_df[FEATURES]
X_test  = test_df[FEATURES]

# Train on log1p(cases) — compresses large outbreak spikes so the model
# learns the underlying trend rather than chasing extreme outliers.
y_train = train_df["cases_log1p"]
y_val   = val_df["cases_log1p"]

# Keep raw case counts aside for final evaluation — we want error in
# real case numbers, not in log-space.
y_test_raw = test_df["cases"].values


#  HYPERPARAMETER SEARCH (GridSearchCV)

# We test every combination of the values below and pick the best one.
# This is called a "grid search" — it's slow but thorough.

param_grid = {
    "max_depth"        : [4, 6, 8],          # tree depth — higher = more complex
    "learning_rate"    : [0.01, 0.05],        # step size for each boosting round
    "n_estimators"     : [500, 700, 1000],    # number of trees
    "min_child_weight" : [3, 5, 7],           # min samples needed to split a node
    "subsample"        : [0.7, 0.8],          # fraction of rows used per tree
    "colsample_bytree" : [0.8],               # fraction of columns used per tree
}

# Base model — no hyperparameters set yet; GridSearchCV will fill those in
base_model = xgb.XGBRegressor(
    eval_metric  = "rmse",
    random_state = 42,
    n_jobs       = -1,          # use all available CPU cores
)

grid_search = GridSearchCV(
    estimator  = base_model,
    param_grid = param_grid,
    scoring    = "neg_mean_absolute_error",  # maximise negative MAE = minimise MAE
    cv         = 3,                          # 3-fold cross-validation
    verbose    = 1,
    n_jobs     = -1,
)

print("Running GridSearchCV — this may take a few minutes...")
grid_search.fit(X_train.values, y_train.values)

print("\nBest parameters found:")
for param, value in grid_search.best_params_.items():
    print(f"  {param:20s}: {value}")


#  TRAIN FINAL MODEL WITH EARLY STOPPING

# Use the best hyperparameters from the grid search, but add early stopping:
# the model stops adding trees once the validation score stops improving for
# 30 rounds — this avoids overfitting.

best_params = grid_search.best_params_

model = xgb.XGBRegressor(
    **best_params,                 # unpack the best settings found above
    early_stopping_rounds = 30,    # stop if val score doesn't improve for 30 rounds
    eval_metric           = "rmse",
    random_state          = 42,
    n_jobs                = -1,
)

model.fit(
    X_train.values, y_train.values,
    eval_set = [(X_val.values, y_val.values)],
    verbose  = 100     # print progress every 100 trees
)

print(f"\nEarly stopping triggered at tree #{model.best_iteration}")


#  EVALUATE ON TEST SET

# Convert log predictions back to real case counts using expm1
# (the inverse of log1p), then clip to 0 so we never predict negative cases.

y_pred = np.expm1(model.predict(X_test.values)).clip(0)

mae  = mean_absolute_error(y_test_raw, y_pred)
rmse = np.sqrt(mean_squared_error(y_test_raw, y_pred))
r2   = r2_score(y_test_raw, y_pred)

print(f"\nMAE  : {mae:.4f} cases   (on average, prediction is off by this many cases)")
print(f"RMSE : {rmse:.4f} cases   (penalises big misses more than MAE)")
print(f"R2   : {r2:.4f}          (1.0 = perfect, 0.0 = no better than guessing the mean)")


#  SAVE MODEL

os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/dengue_model.pkl")

print("\nSaved to models/dengue_model.pkl")
print(f"\nBest params : {best_params}")
print(f"MAE={mae:.4f}  RMSE={rmse:.4f}  R2={r2:.4f}")


#  VISUALISE PREDICTIONS

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# --- Left: Actual vs Predicted scatter plot ---
# Points close to the red dashed line = accurate predictions
axes[0].scatter(y_test_raw, y_pred, alpha=0.25, s=10, color="steelblue")
lim = max(y_test_raw.max(), y_pred.max()) + 1
axes[0].plot([0, lim], [0, lim], "r--", lw=1.5, label="Perfect prediction")
axes[0].set(title="Actual vs Predicted", xlabel="Actual Cases", ylabel="Predicted Cases")
axes[0].legend()

# --- Right: Time series preview (first 200 test rows) ---
n = min(200, len(y_test_raw))
axes[1].plot(y_test_raw[:n], label="Actual",    lw=1.5)
axes[1].plot(y_pred[:n],     label="Predicted", lw=1.5, linestyle="--")
axes[1].set(title="Cases Over Time (first 200 test rows)", xlabel="Index", ylabel="Cases")
axes[1].legend()

plt.tight_layout()
plt.show()


#  FEATURE IMPORTANCE

# Shows which input features the model relied on most when making predictions.
# A higher score means the feature contributed more to reducing prediction error.

importance = pd.Series(
    model.feature_importances_,
    index=FEATURES
).sort_values(ascending=True)

plt.figure(figsize=(8, 6))
importance.plot(kind="barh", color="steelblue", edgecolor="white")
plt.title("Feature Importance")
plt.xlabel("Importance Score")
plt.tight_layout()
plt.show()

print("\nTop 5 most important features:")
print(importance.tail(5).to_string())