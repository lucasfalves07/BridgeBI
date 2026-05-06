"""
BridgeBI — Script de população do banco de dados
Simula dados reais do SAP para demonstração do sistema
"""

import sqlite3
import random
from datetime import datetime, timedelta

DB_PATH = "bridgebi.db"

# ── Dados mestres ──────────────────────────────────────────────────────────────

CLIENTES = [
    ("C-1001", "Klabin S.A.",               "São Paulo",      "SP", "Indústria"),
    ("C-1002", "Suzano Papel e Celulose",    "São Paulo",      "SP", "Indústria"),
    ("C-1003", "Embalagens do Brasil Ltda",  "Curitiba",       "PR", "Distribuidor"),
    ("C-1004", "Papelaria Central",          "Rio de Janeiro", "RJ", "Varejo"),
    ("C-1005", "Grupo Pão de Açúcar",        "São Paulo",      "SP", "Varejo"),
    ("C-1006", "Americanas S.A.",            "Rio de Janeiro", "RJ", "Varejo"),
    ("C-1007", "Magazine Luiza",             "Franca",         "SP", "Varejo"),
    ("C-1008", "Indústrias Romi",            "Santa Bárbara",  "SP", "Indústria"),
    ("C-1009", "WestRock do Brasil",         "Curitiba",       "PR", "Indústria"),
    ("C-1010", "Smurfit Kappa Brasil",       "Jacareí",        "SP", "Indústria"),
]

FORNECEDORES = [
    ("V-2001", "Química Brasil Ltda",        "São Paulo",   "SP"),
    ("V-2002", "Insumos Florestais S.A.",    "Curitiba",    "PR"),
    ("V-2003", "Tinta & Cor Industrial",     "Joinville",   "SC"),
    ("V-2004", "Energia Verde S.A.",         "Porto Alegre","RS"),
    ("V-2005", "Logística Sul Ltda",         "Curitiba",    "PR"),
]

MATERIAIS = [
    ("MAT-001", "Papel Kraft 80g",         "Papel",      "KG",  2.50),
    ("MAT-002", "Celulose Branqueada",     "Celulose",   "KG",  3.80),
    ("MAT-003", "Papelão Ondulado",        "Embalagem",  "KG",  1.90),
    ("MAT-004", "Embalagem Caixas",        "Embalagem",  "UN",  0.85),
    ("MAT-005", "Resina PET",              "Plastico",   "KG",  5.20),
    ("MAT-006", "Cola Industrial",         "Quimico",    "KG",  8.40),
    ("MAT-007", "Tinta Flexográfica",      "Quimico",    "LT", 12.00),
    ("MAT-008", "Papel Tissue",            "Papel",      "KG",  3.10),
    ("MAT-009", "Madeira Eucalipto",       "Florestal",  "M3",  180.0),
    ("MAT-010", "Cavacos de Madeira",      "Florestal",  "KG",  0.45),
]

CENTROS = ["1000", "1100", "1200", "2000"]
DEPOSITOS = ["0001", "0002", "0003"]
TIPOS_MOV = [
    ("101", "Entrada por Pedido de Compra"),
    ("201", "Saída para Consumo"),
    ("261", "Saída para Ordem de Produção"),
    ("301", "Transferência entre Centros"),
]
STATUS_PROD = ["Aberta", "Em Andamento", "Encerrada", "Parcialmente Entregue"]

