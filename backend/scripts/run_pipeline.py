import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from rag.config import DOCUMENTS_PATH, CHUNK_SIZE, CHUNK_OVERLAP
from rag.extraction import load_documents
from rag.chunking import chunk_text
from rag.indexing import index_chunks

def main():
    docs = load_documents(DOCUMENTS_PATH)
    if not docs:
        print(f"Tidak ada PDF dengan teks yang bisa dibaca di: {DOCUMENTS_PATH}")
        return
    chunks = []
    for doc in docs:
        for i, chunk in enumerate(chunk_text(doc["text"], CHUNK_SIZE, CHUNK_OVERLAP)):
            chunks.append({"text": chunk, "source": doc["source"]})
    total = index_chunks(chunks)
    print(f"Dokumen: {len(docs)} | Chunk diindeks: {total}")

if __name__ == "__main__":
    main()