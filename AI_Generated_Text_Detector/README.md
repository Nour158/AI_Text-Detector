# AI Generated Text Detector

Complete project for the Kaggle dataset **shanegerami/ai-vs-human-text**.

## Architecture
Text → TF-IDF → SGDClassifier (logistic loss) → saved sklearn Pipeline → FastAPI → HTML/CSS/JavaScript UI.

## Labels
- `0` = Human-written
- `1` = AI-generated

## Train on Kaggle
1. Create a Kaggle notebook.
2. Add input dataset: `shanegerami/ai-vs-human-text`.
3. Upload/open `AI_Generated_Text_Detector_Training.ipynb`.
4. Run all cells.
5. Download `models/ai_text_detector.joblib` from Kaggle output.
6. Put that file into this project's local `models/` folder.

The notebook defaults to a stratified sample of up to 200,000 rows for a faster run. Change `MAX_ROWS = None` to train on the complete cleaned dataset.

## Run locally
```bash
python -m venv .venv
```

Windows:
```bash
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

macOS/Linux:
```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open `http://127.0.0.1:8000`

FastAPI docs: `http://127.0.0.1:8000/docs`

## What the notebook includes
- Dataset exploration
- Label distribution
- Missing value and duplicate removal
- Stratified train/test split
- TF-IDF feature extraction
- Scalable probabilistic text classifier
- Accuracy, precision, recall, F1, ROC-AUC
- Classification report
- Confusion matrix
- Example predictions
- Complete pipeline saved with Joblib

## Short defense answers
**Dataset?** Kaggle AI vs Human Text by Shane Gerami.

**Columns?** `text` and `generated`.

**Labels?** `0` human, `1` AI.

**Features?** Word TF-IDF with unigrams and bigrams.

**Model?** SGDClassifier with logistic loss.

**Why?** It is efficient for hundreds of thousands of sparse, high-dimensional text samples and can output probabilities.

**API?** FastAPI with a POST `/predict` endpoint.

**Frontend?** HTML, CSS, JavaScript calling the FastAPI endpoint.

**Confidence?** The highest predicted class probability.

## Screenshot note
The included images are UI previews so you have the required layout ready. After training the real Kaggle model, run the local app and take the final two screenshots again so the confidence values are produced by your trained model.

## Important limitation
AI-text detection is probabilistic. A prediction is not definitive proof of authorship.
