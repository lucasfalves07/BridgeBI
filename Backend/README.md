# BridgeBI — Backend

## Pré-requisitos
- Python 3.10+
- Conta gratuita no Groq: https://console.groq.com

## Instalação

```bash
# 1. Acesse a pasta do backend
cd bridgebi/backend

# 2. Crie o ambiente virtual
python -m venv venv

# 3. Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Instale as dependências
pip install -r requirements.txt

# 5. Configure sua chave do Groq
# Abra o arquivo .env e substitua:
# GROQ_API_KEY=sua_chave_aqui
# pela sua chave real do Groq

# 6. Execute o servidor
python main.py
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Status da API |
| POST | `/api/generate` | Gera script SQL a partir de pergunta |
| GET | `/api/history` | Lista histórico de consultas |
| GET | `/api/tables` | Lista tabelas SAP disponíveis |

## Exemplo de uso

```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"question": "Quero ver todas as entradas de material do mês passado"}'
```

## Onde pegar a chave do Groq
1. Acesse https://console.groq.com
2. Crie uma conta gratuita
3. Vá em "API Keys" → "Create API Key"
4. Cole a chave no arquivo .env
