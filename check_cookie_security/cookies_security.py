import joblib
import numpy as np

# Load the trained model (do this once globally)
model = joblib.load("cookie_sensitivity_model.joblib")

def check_cookies_security(cookies):
    """
    Predict if cookies are sensitive/vulnerable.

    Args:
      cookies (list of dict): Each dict should have keys:
        - name (str)
        - value (str)
        - secure (bool)
        - httpOnly (bool)

    Returns:
      list of tuples: (cookie_dict, prediction)
      where prediction is 1 (sensitive) or 0 (not)
    """
    names = [c["name"] for c in cookies]
    values = [c["value"] for c in cookies]
    secure_flags = [int(c.get("secure", False)) for c in cookies]
    httponly_flags = [int(c.get("httpOnly", False)) for c in cookies]

    # Prepare input as expected by the model
    X = (names, values, np.array([secure_flags, httponly_flags]).T)

    predictions = model.predict(X)

    return list(zip(cookies, predictions))