# BridgeBI

> Ferramenta de IA que transforma perguntas em linguagem natural em scripts SQL para extração de dados SAP, integráveis ao Power BI.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)

---

## Sobre o Projeto

O BridgeBI é uma solução desenvolvida como Projeto Integrador com o objetivo de democratizar o acesso à análise de dados em ambientes SAP. Por meio de inteligência artificial, a ferramenta interpreta perguntas de negócio em linguagem natural e gera automaticamente scripts SQL prontos para uso no Power BI, reduzindo a dependência de conhecimento técnico especializado.

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + Vite |
| Backend | Python + FastAPI |
| Inteligência Artificial | Llama 3 via Groq API |
| Banco de Dados | SQLite |
| Validação | Power BI |

---

## Funcionalidades

- 🔐 Autenticação de usuários
- 💬 Interpretação de perguntas em linguagem natural
- 🗂️ Dicionário de dados SAP com 10 tabelas (MSEG, EKPO, EKKO, MARA, VBAP, VBAK, AFKO, AFPO, VBRK, VBRP)
- ⚙️ Geração automática de scripts SQL compatíveis com SAP HANA
- 📋 Histórico de consultas
- 📤 Exportação para Power BI

---

## Como Rodar

### Pré-requisitos
- Python 3.11
- Node.js 18+
- Conta gratuita no [Groq](https://console.groq.com)

### Backend

```bash
cd Backend
py -3.11 -m pip install "fastapi==0.115.0" "uvicorn==0.30.1" "groq==0.9.0" "python-dotenv==1.0.1" "pydantic==2.10.0" "httpx==0.27.0"
uvicorn main:app --reload
```

Crie um arquivo `.env` na pasta `Backend`:

```
GROQ_API_KEY=sua_chave_aqui
```

```bash
py -3.11 main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

---

## Estrutura do Projeto

```
BridgeBI/
├── Backend/
│   ├── main.py            # API FastAPI
│   ├── groq_service.py    # Integração com IA
│   ├── sap_dictionary.py  # Dicionário de dados SAP
│   ├── database.py        # SQLite
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/         # Login, Dashboard, AIThinking, Editor, Histórico
        ├── components/    # Navbar, NetworkBackground
        └── services/      # API client
```

---

## Equipe

Desenvolvido por alunos do curso de Sistemas de Informação do Instituto Mauá de Tecnologia — 2026:

Lucas Alves

Vitor Molina

Victor Naoki Sato

---

## Alinhamento ODS

Este projeto está alinhado ao **ODS 8 — Trabalho Decente e Crescimento Econômico**, promovendo ganhos de produtividade por meio da automação e modernização de processos analíticos.
