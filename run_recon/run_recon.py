import json
from datetime import datetime, timezone
import joblib  # to load the saved model

def parse_datetime(dt_str):
    # Convert ISO 8601 string to aware datetime
    # Handles 'Z' as UTC
    if dt_str.endswith("Z"):
        dt_str = dt_str[:-1] + "+00:00"  # Replace 'Z' with '+00:00'
    try:
        return datetime.fromisoformat(dt_str)
    except ValueError:
        # fallback in case of format issues
        return datetime.strptime(dt_str, "%Y-%m-%dT%H:%M:%S").replace(tzinfo=timezone.utc)

def extract_features_from_recon(recon_data):
    geo = recon_data.get("geo", {})
    whois = recon_data.get("whois", {})
    dns_raw = recon_data.get("dns", "")
    subdomains = recon_data.get("subdomains", [])

    # SPF presence and strictness
    has_spf = 1 if "v=spf1" in dns_raw else 0
    spf_strict = 0
    if has_spf:
        if "-all" in dns_raw:
            spf_strict = 2  # strict
        elif "~all" in dns_raw:
            spf_strict = 1  # softfail

    # Count MX records - simple heuristic counting lines starting with 'MX'
    num_mx = dns_raw.count("MX :")

    # Wildcard subdomains detection
    wildcard_subdomain = int(any("*." in sd for sd in subdomains))

    # Domain age (years)
    domain_age = 0
    events = whois.get("events", [])
    reg_event = next((e for e in events if e.get("eventAction") == "registration"), None)
    if reg_event and reg_event.get("eventDate"):
        reg_date = parse_datetime(reg_event["eventDate"])
        now_utc = datetime.now(timezone.utc)  # offset-aware current time
        domain_age = (now_utc - reg_date).days // 365

    # Registrar flags - any status means protected
    registrar_flags = 1 if whois.get("status") else 0

    # Country US flag
    country_us = 1 if geo.get("country_code") == "US" else 0

    # Number of subdomains
    num_subdomains = len(subdomains)

    features = {
        "has_spf": has_spf,
        "spf_strict": spf_strict,
        "num_mx": num_mx,
        "wildcard_subdomain": wildcard_subdomain,
        "domain_age": domain_age,
        "registrar_flags": registrar_flags,
        "country_us": country_us,
        "num_subdomains": num_subdomains,
    }
    return features

def spot_vulnerabilities(recon_data, model):
    features = extract_features_from_recon(recon_data)

    # Convert features dict to a list matching model input order
    feature_order = [
        "has_spf",
        "spf_strict",
        "num_mx",
        "wildcard_subdomain",
        "domain_age",
        "registrar_flags",
        "country_us",
        "num_subdomains",
    ]
    X = [[features[f] for f in feature_order]]

    prediction = model.predict(X)[0]

    issues = []
    if features["has_spf"] == 0:
        issues.append("Missing SPF record - email spoofing risk.")
    elif features["spf_strict"] < 2:
        issues.append("SPF record is not strict (-all recommended).")

    if features["num_mx"] == 0:
        issues.append("No MX records found - email may not be deliverable.")

    if features["wildcard_subdomain"]:
        issues.append("Wildcard subdomain detected - potential subdomain takeover risk.")

    if features["domain_age"] < 1:
        issues.append("Domain is less than 1 year old - could be suspicious or new.")

    if features["registrar_flags"] == 0:
        issues.append("No registrar protection flags - domain may be vulnerable to unauthorized changes.")

    if features["num_subdomains"] > 20:
        issues.append("Large number of subdomains - review for unused or vulnerable entries.")

    # Final verdict from model + heuristic messages
    result = {
        "features": features,
        "prediction": "Vulnerable" if prediction == 1 else "Clean",
        "issues": issues,
        "message": "\n".join(issues) if issues else "No significant vulnerabilities detected.",
    }
    return result

if __name__ == "__main__":
    model = joblib.load("recon_misconfig_model.joblib")

    # Load example recon JSON data from file or string
    with open("example_recon.json") as f:
        recon_data = json.load(f)

    result = spot_vulnerabilities(recon_data, model)
    print("Domain features:", result["features"])
    print("Prediction:", result["prediction"])
    print(result["message"])
