import sqlite3
from datetime import datetime
from sap_dictionary import SAP_DICTIONARY

DB_PATH = "bridgebi.db"


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    cursor = conn.cursor()

    # Tabela de histórico de consultas
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS query_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            sql TEXT NOT NULL,
            tables TEXT,
            status TEXT DEFAULT 'gerado',
            favorite INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )
    """)

    # Tabela de usuários (simples, sem auth real)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            role TEXT DEFAULT 'analyst',
            created_at TEXT NOT NULL
        )
    """)

    # Insere usuário padrão para demo
    cursor.execute("""
        INSERT OR IGNORE INTO users (email, name, role, created_at)
        VALUES (?, ?, ?, ?)
    """, ("admin@klabin.com.br", "Admin BridgeBI", "admin", datetime.now().isoformat()))

    conn.commit()
    conn.close()
    print("✅ Banco de dados inicializado")


def save_query(question: str, sql: str, tables: str, status: str = "gerado"):
    conn = get_conn()
    conn.execute("""
        INSERT INTO query_history (question, sql, tables, status, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (question, sql, tables, status, datetime.now().isoformat()))
    conn.commit()
    conn.close()


def get_history(limit: int = 20):
    conn = get_conn()
    rows = conn.execute("""
        SELECT * FROM query_history
        ORDER BY created_at DESC
        LIMIT ?
    """, (limit,)).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_tables():
    """Retorna o dicionário SAP formatado para a API"""
    result = []
    for table_name, info in SAP_DICTIONARY.items():
        result.append({
            "table": table_name,
            "desc": info["desc"],
            "module": info["module"],
            "fields": info["fields"]
        })
    return result