def random_date(days_back=365):
    d = datetime.now() - timedelta(days=random.randint(0, days_back))
    return d.strftime('%Y-%m-%d')

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables(conn):
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS clientes (
            codigo      TEXT PRIMARY KEY,
            nome        TEXT NOT NULL,
            cidade      TEXT,
            estado      TEXT,
            segmento    TEXT,
            criado_em   TEXT
        );

        CREATE TABLE IF NOT EXISTS fornecedores (
            codigo      TEXT PRIMARY KEY,
            nome        TEXT NOT NULL,
            cidade      TEXT,
            estado      TEXT,
            criado_em   TEXT
        );

        CREATE TABLE IF NOT EXISTS materiais (
            codigo      TEXT PRIMARY KEY,
            descricao   TEXT NOT NULL,
            grupo       TEXT,
            unidade     TEXT,
            preco_base  REAL,
            criado_em   TEXT
        );

        CREATE TABLE IF NOT EXISTS vendas (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            documento       TEXT NOT NULL,
            cliente_codigo  TEXT,
            material_codigo TEXT,
            quantidade      REAL,
            unidade         TEXT,
            valor_unitario  REAL,
            valor_total     REAL,
            data_venda      TEXT,
            centro          TEXT,
            FOREIGN KEY (cliente_codigo)  REFERENCES clientes(codigo),
            FOREIGN KEY (material_codigo) REFERENCES materiais(codigo)
        );

        CREATE TABLE IF NOT EXISTS compras (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido           TEXT NOT NULL,
            item             INTEGER,
            fornecedor_codigo TEXT,
            material_codigo  TEXT,
            quantidade       REAL,
            unidade          TEXT,
            preco_liquido    REAL,
            valor_total      REAL,
            data_pedido      TEXT,
            data_entrega     TEXT,
            centro           TEXT,
            FOREIGN KEY (fornecedor_codigo) REFERENCES fornecedores(codigo),
            FOREIGN KEY (material_codigo)   REFERENCES materiais(codigo)
        );

        CREATE TABLE IF NOT EXISTS producao (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            ordem               TEXT NOT NULL,
            material_codigo     TEXT,
            quantidade_planejada REAL,
            quantidade_produzida REAL,
            unidade             TEXT,
            data_inicio         TEXT,
            data_fim            TEXT,
            centro              TEXT,
            status              TEXT,
            FOREIGN KEY (material_codigo) REFERENCES materiais(codigo)
        );

        CREATE TABLE IF NOT EXISTS movimentacao (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            documento       TEXT NOT NULL,
            tipo_mov        TEXT,
            descricao_mov   TEXT,
            material_codigo TEXT,
            quantidade      REAL,
            unidade         TEXT,
            valor_total     REAL,
            data_lancamento TEXT,
            centro          TEXT,
            deposito        TEXT,
            FOREIGN KEY (material_codigo) REFERENCES materiais(codigo)
        );
    """)
    conn.commit()
    print("✅ Tabelas criadas")

def seed_clientes(conn):
    conn.executemany("""
        INSERT OR IGNORE INTO clientes (codigo, nome, cidade, estado, segmento, criado_em)
        VALUES (?, ?, ?, ?, ?, ?)
    """, [(*c, datetime.now().strftime('%Y-%m-%d')) for c in CLIENTES])
    conn.commit()
    print(f"✅ {len(CLIENTES)} clientes inseridos")

def seed_fornecedores(conn):
    conn.executemany("""
        INSERT OR IGNORE INTO fornecedores (codigo, nome, cidade, estado, criado_em)
        VALUES (?, ?, ?, ?, ?)
    """, [(*f, datetime.now().strftime('%Y-%m-%d')) for f in FORNECEDORES])
    conn.commit()
    print(f"✅ {len(FORNECEDORES)} fornecedores inseridos")

def seed_materiais(conn):
    conn.executemany("""
        INSERT OR IGNORE INTO materiais (codigo, descricao, grupo, unidade, preco_base, criado_em)
        VALUES (?, ?, ?, ?, ?, ?)
    """, [(*m, datetime.now().strftime('%Y-%m-%d')) for m in MATERIAIS])
    conn.commit()
    print(f"✅ {len(MATERIAIS)} materiais inseridos")

def seed_vendas(conn, n=200):
    rows = []
    for i in range(n):
        mat = random.choice(MATERIAIS)
        cli = random.choice(CLIENTES)
        qtd = round(random.uniform(100, 5000), 2)
        preco = mat[4] * random.uniform(1.1, 1.5)
        rows.append((
            f"90{random.randint(10000,99999)}",
            cli[0], mat[0], qtd, mat[3],
            round(preco, 2), round(qtd * preco, 2),
            random_date(), random.choice(CENTROS),
        ))
    conn.executemany("""
        INSERT INTO vendas (documento, cliente_codigo, material_codigo, quantidade, unidade,
                           valor_unitario, valor_total, data_venda, centro)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, rows)
    conn.commit()
    print(f"✅ {n} registros de vendas inseridos")

