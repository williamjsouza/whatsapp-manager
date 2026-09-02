# WhatsApp Manager Platform

Uma plataforma multi-tenant (SaaS-ready) para gerenciamento de atendimento e envio de campanhas através do WhatsApp, integrada diretamente à **Evolution API**.

Este projeto foi construído para ser modular, altamente escalável e focado em controle absoluto de instâncias, contatos e campanhas de mensagens, suportando dezenas de sessões do WhatsApp em uma única instalação.

## 🚀 Tecnologias e Stack
*   **Backend:** Node.js, Express, Socket.IO
*   **Banco de Dados:** SQLite, gerenciado via Prisma ORM (v7+)
*   **Autenticação:** JWT (JSON Web Tokens), bcrypt (Segurança de senhas)
*   **Interface:** HTML/CSS/JS puros com WebSockets nativos
*   **Integração:** Evolution API (Para mensageria WhatsApp)
*   **Job Scheduler:** node-cron (Para automação de campanhas e backups diários)
*   **Deploy:** Docker, Docker Compose

## 📋 Funcionalidades
1.  **Múltiplas Instâncias:** Conecte vários números de WhatsApp simultaneamente através de QR Code.
2.  **Gerenciamento de Contatos e Conversas:** Acompanhe chats abertos com marcação de leitura.
3.  **Chat em Tempo Real:** Interface web inspirada no WhatsApp Web sincronizada em tempo real (via WebSockets).
4.  **Templates de Mensagens:** Suporte a variáveis estáticas (ex: `{{nome}}`, `{{telefone}}`).
5.  **Campanhas e Agendamentos:** Envio de mensagens em massa com *delays* parametrizáveis para proteger o número contra bloqueios.
6.  **Backups e Logs:** Job diário que realiza backup da estrutura local (SQLite e Configurações) além de gerar logs gerais de sistema e erros.

---

## 🛠️ Configuração Inicial e Execução

### Pré-requisitos
*   Node.js (v20 ou superior recomendado)
*   NPM ou Yarn
*   Docker e Docker Compose (Opcional, para Deploy em Produção)
*   **Evolution API** rodando externamente ou na mesma rede.

### 1. Preparando o Ambiente Local
```bash
# Clone ou entre no repositório
cd /var/www/html/whatsapp

# Instale todas as dependências
npm install
```

### 2. Configuração de Variáveis (.env)
Copie o arquivo de exemplo e edite as informações de comunicação com a Evolution API.
```bash
cp .env.example .env
```
Variáveis importantes no `.env`:
*   `PORT=3001` (A aplicação rodará na porta 3001)
*   `EVOLUTION_API_URL=http://localhost:8080`
*   `EVOLUTION_API_KEY=sua_chave_global_da_evolution`
*   `WEBHOOK_URL=http://localhost:3001/api/webhooks/evolution` (Seu endereço público caso a Evolution esteja externa)
*   `MESSAGE_DELAY_MIN` / `MESSAGE_DELAY_MAX` (Delays para controle de envio da fila de campanhas)

### 3. Banco de Dados (Prisma)
Para preparar o banco de dados e aplicar o esquema inicial:
```bash
# Sincroniza o SQLite e roda as migrations iniciais
npx prisma migrate dev --name init

# Popula o banco com os dados iniciais (Usuário Administrador)
node prisma/seed.js
```

### 4. Rodando o Projeto (Modo Desenvolvimento)
```bash
npm run dev
```

Acesse no navegador: **http://localhost:3001**
**Credenciais de Acesso Padrão:**
- E-mail: `admin@admin.com`
- Senha: `admin`

---

## 🐳 Executando com Docker (Produção)

A plataforma conta com seu próprio `Dockerfile` e `docker-compose.yml`, já configurados com persistência de volumes.

```bash
# Sobe todo o ambiente do WhatsApp Manager em background
docker-compose up -d --build
```
Os seguintes volumes são persistidos nativamente:
*   `/app/backend/database` (Banco de dados)
*   `/app/.env` (Credenciais)
*   `/app/logs` (Logs do sistema e erros)
*   `/app/backups` (Backups automáticos executados às 03:00 AM)

---

## 🧪 Testes

A suíte de testes (utilizando **Jest** e **Supertest**) foi configurada para validar as rotas essenciais (Health Check):
```bash
npm test
```

## 🔒 Considerações Finais
As rotas da API em `/api/*` estão protegidas pelo *JWT Auth Middleware*, impedindo interações externas não autorizadas. Recomenda-se trocar a credencial padrão (`admin`) imediatamente após o primeiro login e preencher as variáveis reais da Evolution API.
