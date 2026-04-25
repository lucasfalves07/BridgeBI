"""
Dicionário de dados SAP — simula as principais tabelas usadas na Klabin.
Serve como base de conhecimento (RAG) para o agente de IA.
"""

SAP_DICTIONARY = {
    "MSEG": {
        "desc": "Documento de material - movimentações de estoque",
        "module": "MM",
        "fields": [
            {"name": "MBLNR", "desc": "Número do documento de material"},
            {"name": "MJAHR", "desc": "Ano do documento"},
            {"name": "ZEILE", "desc": "Posição do documento"},
            {"name": "BWART", "desc": "Tipo de movimento (101=entrada, 201=saída)"},
            {"name": "MATNR", "desc": "Número do material"},
            {"name": "WERKS", "desc": "Centro/planta"},
            {"name": "LGORT", "desc": "Depósito de armazenamento"},
            {"name": "MENGE", "desc": "Quantidade"},
            {"name": "MEINS", "desc": "Unidade de medida base"},
            {"name": "DMBTR", "desc": "Valor em moeda local"},
            {"name": "EBELN", "desc": "Número do pedido de compras"},
            {"name": "EBELP", "desc": "Item do pedido de compras"},
            {"name": "BUDAT", "desc": "Data de lançamento"},
        ]
    },
    "EKPO": {
        "desc": "Item do pedido de compras",
        "module": "MM",
        "fields": [
            {"name": "EBELN", "desc": "Número do pedido de compras"},
            {"name": "EBELP", "desc": "Item do pedido"},
            {"name": "MATNR", "desc": "Número do material"},
            {"name": "TXZ01", "desc": "Descrição curta do material"},
            {"name": "MENGE", "desc": "Quantidade do pedido"},
            {"name": "MEINS", "desc": "Unidade de medida"},
            {"name": "NETPR", "desc": "Preço líquido"},
            {"name": "PEINH", "desc": "Unidade de preço"},
            {"name": "WERKS", "desc": "Centro/planta"},
            {"name": "EINDT", "desc": "Data de entrega"},
            {"name": "LIFNR", "desc": "Fornecedor"},
        ]
    },
    "EKKO": {
        "desc": "Cabeçalho do pedido de compras",
        "module": "MM",
        "fields": [
            {"name": "EBELN", "desc": "Número do pedido de compras"},
            {"name": "BUKRS", "desc": "Empresa"},
            {"name": "LIFNR", "desc": "Número do fornecedor"},
            {"name": "BEDAT", "desc": "Data do pedido"},
            {"name": "WAERS", "desc": "Moeda do documento"},
            {"name": "BSART", "desc": "Tipo de documento de compras"},
        ]
    },
    "MARA": {
        "desc": "Dados gerais do material",
        "module": "MM",
        "fields": [
            {"name": "MATNR", "desc": "Número do material"},
            {"name": "MAKTX", "desc": "Descrição do material"},
            {"name": "MATKL", "desc": "Grupo de mercadorias"},
            {"name": "MEINS", "desc": "Unidade de medida base"},
            {"name": "MTART", "desc": "Tipo de material"},
            {"name": "ERSDA", "desc": "Data de criação"},
        ]
    },
    "VBAP": {
        "desc": "Item da ordem de venda",
        "module": "SD",
        "fields": [
            {"name": "VBELN", "desc": "Documento de vendas"},
            {"name": "POSNR", "desc": "Item do documento de vendas"},
            {"name": "MATNR", "desc": "Número do material"},
            {"name": "ARKTX", "desc": "Descrição do item"},
            {"name": "KWMENG", "desc": "Quantidade acumulada em UM de venda"},
            {"name": "VRKME", "desc": "Unidade de venda"},
            {"name": "NETPR", "desc": "Preço líquido"},
            {"name": "WERKS", "desc": "Centro"},
            {"name": "KUNAG", "desc": "Cliente"},
        ]
    },
    "VBAK": {
        "desc": "Cabeçalho da ordem de venda",
        "module": "SD",
        "fields": [
            {"name": "VBELN", "desc": "Documento de vendas"},
            {"name": "ERDAT", "desc": "Data de criação"},
            {"name": "AUART", "desc": "Tipo de ordem de venda"},
            {"name": "KUNNR", "desc": "Número do cliente"},
            {"name": "WAERK", "desc": "Moeda do documento SD"},
            {"name": "BUKRS_VF", "desc": "Empresa"},
        ]
    },
    "AFKO": {
        "desc": "Cabeçalho da ordem de produção",
        "module": "PP",
        "fields": [
            {"name": "AUFNR", "desc": "Número da ordem de produção"},
            {"name": "MATNR", "desc": "Material a produzir"},
            {"name": "WERKS", "desc": "Centro de produção"},
            {"name": "GAMNG", "desc": "Quantidade total da ordem"},
            {"name": "GMEIN", "desc": "Unidade de medida"},
            {"name": "GSTRS", "desc": "Data de início planejada"},
            {"name": "GLTRP", "desc": "Data de fim planejada"},
            {"name": "FTRMS", "desc": "Data de liberação"},
        ]
    },
    "AFPO": {
        "desc": "Item da ordem de produção",
        "module": "PP",
        "fields": [
            {"name": "AUFNR", "desc": "Número da ordem de produção"},
            {"name": "POSNR", "desc": "Item da ordem"},
            {"name": "MATNR", "desc": "Material"},
            {"name": "DWERK", "desc": "Centro de entrega"},
            {"name": "WEMNG", "desc": "Quantidade total entregue"},
            {"name": "WESBS", "desc": "Quantidade total de entrada de mercadorias"},
        ]
    },
    "VBRK": {
        "desc": "Cabeçalho da fatura (billing)",
        "module": "SD",
        "fields": [
            {"name": "VBELN", "desc": "Documento de faturamento"},
            {"name": "FKDAT", "desc": "Data de faturamento"},
            {"name": "KUNRG", "desc": "Pagador"},
            {"name": "WAERK", "desc": "Moeda do documento"},
            {"name": "NETWR", "desc": "Valor líquido da fatura"},
            {"name": "BUKRS", "desc": "Empresa"},
        ]
    },
    "VBRP": {
        "desc": "Item da fatura",
        "module": "SD",
        "fields": [
            {"name": "VBELN", "desc": "Documento de faturamento"},
            {"name": "POSNR", "desc": "Item"},
            {"name": "MATNR", "desc": "Material"},
            {"name": "FKIMG", "desc": "Quantidade faturada"},
            {"name": "VRKME", "desc": "Unidade de vendas"},
            {"name": "NETWR", "desc": "Valor líquido do item"},
        ]
    },
}
