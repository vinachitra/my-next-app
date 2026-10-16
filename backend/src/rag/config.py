import os
from pathlib import Path
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
)
CHROMA_PATH = str(
    (BACKEND_DIR / os.getenv("CHROMA_PATH", "data/chroma")).resolve()
)
DOCUMENTS_PATH = str(
    (BACKEND_DIR / os.getenv("DOCUMENTS_PATH", "documents/incoming")).resolve()
)
COLLECTION_NAME = "virtual_safe_space_docs"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 180