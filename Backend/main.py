from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq_service import generate_sql
from database import init_db, save_query, get_history
from csv_service import generate_csv
import uvicorn
import io

app = FastAPI(title="BridgeBI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


class QueryRequest(BaseModel):
    question: str


class CSVRequest(BaseModel):
    sql: str
    tables: list[str]


@app.get("/")
def root():
    return {"status": "BridgeBI API online"}


@app.post("/api/generate")
async def generate(req: QueryRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Pergunta não pode ser vazia")

    result = await generate_sql(req.question)

    save_query(
        question=req.question,
        sql=result["sql"],
        tables=", ".join(result["tables"]),
        status="gerado"
    )

    return result


@app.post("/api/generate-csv")
async def generate_csv_endpoint(req: CSVRequest):
    csv_content = generate_csv(req.sql, req.tables)
    return StreamingResponse(
        io.StringIO(csv_content),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=bridgebi_data.csv"}
    )


@app.get("/api/history")
def history():
    return get_history()


@app.get("/api/tables")
def tables():
    from database import get_tables
    return get_tables()


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)