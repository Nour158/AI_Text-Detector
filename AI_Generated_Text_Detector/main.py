from pathlib import Path
from typing import Literal

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "ai_text_detector.joblib"

app = FastAPI(
    title="AI Generated Text Detector API",
    version="1.0.0",
    description="Predict whether English text is human-written or AI-generated.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
model_load_error = None
try:
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)
    else:
        model_load_error = f"Model file not found at {MODEL_PATH}. Run the training notebook first."
except Exception as exc:
    model_load_error = f"Could not load model: {exc}"


class TextRequest(BaseModel):
    text: str = Field(..., min_length=20, description="Text to classify")


class PredictionResponse(BaseModel):
    label: Literal["Human-written", "AI-generated"]
    prediction: int
    confidence: float
    human_probability: float
    ai_probability: float


@app.get("/health")
def health():
    return {
        "status": "ok" if model is not None else "model_missing",
        "model_loaded": model is not None,
        "detail": model_load_error,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: TextRequest):
    if model is None:
        raise HTTPException(status_code=503, detail=model_load_error or "Model is not loaded.")

    text = payload.text.strip()
    if len(text) < 20:
        raise HTTPException(status_code=422, detail="Please enter at least 20 characters.")

    pred = int(model.predict([text])[0])
    probs = model.predict_proba([text])[0]
    classes = list(model.classes_)
    human_p = float(probs[classes.index(0)])
    ai_p = float(probs[classes.index(1)])
    confidence = max(human_p, ai_p)

    return PredictionResponse(
        label="AI-generated" if pred == 1 else "Human-written",
        prediction=pred,
        confidence=round(confidence, 4),
        human_probability=round(human_p, 4),
        ai_probability=round(ai_p, 4),
    )


@app.get("/", include_in_schema=False)
def home():
    return FileResponse(BASE_DIR / "index.html")


@app.get("/static/style.css", include_in_schema=False)
def style():
    return FileResponse(BASE_DIR / "style.css", media_type="text/css")


@app.get("/static/app.js", include_in_schema=False)
def script():
    return FileResponse(BASE_DIR / "app.js", media_type="application/javascript")
