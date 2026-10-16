import chromadb
from .config import CHROMA_PATH, COLLECTION_NAME
from .embedding import embed_texts

def get_collection():
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    return client.get_or_create_collection(name=COLLECTION_NAME)

def index_chunks(chunks):
    if not chunks:
        return 0
    collection = get_collection()
    vectors = embed_texts([item["text"] for item in chunks])
    ids = [f'{item["source"]}-{i}' for i, item in enumerate(chunks)]
    collection.upsert(
        ids=ids,
        documents=[item["text"] for item in chunks],
        metadatas=[{"source": item["source"]} for item in chunks],
        embeddings=vectors,
    )
    return len(chunks)