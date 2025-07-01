import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import time
import joblib

from url_evaluator.evaluator import evaluateUrl

openRedirectAI = joblib.load('open_redirect_model.joblib')

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
        openRedirect = openRedirectAI.predict([url])
        if openRedirect == ([1]):
            openRedirect = "True"
        else: 
            openRedirect="False"    
        print(f"Sensitive keywords found: {found}")
        print(f"open redirect: {openRedirect}")
        if found or openRedirect != "False":
            return jsonify({
                "status": "alert",
                "message": f"Sensitive keywords found:\n{', '.join(found)}\nopen redirect:\n{openRedirect}",
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