def seed_compras(conn, n=150):
    rows = []
    for i in range(n):
        mat = random.choice(MATERIAIS)
        forn = random.choice(FORNECEDORES)
        qtd = round(random.uniform(50, 2000), 2)
        preco = mat[4] * random.uniform(0.8, 1.1)
        data_ped = random_date()
        data_ent = (datetime.strptime(data_ped, '%Y-%m-%d') + timedelta(days=random.randint(7,30))).strftime('%Y-%m-%d')
        rows.append((
            f"45{random.randint(10000,99999)}",
            random.randint(10, 90),
            forn[0], mat[0], qtd, mat[3],
            round(preco, 2), round(qtd * preco, 2),
            data_ped, data_ent, random.choice(CENTROS),
        ))
    conn.executemany("""
        INSERT INTO compras (pedido, item, fornecedor_codigo, material_codigo, quantidade, unidade,
                            preco_liquido, valor_total, data_pedido, data_entrega, centro)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, rows)
    conn.commit()
    print(f"✅ {n} registros de compras inseridos")

def seed_producao(conn, n=100):
    rows = []
    for i in range(n):
        mat = random.choice(MATERIAIS)
        qtd_plan = round(random.uniform(500, 10000), 2)
        qtd_prod = round(qtd_plan * random.uniform(0.5, 1.0), 2)
        data_ini = random_date(180)
        data_fim = (datetime.strptime(data_ini, '%Y-%m-%d') + timedelta(days=random.randint(1,30))).strftime('%Y-%m-%d')
        rows.append((
            f"10{random.randint(10000,99999)}",
            mat[0], qtd_plan, qtd_prod, mat[3],
            data_ini, data_fim,
            random.choice(CENTROS), random.choice(STATUS_PROD),
        ))
    conn.executemany("""
        INSERT INTO producao (ordem, material_codigo, quantidade_planejada, quantidade_produzida,
                             unidade, data_inicio, data_fim, centro, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, rows)
    conn.commit()
    print(f"✅ {n} registros de produção inseridos")

def seed_movimentacao(conn, n=300):
    rows = []
    for i in range(n):
        mat = random.choice(MATERIAIS)
        tipo = random.choice(TIPOS_MOV)
        qtd = round(random.uniform(100, 5000), 2)
        rows.append((
            f"50{random.randint(10000,99999)}",
            tipo[0], tipo[1],
            mat[0], qtd, mat[3],
            round(qtd * mat[4], 2),
            random_date(), random.choice(CENTROS), random.choice(DEPOSITOS),
        ))
    conn.executemany("""
        INSERT INTO movimentacao (documento, tipo_mov, descricao_mov, material_codigo, quantidade,
                                 unidade, valor_total, data_lancamento, centro, deposito)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, rows)
    conn.commit()
    print(f"✅ {n} registros de movimentação inseridos")

if __name__ == "__main__":
    print("🚀 Iniciando população do banco de dados BridgeBI...")
    conn = get_conn()
    create_tables(conn)
    seed_clientes(conn)
    seed_fornecedores(conn)
    seed_materiais(conn)
    seed_vendas(conn)
    seed_compras(conn)
    seed_producao(conn)
    seed_movimentacao(conn)
    conn.close()
    print("\n🎉 Banco de dados populado com sucesso!")
    print("   - 10 clientes")
    print("   -  5 fornecedores")
    print("   - 10 materiais")
    print("   - 200 vendas")
    print("   - 150 compras")
    print("   - 100 ordens de produção")
    print("   - 300 movimentações")
