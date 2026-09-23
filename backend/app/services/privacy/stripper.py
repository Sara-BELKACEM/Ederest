import re
from typing import Optional

# Email regex pattern
EMAIL_REGEX = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
    re.IGNORECASE
)

# Phone number patterns:
# 1. International with leading + : e.g. +33 6 12 34 56 78, +1 (555) 123-4567, +212 6 00 11 22 33
PHONE_INTL = re.compile(
    r"\+\d{1,3}(?:[-.\s]?\(?\d{1,4}\)?){1,4}(?:[-.\s]?\d{2,4}){1,3}\b"
)

# 2. Standard 10-digit French national numbers: 01-09 followed by 8 digits (spaced, dotted, hyphened, or solid)
PHONE_FR = re.compile(
    r"\b0[1-9](?:[-.\s]?\d{2}){4}\b"
)

# 3. Standard US / international separated numbers: (555) 123-4567 or 555-123-4567 or 123.456.7890
PHONE_SEP = re.compile(
    r"\b(?:\(?\d{3}\)?[-.\s])\d{3}[-.\s]\d{4}\b"
)

def strip_pii(text: Optional[str]) -> Optional[str]:
    """
    Strips Personally Identifiable Information (PII) such as emails and phone numbers
    from free-text comments, replacing them with redaction tokens.
    Guarantees task codes like PO-450001024 or M-01 are preserved.
    """
    if not text:
        return text

    # Strip emails first
    cleaned = EMAIL_REGEX.sub("[email]", text)

    # Strip phones
    cleaned = PHONE_INTL.sub("[phone]", cleaned)
    cleaned = PHONE_FR.sub("[phone]", cleaned)
    cleaned = PHONE_SEP.sub("[phone]", cleaned)

    return cleaned.strip()
