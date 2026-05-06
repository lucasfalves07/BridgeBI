from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from groq_service import generate_sql
from database import init_db, save_query, get_history
from csv_service import generate_csv
from powerbi_service import generate_powerbi_file
import uvicorn

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


class ExportRequest(BaseModel):
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
async def generate_csv_endpoint(req: ExportRequest):
    xlsx_bytes = generate_csv(req.sql, req.tables)
    return Response(
        content=xlsx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=bridgebi_data.xlsx"}
    )


@app.post("/api/generate-powerbi")
async def generate_powerbi_endpoint(req: ExportRequest):
    m_bytes = generate_powerbi_file(req.sql, req.tables)
    return Response(
        content=m_bytes,
        media_type="application/octet-stream",
        headers={"Content-Disposition": "attachment; filename=bridgebi_query.m"}
    )


@app.get("/api/history")
def history():
    return get_history()


@app.get("/api/tables")
def tables():
    from database import get_tables
    return get_tables()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)