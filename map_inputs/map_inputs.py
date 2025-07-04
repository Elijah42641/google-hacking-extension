from bs4 import BeautifulSoup
from joblib import load, dump
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report



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

INPUT_LIKE_TAGS = {"input", "textarea", "select", "button"}
SELF_CLOSING_TAGS = {"input", "br", "img", "hr", "meta", "link"}


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
        "is_self_closing": int(tag.name in SELF_CLOSING_TAGS),
        "is_input_like": int(tag.name in INPUT_LIKE_TAGS),
        "has_input_attrs": int(any(k in tag.attrs for k in ("name", "type", "placeholder", "value")))
    }


def findInputs(html):
    soup = BeautifulSoup(html, "html.parser")
    features = []
    for tag in soup.find_all():
        if tag.name not in SKIP_TAGS and "-" not in tag.name:
            features.append(extract_features(tag))
        else:
            print(f"Skipping tag: <{tag.name}>")
    return features


