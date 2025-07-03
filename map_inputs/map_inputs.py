from joblib import load
from bs4 import BeautifulSoup

# Load the trained model
findInputTags = load("input_detector_model.joblib")

def extract_tags(html):
    """Safely extract all HTML tags as strings using BeautifulSoup."""
    # Ensure html is a string
    if isinstance(html, (bytes, bytearray)):
        html_str = html.decode("utf-8", errors="ignore")
    else:
        html_str = str(html)

    try:
        soup = BeautifulSoup(html_str, "html.parser")
    except Exception as e:
        print(f"[ERROR] Failed to parse HTML: {e}")
        return []

    return [str(tag) for tag in soup.find_all()]

def findInputs(html):
    tags = extract_tags(html)
    if not tags:
        return ["no tags detected"]

    inputTags = findInputTags.predict(tags)
    detected_inputs = [tag for tag, prediction in zip(tags, inputTags) if prediction == 1]

    return detected_inputs or ["no inputs found"]
