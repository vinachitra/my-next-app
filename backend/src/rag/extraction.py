from pathlib import Path
from pypdf import PdfReader

def extract_pdf(path: Path) -> str:
    reader = PdfReader(str(path))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return "\n".join(pages).strip()

def load_documents(directory: str):
    root = Path(directory)
    if not root.exists():
        return []
    documents = []
    for path in root.rglob("*.pdf"):
        text = extract_pdf(path)
        if text:
            documents.append({"text": text, "source": path.name})
    return documents