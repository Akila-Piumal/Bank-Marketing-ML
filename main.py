from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
import joblib
import pandas as pd
import os
import json
from mangum import Mangum
from fastapi.staticfiles import StaticFiles

app = FastAPI()

MODEL_PATH = "artifacts/best_production_model.joblib"
FEATURES_PATH = "artifacts/production_features.txt"

# Load model and features
model = joblib.load(MODEL_PATH)
with open(FEATURES_PATH) as f:
    FEATURES = [line.strip() for line in f]

# Load most common values
with open("artifacts/most_common_values.json") as f:
    most_common_values = json.load(f)

# Mount /static for CSS/JS
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def form():
    with open("index.html") as f:
        return HTMLResponse(f.read())
    
NUMERIC_FEATURES = ['age', 'campaign', 'pdays', 'previous', 'emp.var.rate', 'cons.price.idx', 'cons.conf.idx', 'euribor3m', 'nr.employed']

@app.post("/predict")
async def predict(request: Request):
    print("Predicting...............................................")
    form_data = await request.form()

    # Prepare the input data
    data = {}
    for feature in FEATURES:
        # Use the submitted value if available, otherwise get from most_common_values.json
        data[feature] = form_data.get(feature, most_common_values[feature])
    
    print("Input data for prediction:", data)

    for feature in NUMERIC_FEATURES:  # list of numeric features used in training
        if data[feature] is not None:
            data[feature] = float(data[feature])

    # data = {key: form_data[key] for key in form_data}
    print("Input data for prediction222222222222222222:", data)
    df = pd.DataFrame([data], columns=FEATURES)
    prediction = model.predict(df)[0]
    return JSONResponse({"prediction": str(prediction)})

# Add this line for Lambda
handler = Mangum(app)
