import os
import json
from groq import AsyncGroq
from dotenv import load_dotenv
from sap_dictionary import SAP_DICTIONARY  # noqa

load_dotenv()

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

# Monta o contexto do dicionário SAP para o prompt
def build_sap_context() -> str:
    lines = []
    for table, info in SAP_DICTIONARY.items():
        fields = ", ".join([f"{f['name']} ({f['desc']})" for f in info["fields"]])
        lines.append(f"- {table}: {info['desc']} | Campos: {fields}")
    return "\n".join(lines)


SYSTEM_PROMPT = f"""Você é um especialista em SAP e SQL que gera scripts de extração de dados para Power BI.

Você tem acesso ao seguinte dicionário de dados SAP:
{build_sap_context()}

Quando receber uma pergunta de negócio em português, você deve:
1. Identificar quais tabelas SAP são necessárias
2. Gerar um script SQL compatível com SAP HANA
3. Usar JOINs corretos entre as tabelas
4. Adicionar filtros e ordenação adequados
5. Incluir comentários explicativos no SQL

Responda APENAS com um JSON válido no seguinte formato (sem markdown, sem explicações fora do JSON):
{{
  "sql": "-- script SQL aqui",
  "tables": ["TABELA1", "TABELA2"],
  "explanation": "Explicação breve do que o script faz",
  "steps": [
    "Passo 1 realizado",
    "Passo 2 realizado"
  ]
}}"""


async def generate_sql(question: str) -> dict:
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Pergunta de negócio: {question}"}
            ],
            temperature=0.1,
            max_tokens=2000,
        )

        content = response.choices[0].message.content.strip()

        # Remove possíveis blocos de markdown
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]

        result = json.loads(content)
        return result

    except json.JSONDecodeError:
        # Fallback: retorna o conteúdo bruto como SQL
        return {
            "sql": content,
            "tables": [],
            "explanation": "Script gerado pelo modelo",
            "steps": ["Script gerado com sucesso"]
        }
    except Exception as e:
        raise Exception(f"Erro ao chamar Groq API: {str(e)}")
