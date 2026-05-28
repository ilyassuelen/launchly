import re
from typing import Any


SENSITIVE_KEYS = {
    "name",
    "full_name",
    "first_name",
    "last_name",
    "email",
    "phone",
    "phone_number",
    "address",
    "street",
    "zip",
    "city",
    "location",
    "linkedin",
    "github",
    "website",
}


EMAIL_RE = re.compile(r"\S+@\S+\.\S+")
PHONE_RE = re.compile(r"(\+?\d[\d\s().-]{7,}\d)")
URL_RE = re.compile(r"https?://\S+|www\.\S+")


def clean_text(text: str) -> str:
    text = EMAIL_RE.sub("[email removed]", text)
    text = PHONE_RE.sub("[phone removed]", text)
    text = URL_RE.sub("[url removed]", text)

    return text


def prepare_data(data: Any) -> Any:
    if isinstance(data, dict):
        clean_data = {}

        for key, value in data.items():
            normalized_key = key.lower().strip()

            if normalized_key in SENSITIVE_KEYS:
                continue

            clean_data[key] = prepare_data(value)

        return clean_data

    if isinstance(data, list):
        return [
            prepare_data(item)
            for item in data
        ]

    if isinstance(data, str):
        return clean_text(data)

    return data
