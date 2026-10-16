from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag.retrieval import retrieve_context
from rag.generation import generate_answer

app = FastAPI(title="Virtual Safe Space RAG API")

# Jika hanya dipanggil melalui Next.js proxy, CORS browser langsung tidak wajib.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(payload: ChatRequest):
    question = payload.message.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Pertanyaan tidak boleh kosong")
    try:
        contexts = retrieve_context(question)
        answer = generate_answer(question, contexts)
        return {
            "answer": answer,
            "sources": sorted({item["source"] for item in contexts}),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))