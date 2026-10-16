from .indexing import get_collection
from .embedding import embed_query

def retrieve_context(question: str, top_k: int = 4):
    collection = get_collection()
    if collection.count() == 0:
        return []
    result = collection.query(
        query_embeddings=[embed_query(question)],
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )
    docs = result.get("documents", [[]])[0]
    metas = result.get("metadatas", [[]])[0]
    return [
        {"text": text, "source": meta.get("source", "dokumen")}
        for text, meta in zip(docs, metas)
    ]