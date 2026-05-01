import re

import fitz  # PyMuPDF


def extract_text_from_pdf(file_content: bytes) -> str:
    doc = fitz.open(stream=file_content, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()

    # Clean text: remove extra whitespace and newlines
    text = re.sub(r"\s+", " ", text).strip()
    return text
