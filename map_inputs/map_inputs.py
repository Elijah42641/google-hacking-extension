from bs4 import BeautifulSoup
from joblib import load, dump
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# === Settings ===
MODEL_PATH = "input_detector_model.joblib"

NEGATIVE_HTML = """
<div>Some div content</div>
<section>Another section</section>
<header>Header text</header>
<footer>Footer content</footer>
<nav>Navigation menu</nav>
<main>Main content here</main>
<span>Some span text</span>
<tool-tip aria-hidden="true" class="sr-only" role="tooltip">Tooltip text</tool-tip>
"""

POSITIVE_HTML = """
<input type="text" name="username" />
<input type="password" name="password" />
<textarea placeholder="Your comment"></textarea>
<select name="options"><option>1</option></select>
<button type="submit">Submit</button>
<div>Not an input</div>
"""

SKIP_TAGS = {
    "div", "section", "article", "header", "footer", "nav", "main", "span",
    "aside", "figure", "figcaption", "blockquote", "pre", "code", "em", "strong",
    "b", "i", "u", "small", "sub", "sup", "mark", "del", "ins", "hr", "br",
    "address", "canvas", "details", "dialog", "fieldset", "form", "legend",
    "meter", "output", "progress", "template", "time", "wbr", "ruby", "rt",
    "rp", "data", "datalist", "menu", "menuitem"
}

def extract_features(tag):
    return {
        "tag_name": tag.name,
        "num_attributes": len(tag.attrs),
        "has_name": "name" in tag.attrs,
        "has_id": "id" in tag.attrs,
        "has_class": "class" in tag.attrs,
        "has_placeholder": "placeholder" in tag.attrs,
        "has_type": "type" in tag.attrs,
        "text_length": len(tag.get_text(strip=True)) if tag.name not in SKIP_TAGS else 0,
        "num_children": len(tag.find_all(recursive=False)),
        "is_self_closing": int(tag.is_empty_element),
    }

def parse_and_extract_features(html):
    soup = BeautifulSoup(html, "html.parser")
    candidate_tags = [
        tag for tag in soup.find_all()
        if tag.name not in SKIP_TAGS and "-" not in tag.name
    ]
    features = [extract_features(tag) for tag in candidate_tags]
    return candidate_tags, features

def main():
    print("Loading existing model...")
    old_model = load(MODEL_PATH)

    pos_tags, pos_features = parse_and_extract_features(POSITIVE_HTML)
    # Old model expects DataFrame input
    pos_df = pd.DataFrame(pos_features)
    pos_df = pd.get_dummies(pos_df, columns=["tag_name"])
    pos_preds = old_model.predict(pos_df)

    X_pos = pos_df[pos_preds == 1]
    y_pos = [1] * len(X_pos)

    neg_tags, neg_features = parse_and_extract_features(NEGATIVE_HTML)
    neg_df = pd.DataFrame(neg_features)
    neg_df = pd.get_dummies(neg_df, columns=["tag_name"])

    # Align columns in case pos_df and neg_df differ in dummy columns
    X_neg = neg_df.reindex(columns=X_pos.columns, fill_value=0)
    y_neg = [0] * len(X_neg)

    X = pd.concat([X_pos, X_neg], ignore_index=True)
    y = y_pos + y_neg

    print(f"Training new model on {len(X)} samples ({len(y_pos)} positives, {len(y_neg)} negatives)...")
    new_model = RandomForestClassifier(n_estimators=100, random_state=42)
    new_model.fit(X, y)

    dump(new_model, MODEL_PATH)
    print(f"Model retrained and saved to {MODEL_PATH}")

if __name__ == "__main__":
    main()
