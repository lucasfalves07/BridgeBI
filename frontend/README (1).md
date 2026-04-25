# BridgeBI — Frontend

## Pré-requisitos
- Node.js 18+ instalado (https://nodejs.org)
- Backend rodando em http://localhost:8000

## Instalação e execução

```bash
# 1. Acesse a pasta do frontend
cd bridgebi/frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

## Estrutura de arquivos

```
src/
├── components/
│   ├── Navbar.jsx           # Barra de navegação reutilizável
│   └── NetworkBackground.jsx # Animação de partículas do fundo
├── pages/
│   ├── Login.jsx            # Tela de login
│   ├── Dashboard.jsx        # Tela principal com busca
│   ├── AIThinking.jsx       # Animação de processamento da IA
│   ├── Editor.jsx           # Exibição do script SQL gerado
│   └── History.jsx          # Histórico de consultas
├── services/
│   └── api.js               # Comunicação com o backend
├── App.jsx                  # Roteamento
├── main.jsx                 # Entry point
└── index.css                # Estilos globais e animações
```

## Fluxo da aplicação

Login → Dashboard → AIThinking (chama API) → Editor (exibe script) → Histórico
