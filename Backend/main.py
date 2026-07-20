from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
from groq_service import generate_sql
from database import (init_db, save_query, get_history, get_history_by_user,
                      get_all_users, create_user, delete_user, login_user)
from csv_service import generate_csv
from powerbi_service import generate_powerbi_file
import uvicorn

app = FastAPI(title="BridgeBI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://bridge-bi.vercel.app", "https://*.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


class QueryRequest(BaseModel):
    question: str
    user_email: Optional[str] = ""

class ExportRequest(BaseModel):
    sql: str
    tables: list[str]

class LoginRequest(BaseModel):
    email: str
    password: str

class CreateUserRequest(BaseModel):
    email: str
    password: str
    name: str
    role: str = "funcionario"


@app.get("/")
def root():
    return {"status": "BridgeBI API online"}


@app.post("/api/login")
def login(req: LoginRequest):
    user = login_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    return user


@app.post("/api/generate")
async def generate(req: QueryRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Pergunta não pode ser vazia")
    result = await generate_sql(req.question)
    save_query(
        question=req.question,
        sql=result["sql"],
        tables=", ".join(result["tables"]),
        status="gerado",
        user_email=req.user_email,
    )
    return result


@app.get("/api/history")
def history(user_email: str = "", role: str = "funcionario"):
    return get_history(user_email=user_email, role=role)


@app.get("/api/history/{user_email}")
def history_by_user(user_email: str):
    return get_history_by_user(user_email)


@app.get("/api/users")
def list_users():
    return get_all_users()


@app.post("/api/users")
def add_user(req: CreateUserRequest):
    ok = create_user(req.email, req.password, req.name, req.role)
    if not ok:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    return {"message": "Usuário criado com sucesso"}


@app.delete("/api/users/{user_id}")
def remove_user(user_id: int):
    delete_user(user_id)
    return {"message": "Usuário removido"}


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


@app.get("/api/tables")
def tables():
    from database import get_tables
    return get_tables()


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)