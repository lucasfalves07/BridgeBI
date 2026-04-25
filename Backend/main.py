from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq_service import generate_sql
from database import init_db, save_query, get_history
import uvicorn

app = FastAPI(title="BridgeBI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializa o banco ao subir
init_db()


class QueryRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {"status": "BridgeBI API online"}


@app.post("/api/generate")
async def generate(req: QueryRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Pergunta não pode ser vazia")

    result = await generate_sql(req.question)

    # Salva no histórico
    save_query(
        question=req.question,
        sql=result["sql"],
        tables=", ".join(result["tables"]),
        status="gerado"
    )

    return result


@app.get("/api/history")
def history():
    return get_history()


@app.get("/api/tables")
def tables():
    """Retorna as tabelas SAP disponíveis no dicionário"""
    from database import get_tables
    return get_tables()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
