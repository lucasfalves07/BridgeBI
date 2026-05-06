import re
from datetime import datetime

def sql_to_m(sql: str, query_name: str = "BridgeBI_Query") -> str:
    """
    Converte um script SQL em M Language (Power Query) para Power BI.
    """
    now = datetime.now().strftime('%d/%m/%Y %H:%M')
    
    # Escapa aspas duplas no SQL para M Language
    sql_escaped = sql.replace('"', '""')

    m_script = f'''let
    // =============================================
    // BridgeBI — Query gerada automaticamente
    // Data: {now}
    // =============================================

    // Configurações de conexão SAP HANA
    // Substitua os parâmetros abaixo com os dados do seu ambiente
    Servidor = "seu-servidor-hana.empresa.com.br",
    Porta = "30015",
    Schema = "SAPABAP1",

    // Conexão com SAP HANA
    Fonte = Odbc.Query(
        "DSN=SAPHANA;ServerNode=" & Servidor & ":" & Porta,
        "{sql_escaped}"
    ),

    // Tipagem das colunas
    TipagemAutomatica = Table.TransformColumnTypes(
        Fonte,
        List.Transform(
            Table.ColumnNames(Fonte),
            each {{_, type text}}
        )
    )

in
    TipagemAutomatica'''

    return m_script


def generate_powerbi_file(sql: str, tables: list[str]) -> bytes:
    """
    Gera um arquivo .m com a query convertida para Power Query (M Language).
    """
    query_name = "BridgeBI_" + "_".join(tables[:2]) if tables else "BridgeBI_Query"
    m_content = sql_to_m(sql, query_name)
    return m_content.encode('utf-8-sig')  # UTF-8 com BOM para compatibilidade Windows
