import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import time
import joblib
import base64

from url_evaluator.evaluator import evaluateUrl
from map_inputs.map_inputs import findInputs

print("Script started")

app = Flask(__name__)
CORS(app)
latest_url = {"url": None}

sensitiveKeywords = {
    "// todo", "// fixme", "// hack", "// note",
    "# insecure", "# temporary", "# debug only", "# remove later", "# hardcoded",
    "admin", "is_admin", "role", "access", "superuser", "privilege", "permissions", "can_",
    "file_put_contents", "fopen", "readFile", "writeFile", "unlink", "delete", "path",
    "password", "secret", "token", "username", "pass", "passwd", "auth",
    "api_key", "API_KEY", "api_secret", "API_SECRET", "client_secret", "access_token", 
    "refresh_token", "auth_token", "bearer", "jwt", "private_key", "public_key", "ssh_key",
    "encryption_key", "keyfile", "keystore", "vault", "secretenv"
}

@app.route("/get-window-location-href", methods=["POST"])
def receive():
    data = request.get_json()
    url = data.get("url")
    latest_url["url"] = url
    print(f"Received URL: {url}")

    try:
        response = requests.get(url)
        page_source = response.text.lower()

        found = [k for k in sensitiveKeywords if k.lower() in page_source]
           
        print(f"Sensitive keywords found: {found}")
        if found:
            return jsonify({
                "status": "alert",
                "message": f"Sensitive keywords found:\n{', '.join(found)}",
            })

    except Exception as e:
        print("Error fetching page:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route("/evaluate-url", methods=["POST"])
def recieveAndSendData():
    data = request.get_json()
    url = data.get("url")
    latest_url["url"] = url
    print(f"Received URL: {url}")
    urlEvaluation = evaluateUrl(url)
    return jsonify({
                "status": "alert",
                "message": f"URL evaluation: {urlEvaluation}"
            })
    
@app.route("/make-custom-request", methods=["POST"])
def makeRequest():
    data = request.get_json()
    url = data.get("url")
    latest_url["url"] = url
    print(f"Received URL: {url}")
    requestHeaders = data.get("requestHeaders")
    method = data.get("method")
    requestBody = data.get("requestBody")
    if method in ["POST", "PUT", "PATCH", "DELETE"]:
        # send an empty request body if empty request body is submitted
        if (isinstance(requestBody, str) and len(requestBody.strip()) == 0) or (isinstance(requestBody, dict) and not requestBody):
            customRequest = requests.request(method, url, headers=requestHeaders)
        else:
            # submit request body correctly if user chose to include
            headers_str = str(requestHeaders)
            if '"content-type":"application/json"' in headers_str.lower():
                customRequest = requests.request(method, url, headers=requestHeaders, json=requestBody)
            elif '"content-type":"application/x-www-form-urlencoded"' in headers_str.lower():
                customRequest = requests.request(method, url, headers=requestHeaders, data=requestBody)
            elif '"content-type":"multipart/form-data"' in headers_str.lower():
                customRequest = requests.request(method, url, headers=requestHeaders, files=requestBody)
            else:
                customRequest = requests.request(method, url, headers=requestHeaders, data=requestBody)
    else:
        customRequest = requests.request(method, url, headers=requestHeaders)

    return jsonify({
    "headers": dict(customRequest.headers),
    "text": customRequest.text,
    "url": customRequest.url
})

@app.route("/map-input-elements", methods=["POST"])
def map_all_input_elements():
    data = request.get_json()

    html_encoded = data.get("html", "")
    if not isinstance(html_encoded, str):
        return jsonify({
            "status": "error",
            "message": "Invalid HTML format: expected base64-encoded string."
        }), 400

    try:
        html_bytes = base64.b64decode(html_encoded)
        html = html_bytes.decode("utf-8", errors="ignore")
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to decode HTML: {str(e)}"
        }), 400

    inputElements = findInputs(html)

    return jsonify({
        "status": "alert",
        "message": f"inputs found: {inputElements}",
        "inputs": inputElements
    }), 200

def start_server():
    app.run(port=6969)

def main():
    print("Starting Flask server...")
    threading.Thread(target=start_server, daemon=True).start()

    # Keep the main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Server stopped.")

if __name__ == "__main__":
    main()