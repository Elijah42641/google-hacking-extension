import joblib
from urllib.parse import urlparse, parse_qs
import requests

def extract_features(url):
    parsed = urlparse(url)
    params = parse_qs(parsed.query)

    feature_dict = {
        "num_params": len(params),
        "has_id": int("id" in params),
        "has_user": int("user" in params),
        "has_redirect": int("redirect" in params),
        "has_next": int("next" in params),
        "has_token": int("token" in params),
        "has_url_param": 0,
        "has_file_param": int(any(k in params for k in ["file", "filepath", "filename"])),
        "has_cmd_param": int(any(k in params for k in ["cmd", "exec", "shell", "command"])),
        "has_sql_keywords": 0,
        "has_suspicious_chars": 0,
        "has_auth_param": int(any(k in params for k in ["auth", "access_token", "api_key", "apikey", "password", "pass", "passwd"])),
        "has_path_traversal": 0,
    }

    def looks_like_url(val):
        return val.startswith("http://") or val.startswith("https://")

    def contains_sql_keywords(val):
        sql_keywords = ["select", "insert", "update", "delete", "union", "drop", "--", "' or '1'='1"]
        val_lower = val.lower()
        return any(keyword in val_lower for keyword in sql_keywords)

    def contains_suspicious_chars(val):
        suspicious_chars = ["'", "\"", ";", "--", "#", "%"]
        return any(c in val for c in suspicious_chars)

    def contains_path_traversal(val):
        return ".." in val or "%2e%2e" in val.lower()

    for vals in params.values():
        if vals:
            v = vals[0]
            if looks_like_url(v):
                feature_dict["has_url_param"] = 1
            if contains_sql_keywords(v):
                feature_dict["has_sql_keywords"] = 1
            if contains_suspicious_chars(v):
                feature_dict["has_suspicious_chars"] = 1
            if contains_path_traversal(v):
                feature_dict["has_path_traversal"] = 1

    return feature_dict

# Load your trained model
model = joblib.load("url_param_vuln_classifier.joblib")

def evaluateUrl(rawUrl):
    extractedUrl = extract_features(rawUrl)
    return model.predict([extractedUrl])

def evaluate():
    sendToJavascript = requests.post("http://localhost:6969/evaluate-url")
