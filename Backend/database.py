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

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            email      TEXT UNIQUE NOT NULL,
            password   TEXT NOT NULL,
            name       TEXT,
            role       TEXT DEFAULT 'funcionario',
            created_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS query_history (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT,
            question   TEXT NOT NULL,
            sql        TEXT NOT NULL,
            tables     TEXT,
            status     TEXT DEFAULT 'gerado',
            favorite   INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        INSERT OR IGNORE INTO users (email, password, name, role, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, ("admin@bridgebi.com", "admin123", "Administrador", "admin", datetime.now().isoformat()))

    cursor.execute("""
        INSERT OR IGNORE INTO users (email, password, name, role, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, ("funcionario@bridgebi.com", "func123", "Funcionário Padrão", "funcionario", datetime.now().isoformat()))

    conn.commit()
    conn.close()
    print("✅ Banco de dados inicializado")


def login_user(email: str, password: str):
    conn = get_conn()
    row = conn.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password)).fetchone()
    conn.close()
    return dict(row) if row else None


def save_query(question: str, sql: str, tables: str, status: str = "gerado", user_email: str = ""):
    conn = get_conn()
    conn.execute("""
        INSERT INTO query_history (user_email, question, sql, tables, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_email, question, sql, tables, status, datetime.now().isoformat()))
    conn.commit()
    conn.close()


def get_history(user_email: str = None, role: str = "funcionario"):
    conn = get_conn()
    if role == "admin":
        rows = conn.execute("SELECT * FROM query_history ORDER BY created_at DESC LIMIT 100").fetchall()
    else:
        rows = conn.execute("SELECT * FROM query_history WHERE user_email = ? ORDER BY created_at DESC LIMIT 50", (user_email,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_history_by_user(user_email: str):
    conn = get_conn()
    rows = conn.execute("SELECT * FROM query_history WHERE user_email = ? ORDER BY created_at DESC", (user_email,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_all_users():
    conn = get_conn()
    rows = conn.execute("SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def create_user(email: str, password: str, name: str, role: str = "funcionario"):
    conn = get_conn()
    try:
        conn.execute("""
            INSERT INTO users (email, password, name, role, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (email, password, name, role, datetime.now().isoformat()))
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        conn.close()
        return False


def delete_user(user_id: int):
    conn = get_conn()
    conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()


def get_tables():
    result = []
    for table_name, info in SAP_DICTIONARY.items():
        result.append({
            "table": table_name,
            "desc": info["desc"],
            "module": info["module"],
            "fields": info["fields"]
        })
    return result