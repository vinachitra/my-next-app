def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 180):
    text = " ".join(text.split())
    if not text:
        return []
    if overlap >= chunk_size:
        raise ValueError("overlap harus lebih kecil daripada chunk_size")
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        if end == len(text):
            break
        start = end - overlap
    return chunks