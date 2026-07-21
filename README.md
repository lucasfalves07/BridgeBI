# BridgeBI
> Ferramenta de IA que transforma perguntas em linguagem natural em scripts SQL para extração de dados SAP, integráveis ao Power BI.

🌐 **Demo:** [bridge-bi.vercel.app](https://bridge-bi.vercel.app)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

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
| Exportação | Power BI (.m) e Excel (.xlsx) |
| Deploy Frontend | Vercel |
| Deploy Backend | Render |

---

## Funcionalidades

- Autenticação de usuários com dois perfis: **Admin** e **Funcionário**
- Interpretação de perguntas em linguagem natural
- Dicionário de dados SAP com 10 tabelas (MSEG, EKPO, EKKO, MARA, VBAP, VBAK, AFKO, AFPO, VBRK, VBRP)
- Geração automática de scripts SQL compatíveis com SAP HANA
- Histórico de consultas por usuário
- Exportação para Power BI (.m) e Excel (.xlsx)
- Painel administrativo com gerenciamento de usuários (criar, editar, remover)
- Tema claro e escuro
- Interface responsiva para mobile

---

## Credenciais de Demonstração

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@bridgebi.com | admin123 |
| Funcionário | funcionario@bridgebi.com | func123 |

---

## Como Rodar Localmente

### Backend
```bash
cd Backend
pip install -r requirements.txt
# Crie o arquivo .env com sua chave do Groq:
# GROQ_API_KEY=gsk_...
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Acesse: **http://localhost:5173**

> ⚠️ Se estiver na rede da faculdade, use hotspot — a rede pode bloquear a API do Groq.

---

## Estrutura do Projeto

```
BridgeBI/
├── Backend/
│   ├── main.py              # Endpoints FastAPI
│   ├── groq_service.py      # Integração com Groq/Llama 3
│   ├── database.py          # Funções SQLite
│   ├── sap_dictionary.py    # Dicionário das 10 tabelas SAP
│   ├── csv_service.py       # Exportação Excel (.xlsx)
│   ├── powerbi_service.py   # Exportação Power BI (.m)
│   ├── seed_database.py     # Popular banco com dados simulados
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/           # Login, Dashboard, Editor, History, AdminPanel
        ├── components/      # Navbar, NetworkBackground
        └── hooks/           # useTheme
```

---

## Equipe

Desenvolvido por alunos do curso de Sistemas de Informação do Instituto Mauá de Tecnologia — 2026:

- **Lucas Alves**
- **Vitor Molina**
- **Victor Naoki Sato**

---

## Alinhamento ODS

Este projeto está alinhado ao **ODS 8 — Trabalho Decente e Crescimento Econômico**, promovendo ganhos de produtividade por meio da automação e modernização de processos analíticos.
