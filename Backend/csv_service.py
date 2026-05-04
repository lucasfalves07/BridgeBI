import random
import csv
import io
from datetime import datetime, timedelta

def random_date(days_back=90):
    d = datetime.now() - timedelta(days=random.randint(0, days_back))
    return d.strftime('%Y-%m-%d')

def random_material():
    materials = [
        ('MAT-001', 'Papel Kraft 80g'),
        ('MAT-002', 'Celulose Branqueada'),
        ('MAT-003', 'Papelão Ondulado'),
        ('MAT-004', 'Embalagem Caixas'),
        ('MAT-005', 'Resina PET'),
        ('MAT-006', 'Cola Industrial'),
        ('MAT-007', 'Tinta Flexográfica'),
        ('MAT-008', 'Papel Tissue'),
    ]
    return random.choice(materials)

def random_customer():
    customers = ['C-1001','C-1002','C-1003','C-1004','C-1005','C-1006']
    return random.choice(customers)

def random_vendor():
    vendors = ['V-2001','V-2002','V-2003','V-2004','V-2005']
    return random.choice(vendors)

def random_plant():
    return random.choice(['1000','1100','1200','2000'])

def generate_csv(sql: str, tables: list[str]) -> str:
    output = io.StringIO()
    output.write('\ufeff')  # BOM para Excel reconhecer UTF-8

    sql_upper = sql.upper()

    if 'VBRK' in tables or 'VBAP' in tables or 'VENDAS' in sql_upper or 'FATURA' in sql_upper:
        return _generate_vendas_csv(output)
    elif 'EKPO' in tables or 'EKKO' in tables or 'COMPRAS' in sql_upper or 'PEDIDO' in sql_upper:
        return _generate_compras_csv(output)
    elif 'AFKO' in tables or 'AFPO' in tables or 'PRODU' in sql_upper:
        return _generate_producao_csv(output)
    else:
        return _generate_movimentacao_csv(output)


def _generate_vendas_csv(output):
    writer = csv.writer(output, delimiter=";")
    writer.writerow(['documento_venda', 'cliente', 'material_codigo', 'material_descricao', 'quantidade', 'unidade', 'valor_liquido', 'data_faturamento', 'centro'])
    for i in range(30):
        mat_cod, mat_desc = random_material()
        writer.writerow([
            f'90{random.randint(10000,99999)}',
            random_customer(),
            mat_cod,
            mat_desc,
            round(random.uniform(100, 5000), 2),
            'KG',
            round(random.uniform(1000, 50000), 2),
            random_date(),
            random_plant(),
        ])
    return output.getvalue()


def _generate_compras_csv(output):
    writer = csv.writer(output, delimiter=";")
    writer.writerow(['pedido_compra', 'item', 'fornecedor', 'material_codigo', 'material_descricao', 'quantidade', 'unidade', 'preco_liquido', 'data_entrega', 'centro'])
    for i in range(30):
        mat_cod, mat_desc = random_material()
        writer.writerow([
            f'45{random.randint(10000,99999)}',
            random.randint(10, 90),
            random_vendor(),
            mat_cod,
            mat_desc,
            round(random.uniform(50, 2000), 2),
            'KG',
            round(random.uniform(500, 30000), 2),
            random_date(),
            random_plant(),
        ])
    return output.getvalue()


def _generate_producao_csv(output):
    writer = csv.writer(output, delimiter=";")
    writer.writerow(['ordem_producao', 'material_codigo', 'material_descricao', 'quantidade_planejada', 'quantidade_produzida', 'unidade', 'data_inicio', 'data_fim', 'centro', 'status'])
    statuses = ['Aberta', 'Em Andamento', 'Encerrada', 'Parcialmente Entregue']
    for i in range(30):
        mat_cod, mat_desc = random_material()
        qtd_plan = round(random.uniform(500, 10000), 2)
        writer.writerow([
            f'10{random.randint(10000,99999)}',
            mat_cod,
            mat_desc,
            qtd_plan,
            round(qtd_plan * random.uniform(0.5, 1.0), 2),
            'KG',
            random_date(180),
            random_date(30),
            random_plant(),
            random.choice(statuses),
        ])
    return output.getvalue()


def _generate_movimentacao_csv(output):
    writer = csv.writer(output, delimiter=";")
    writer.writerow(['documento_material', 'tipo_movimento', 'material_codigo', 'material_descricao', 'quantidade', 'unidade', 'valor_total', 'data_lancamento', 'centro', 'deposito'])
    tipos = [('101','Entrada de Mercadoria'), ('201','Saída para Consumo'), ('261','Saída para Ordem')]
    for i in range(30):
        mat_cod, mat_desc = random_material()
        tipo_cod, tipo_desc = random.choice(tipos)
        writer.writerow([
            f'50{random.randint(10000,99999)}',
            f'{tipo_cod} - {tipo_desc}',
            mat_cod,
            mat_desc,
            round(random.uniform(100, 5000), 2),
            'KG',
            round(random.uniform(1000, 50000), 2),
            random_date(),
            random_plant(),
            random.choice(['0001','0002','0003']),
        ])
    return output.getvalue()