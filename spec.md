# PROMPT — DESENVOLVIMENTO DE PLATAFORMA DE MENSAGERIA WHATSAPP COM EVOLUTION API

## 1. CONTEXTO DO PROJETO

Desenvolva uma aplicação web completa de mensageria integrada ao WhatsApp utilizando a **Evolution API** como camada de integração.

A aplicação deverá funcionar como um **cliente de WhatsApp próprio**, com interface moderna inspirada na experiência de uso do WhatsApp Web, porém com identidade visual própria.

O sistema deverá permitir:

* Conectar instâncias do WhatsApp através da Evolution API;
* Visualizar conversas;
* Enviar e receber mensagens;
* Gerenciar contatos;
* Criar mensagens predefinidas;
* Agendar mensagens;
* Enviar mensagens automaticamente;
* Receber mensagens em tempo real;
* Responder conversas;
* Pesquisar contatos e conversas;
* Gerenciar múltiplas instâncias do WhatsApp;
* Visualizar status da conexão;
* Registrar histórico das mensagens;
* Controlar mensagens agendadas;
* Criar automações simples baseadas em mensagens predefinidas.

O projeto deve ser desenvolvido com foco em **simplicidade, desempenho, segurança, escalabilidade e facilidade de manutenção**.

---

# 2. STACK OBRIGATÓRIA

Utilize preferencialmente:

### Backend

* JavaScript
* Node.js
* Express.js
* SQLite
* Prisma ORM ou better-sqlite3
* WebSocket / Socket.IO
* Axios ou Fetch API
* JWT para autenticação
* bcrypt para armazenamento seguro de senhas
* node-cron para tarefas agendadas

### Frontend

* JavaScript
* HTML5
* CSS3
* Bootstrap 5 ou Tailwind CSS
* JavaScript Vanilla ou framework leve quando realmente necessário
* Socket.IO Client para atualização em tempo real

### Integração

* Evolution API
* REST API
* Webhooks da Evolution API

### Banco

SQLite.

O banco deverá ser estruturado de maneira que futuramente possa ser migrado para PostgreSQL ou MySQL sem necessidade de reescrever toda a aplicação.

---

# 3. ARQUITETURA

Utilize arquitetura modular:

```text
whatsapp-manager/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── integrations/
│   │   │   └── evolution/
│   │   ├── jobs/
│   │   ├── websocket/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── database/
│   │   └── database.sqlite
│   │
│   └── package.json
│
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── components/
│   ├── pages/
│   └── index.html
│
├── uploads/
│
├── logs/
│
├── .env
├── .env.example
├── package.json
└── README.md
```

Não misture lógica de negócio diretamente nas rotas.

Utilize:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories / Database
```

A integração com Evolution API deverá ficar isolada em um módulo próprio.

---

# 4. CONFIGURAÇÃO DA EVOLUTION API

A aplicação deverá possuir uma tela de configuração da Evolution API.

Campos:

```text
URL da Evolution API
API Key
Nome da instância
Status da conexão
```

Exemplo de configuração:

```env
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=xxxxxxxxxxxxxxxx
```

Nunca colocar API Key diretamente no código.

Utilizar `.env`.

Criar um serviço:

```javascript
EvolutionService
```

Responsável por:

* Criar instância;
* Conectar instância;
* Desconectar instância;
* Excluir instância;
* Consultar status;
* Obter QR Code;
* Enviar mensagem;
* Enviar mídia;
* Buscar contatos;
* Buscar chats;
* Webhooks;
* Consultar mensagens;
* Marcar mensagem como lida.

---

# 5. GERENCIAMENTO DE INSTÂNCIAS

Criar módulo:

## Instâncias WhatsApp

Tela para visualizar todas as instâncias.

Tabela:

```text
Nome
Número
Status
Última conexão
Mensagens
Ações
```

Status possíveis:

```text
CONNECTED
DISCONNECTED
CONNECTING
QR_CODE
ERROR
```

Ações:

```text
Conectar
Desconectar
Reconectar
Excluir
Ver QR Code
Configurar Webhook
```

Ao conectar uma nova instância:

1. Usuário informa nome;
2. Sistema cria instância na Evolution API;
3. Solicita QR Code;
4. Exibe QR Code;
5. Usuário escaneia pelo WhatsApp;
6. Sistema acompanha o status;
7. Ao conectar, atualiza automaticamente a interface.

---

# 6. INTERFACE PRINCIPAL

Criar uma interface semelhante ao WhatsApp Web.

Layout:

```text
┌───────────────────────────────────────────────────────────┐
│ LOGO          Pesquisa              Usuário / Config.     │
├───────────────┬───────────────────────────────────────────┤
│               │                                           │
│ Conversas     │                                           │
│               │                                           │
│ 🔍 Pesquisa   │           ÁREA DA CONVERSA               │
│               │                                           │
│ João          │                                           │
│ Maria         │                                           │
│ Empresa XYZ   │                                           │
│ Cliente 001   │                                           │
│               │                                           │
│               │                                           │
├───────────────┴───────────────────────────────────────────┤
│                         Mensagem...        📎  😊  ➤      │
└───────────────────────────────────────────────────────────┘
```

---

# 7. LISTA DE CONVERSAS

Exibir:

* Foto;
* Nome;
* Número;
* Última mensagem;
* Data/hora;
* Quantidade de mensagens não lidas;
* Status;
* Indicador de mensagem enviada/recebida.

Ordenar pela conversa mais recente.

Implementar:

* Pesquisa;
* Filtro;
* Conversas arquivadas;
* Conversas favoritas;
* Conversas não lidas.

---

# 8. CHAT

Criar uma tela de conversa semelhante ao WhatsApp Web.

Exibir:

```text
Nome do contato
Número
Status
```

Mensagens:

```text
Mensagem recebida
Mensagem enviada
Data
Hora
Status de entrega
Status de leitura
```

Status:

```text
✓ Enviada
✓✓ Entregue
✓✓ Lida
```

Permitir:

* Enviar mensagem;
* Responder mensagem;
* Encaminhar;
* Copiar;
* Excluir;
* Enviar emoji;
* Enviar imagem;
* Enviar documento;
* Enviar áudio, se suportado pela Evolution API;
* Enviar vídeo;
* Marcar como lida.

---

# 9. ENVIO DE MENSAGEM

O envio deverá passar pelo backend.

Fluxo:

```text
Frontend
   ↓
POST /api/messages/send
   ↓
MessageController
   ↓
MessageService
   ↓
EvolutionService
   ↓
Evolution API
   ↓
WhatsApp
```

Após o envio:

1. Registrar mensagem no SQLite;
2. Atualizar conversa;
3. Atualizar interface via WebSocket;
4. Informar status de envio.

---

# 10. RECEBIMENTO DE MENSAGENS

Utilizar Webhook da Evolution API.

Fluxo:

```text
WhatsApp
   ↓
Evolution API
   ↓
Webhook
   ↓
Backend
   ↓
Processamento
   ↓
SQLite
   ↓
WebSocket
   ↓
Frontend
```

Quando uma mensagem chegar:

* Identificar instância;
* Identificar contato;
* Criar contato se não existir;
* Criar conversa se não existir;
* Salvar mensagem;
* Atualizar última mensagem;
* Atualizar contador de não lidas;
* Emitir evento WebSocket;
* Atualizar a interface sem reload.

---

# 11. MENSAGENS PREDEFINIDAS

Criar módulo:

## Mensagens Predefinidas

Permitir criar modelos de mensagens.

Campos:

```text
Nome
Título
Mensagem
Categoria
Status
```

Exemplo:

```text
Nome:
Confirmação de Agendamento

Mensagem:

Olá {{nome}}!

Seu atendimento está agendado para {{data}} às {{hora}}.

Caso precise alterar o horário, entre em contato conosco.
```

Variáveis disponíveis:

```text
{{nome}}
{{primeiro_nome}}
{{telefone}}
{{data}}
{{hora}}
{{empresa}}
{{servico}}
{{profissional}}
```

Criar mecanismo para substituir automaticamente as variáveis.

---

# 12. AGENDAMENTO DE MENSAGENS

Criar módulo:

## Mensagens Agendadas

Permitir agendar:

* Data;
* Hora;
* Contato;
* Instância;
* Mensagem;
* Modelo;
* Status.

Exemplo:

```text
Contato: João
Número: 5511999999999

Mensagem:
Olá João, lembramos que seu atendimento será amanhã às 15:00.

Agendamento:
02/09/2026
14:00
```

Status:

```text
PENDING
PROCESSING
SENT
FAILED
CANCELLED
```

Criar um Job Scheduler utilizando:

```text
node-cron
```

O sistema deverá verificar periodicamente mensagens pendentes.

Exemplo:

```text
A cada 30 segundos
       ↓
Buscar mensagens PENDING
       ↓
Verificar data/hora
       ↓
Enviar pela Evolution API
       ↓
Atualizar status
```

---

# 13. FILA DE ENVIO

Não enviar centenas de mensagens simultaneamente.

Criar uma fila interna de mensagens.

Exemplo:

```text
Queue
 ↓
Mensagem 1
 ↓
Mensagem 2
 ↓
Mensagem 3
 ↓
Mensagem 4
```

Controlar:

* Delay entre mensagens;
* Tentativas;
* Erros;
* Timeout;
* Status.

Configuração:

```env
MESSAGE_DELAY_MIN=3000
MESSAGE_DELAY_MAX=8000
MAX_RETRIES=3
```

O delay deverá ser utilizado de maneira responsável e configurável, evitando comportamento abusivo ou spam.

---

# 14. CONTATOS

Criar módulo:

## Contatos

Campos:

```text
ID
Nome
Nome exibido
Telefone
WhatsApp ID
Foto
Email
Empresa
Tags
Observações
Data de criação
Última interação
```

Funcionalidades:

* Criar;
* Editar;
* Excluir;
* Pesquisar;
* Importar;
* Exportar;
* Adicionar tags;
* Visualizar histórico.

---

# 15. TAGS

Criar sistema de tags.

Exemplos:

```text
Cliente
Lead
VIP
Novo Cliente
Financeiro
Suporte
Interessado
```

Permitir múltiplas tags por contato.

---

# 16. BANCO DE DADOS

Criar estrutura inicial semelhante a:

### users

```text
id
name
email
password_hash
role
created_at
updated_at
```

### whatsapp_instances

```text
id
name
phone
instance_name
api_url
status
last_connected_at
created_at
updated_at
```

### contacts

```text
id
name
phone
whatsapp_id
email
avatar
notes
created_at
updated_at
```

### conversations

```text
id
instance_id
contact_id
last_message
last_message_at
unread_count
status
created_at
updated_at
```

### messages

```text
id
instance_id
conversation_id
contact_id
message_id
direction
type
body
media_url
status
timestamp
created_at
```

### message_templates

```text
id
name
title
body
category
active
created_at
updated_at
```

### scheduled_messages

```text
id
instance_id
contact_id
template_id
message
scheduled_at
status
attempts
error_message
sent_at
created_at
updated_at
```

### tags

```text
id
name
color
created_at
```

### contact_tags

```text
id
contact_id
tag_id
```

### webhook_events

```text
id
instance_id
event
payload
processed
created_at
```

Criar índices adequados para:

```text
phone
whatsapp_id
conversation_id
instance_id
message_id
scheduled_at
status
```

---

# 17. AUTENTICAÇÃO

Criar sistema de login.

Tela:

```text
Logo

E-mail
Senha

[ Entrar ]
```

Utilizar:

```text
JWT
bcrypt
HTTP-only cookies quando aplicável
```

Criar middleware:

```javascript
authMiddleware
```

Todas as rotas administrativas deverão exigir autenticação.

---

# 18. DASHBOARD

Criar Dashboard inicial.

Cards:

```text
Instâncias conectadas
Conversas
Mensagens recebidas
Mensagens enviadas
Mensagens agendadas
Mensagens com erro
```

Adicionar gráfico:

```text
Mensagens enviadas x recebidas
```

Filtros:

```text
Hoje
7 dias
30 dias
Personalizado
```

---

# 19. WEBSOCKET / TEMPO REAL

Utilizar Socket.IO.

Eventos:

```text
message:new
message:sent
message:delivered
message:read
conversation:update
conversation:new
instance:status
notification:new
```

Exemplo:

```javascript
socket.on('message:new', message => {
    // atualizar conversa sem recarregar página
});
```

---

# 20. NOTIFICAÇÕES

Quando chegar nova mensagem:

* Atualizar contador;
* Atualizar conversa;
* Exibir notificação;
* Emitir som opcional;
* Atualizar título da página.

Exemplo:

```text
WhatsApp Manager
(3) Novas mensagens
```

---

# 21. LOGS

Criar sistema de logs.

Registrar:

```text
Login
Logout
Envio de mensagem
Erro de envio
Webhook
Conexão
Desconexão
Criação de instância
Exclusão de instância
Agendamento
Cancelamento
```

Criar arquivos:

```text
logs/app.log
logs/error.log
logs/webhook.log
```

---

# 22. TRATAMENTO DE ERROS

Todos os endpoints devem retornar respostas padronizadas.

Sucesso:

```json
{
  "success": true,
  "data": {}
}
```

Erro:

```json
{
  "success": false,
  "error": {
    "code": "MESSAGE_SEND_ERROR",
    "message": "Não foi possível enviar a mensagem."
  }
}
```

Nunca exibir stack trace para o usuário em produção.

---

# 23. SEGURANÇA

Implementar:

* Helmet;
* CORS configurável;
* Rate limiting;
* Sanitização de entradas;
* Validação de dados;
* Proteção contra SQL Injection;
* Proteção contra XSS;
* Senhas com bcrypt;
* JWT;
* Variáveis sensíveis no `.env`;
* Logs de segurança;
* Controle de sessão;
* Validação de webhook;
* Limitação de upload;
* Validação de MIME Type.

Nunca armazenar senhas em texto puro.

Nunca armazenar API Keys diretamente no código.

---

# 24. API REST

Criar endpoints organizados.

### Auth

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Instances

```text
GET    /api/instances
POST   /api/instances
GET    /api/instances/:id
POST   /api/instances/:id/connect
POST   /api/instances/:id/disconnect
POST   /api/instances/:id/reconnect
DELETE /api/instances/:id
```

### Contacts

```text
GET    /api/contacts
POST   /api/contacts
GET    /api/contacts/:id
PUT    /api/contacts/:id
DELETE /api/contacts/:id
```

### Conversations

```text
GET /api/conversations
GET /api/conversations/:id
POST /api/conversations/:id/read
```

### Messages

```text
GET  /api/messages
POST /api/messages/send
POST /api/messages/media
DELETE /api/messages/:id
```

### Templates

```text
GET    /api/templates
POST   /api/templates
PUT    /api/templates/:id
DELETE /api/templates/:id
```

### Scheduled Messages

```text
GET    /api/scheduled
POST   /api/scheduled
PUT    /api/scheduled/:id
DELETE /api/scheduled/:id
POST   /api/scheduled/:id/cancel
```

### Webhook

```text
POST /api/webhooks/evolution
```

---

# 25. RESPONSIVIDADE

A aplicação deverá funcionar perfeitamente em:

* Desktop;
* Notebook;
* Tablet;
* Smartphone.

No celular, adaptar a interface:

```text
Lista de conversas
        ↓
Chat
```

Utilizar navegação semelhante ao WhatsApp Mobile.

---

# 26. TEMA VISUAL

Criar interface profissional.

Características:

* Design moderno;
* Minimalista;
* Responsivo;
* Dark Mode;
* Light Mode;
* Sidebar;
* Cards;
* Badges;
* Modais;
* Toast notifications.

Não copiar logotipo, identidade visual ou elementos proprietários do WhatsApp.

A aplicação pode utilizar uma experiência de interação semelhante ao WhatsApp Web, mas deverá possuir **identidade visual própria**.

Nome provisório:

```text
WhatsApp Manager
```

O nome deverá ficar facilmente configurável.

---

# 27. CONFIGURAÇÕES

Criar página:

## Configurações

Seções:

### Geral

```text
Nome da aplicação
Logo
Fuso horário
Idioma
```

### Evolution API

```text
URL
API Key
Timeout
```

### Mensagens

```text
Delay mínimo
Delay máximo
Número de tentativas
Intervalo do Scheduler
```

### Notificações

```text
Som
Desktop Notifications
```

### Segurança

```text
Tempo de sessão
Rate Limit
```

---

# 28. RESPONSABILIDADE DO SCHEDULER

O Scheduler deverá continuar funcionando mesmo que o usuário feche o navegador.

A execução deve acontecer no backend.

Exemplo:

```text
Frontend
   |
   | agenda mensagem
   ↓
Backend
   |
   ↓
SQLite
   |
   ↓
Scheduler
   |
   ↓
Evolution API
   |
   ↓
WhatsApp
```

---

# 29. RECONEXÃO AUTOMÁTICA

Implementar monitoramento das instâncias.

Caso uma instância fique desconectada:

```text
CONNECTED
     ↓
DISCONNECTED
     ↓
Sistema detecta
     ↓
Tenta reconectar
     ↓
Atualiza status
```

Não realizar tentativas infinitas.

Utilizar backoff progressivo.

---

# 30. WEBHOOK IDEMPOTENTE

O sistema não deverá salvar duas vezes o mesmo evento recebido da Evolution API.

Utilizar identificadores únicos como:

```text
message_id
event_id
```

Antes de processar um evento:

```text
Evento recebido
      ↓
Já existe?
   ↙       ↘
 SIM       NÃO
 ↓          ↓
Ignorar    Processar
```

---

# 31. IMPORTAÇÃO DE CONTATOS

Permitir importação de contatos via:

```text
CSV
Excel
```

Campos:

```text
Nome
Telefone
Email
Tags
```

Validar números de telefone.

Formato recomendado:

```text
5511999999999
```

Não duplicar contatos.

---

# 32. ENVIO EM LOTE

Criar funcionalidade opcional:

## Campanha

Permitir selecionar:

```text
Instância
Lista de contatos
Mensagem predefinida
Data
Hora
```

Exemplo:

```text
Campanha:
Aniversário

Mensagem:
Olá {{nome}}, feliz aniversário! 🎉
Desejamos muito sucesso para você.
```

O sistema deverá gerar mensagens individuais a partir do template.

Utilizar fila de envio e controles de taxa.

Implementar mecanismos de opt-out e evitar disparos para contatos que tenham solicitado não receber mensagens.

---

# 33. HISTÓRICO

Cada contato deverá possuir:

```text
Dados cadastrais
Tags
Conversas
Mensagens
Agendamentos
Campanhas
Histórico de interação
```

Tela:

```text
Cliente
   ↓
Informações
   ↓
Histórico
   ↓
Conversas
   ↓
Mensagens
```

---

# 34. AUDITORIA

Registrar quem realizou ações administrativas.

Tabela:

```text
audit_logs
```

Campos:

```text
id
user_id
action
entity
entity_id
ip
user_agent
created_at
```

Exemplos:

```text
USER_LOGIN
MESSAGE_SENT
INSTANCE_CREATED
INSTANCE_DELETED
TEMPLATE_CREATED
SCHEDULE_CREATED
```

---

# 35. DOCKER

Criar suporte a Docker.

Criar:

```text
Dockerfile
docker-compose.yml
.dockerignore
```

O projeto deverá funcionar com:

```bash
docker compose up -d
```

Estrutura:

```text
Application
    |
    ├── Node.js
    ├── SQLite
    └── Evolution API
```

A Evolution API poderá estar em servidor separado.

---

# 36. VARIÁVEIS DE AMBIENTE

Criar `.env.example`:

```env
NODE_ENV=production

PORT=3000

APP_NAME=WhatsApp Manager

JWT_SECRET=CHANGE_ME

DATABASE_URL=file:./database/database.sqlite

EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=CHANGE_ME

WEBHOOK_URL=https://seu-dominio.com/api/webhooks/evolution

MESSAGE_DELAY_MIN=3000
MESSAGE_DELAY_MAX=8000

MAX_RETRIES=3

TIMEZONE=America/Sao_Paulo
```

---

# 37. PERFORMANCE

O sistema deverá:

* Utilizar paginação;
* Não carregar milhares de mensagens de uma vez;
* Utilizar índices SQLite;
* Utilizar cache quando necessário;
* Utilizar WebSocket para atualizações;
* Evitar polling excessivo;
* Processar mensagens em background;
* Utilizar filas para envios;
* Evitar consultas SQL desnecessárias.

---

# 38. ESCALABILIDADE

Embora o banco inicial seja SQLite, desenvolver o sistema utilizando uma camada de abstração para permitir futuramente:

```text
SQLite
   ↓
PostgreSQL
```

Sem alterar a lógica principal da aplicação.

A arquitetura deverá permitir futuramente:

```text
Load Balancer
       ↓
Node.js Server 1
Node.js Server 2
Node.js Server 3
       ↓
PostgreSQL
       ↓
Redis
       ↓
Evolution API
```

---

# 39. DOCUMENTAÇÃO

Criar `README.md` contendo:

## Instalação

```bash
npm install
```

## Configuração

```bash
cp .env.example .env
```

## Banco

```bash
npx prisma migrate dev
```

## Desenvolvimento

```bash
npm run dev
```

## Produção

```bash
npm start
```

## Docker

```bash
docker compose up -d
```

Documentar:

* Instalação;
* Configuração da Evolution API;
* Configuração do Webhook;
* Banco de dados;
* Variáveis de ambiente;
* API;
* Scheduler;
* WebSocket;
* Deploy;
* Backup;
* Troubleshooting.

---

# 40. BACKUP DO SQLITE

Criar funcionalidade de backup.

Possibilitar:

```text
Backup manual
Backup automático
Download do backup
```

Exemplo:

```text
/backups/database-2026-09-01.sqlite
```

Nunca realizar backup enquanto houver risco de corrupção do arquivo.

Preferencialmente utilizar mecanismo seguro de backup do SQLite.

---

# 41. REQUISITOS DE QUALIDADE

O código deverá seguir:

* Clean Code;
* SOLID quando aplicável;
* Separação de responsabilidades;
* Async/Await;
* Tratamento de exceções;
* Validação de dados;
* Comentários apenas quando necessários;
* Nomes de funções e variáveis claros;
* Código modular;
* Baixo acoplamento.

Evitar:

```text
Código duplicado
Funções gigantes
SQL espalhado pelo projeto
Credenciais hardcoded
Lógica de negócio dentro das rotas
```

---

# 42. TESTES

Criar testes para:

* Login;
* Autenticação;
* Criação de instância;
* Conexão;
* Envio de mensagem;
* Recebimento de webhook;
* Criação de contato;
* Criação de template;
* Agendamento;
* Cancelamento;
* Scheduler;
* Substituição de variáveis;
* Tratamento de erro;
* Idempotência de webhook.

---

# 43. FLUXO PRINCIPAL

### Conectar WhatsApp

```text
Login
 ↓
Dashboard
 ↓
Instâncias
 ↓
Adicionar Instância
 ↓
Criar na Evolution API
 ↓
Exibir QR Code
 ↓
Usuário escaneia
 ↓
Evolution API confirma conexão
 ↓
Webhook
 ↓
Backend
 ↓
Atualiza banco
 ↓
Interface mostra CONNECTED
```

### Receber mensagem

```text
WhatsApp
 ↓
Evolution API
 ↓
Webhook
 ↓
Backend
 ↓
Validar evento
 ↓
Verificar duplicidade
 ↓
Salvar contato
 ↓
Salvar conversa
 ↓
Salvar mensagem
 ↓
WebSocket
 ↓
Interface atualizada
```

### Enviar mensagem

```text
Usuário escreve
 ↓
Enviar
 ↓
Backend
 ↓
Evolution API
 ↓
WhatsApp
 ↓
Salvar mensagem
 ↓
Atualizar status
 ↓
WebSocket
```

### Mensagem agendada

```text
Usuário cria agendamento
 ↓
SQLite
 ↓
Status PENDING
 ↓
Scheduler
 ↓
Data/hora atingida
 ↓
Fila
 ↓
Evolution API
 ↓
WhatsApp
 ↓
Status SENT
```

---

# 44. ENTREGÁVEIS

A IA de desenvolvimento deverá entregar:

1. Código-fonte completo;
2. Backend Node.js;
3. Frontend completo;
4. Banco SQLite;
5. Migrations;
6. Integração Evolution API;
7. Webhooks;
8. WebSocket;
9. Scheduler;
10. Sistema de fila;
11. Autenticação;
12. Dashboard;
13. Gerenciamento de contatos;
14. Gerenciamento de conversas;
15. Mensagens predefinidas;
16. Mensagens agendadas;
17. Campanhas;
18. Tags;
19. Logs;
20. Auditoria;
21. Backup;
22. Docker;
23. `.env.example`;
24. README.md;
25. Testes automatizados.

---

# 45. REGRA IMPORTANTE PARA O DESENVOLVIMENTO

Não entregar apenas um protótipo visual.

O sistema deverá ser **funcional de ponta a ponta**.

Todas as telas deverão estar conectadas ao backend e ao banco de dados.

Não utilizar:

```text
Dados mockados
Dados fictícios
Botões sem funcionalidade
APIs simuladas
Funções TODO
```

Sempre que uma funcionalidade for implementada, conectar:

```text
Interface
   ↓
API REST
   ↓
Controller
   ↓
Service
   ↓
Database / Evolution API
```

A aplicação deve ser executável localmente e preparada para produção.

---

# 46. ORDEM DE DESENVOLVIMENTO

Desenvolva o projeto seguindo esta sequência:

### Fase 1

Estrutura do projeto + Node.js + Express + SQLite.

### Fase 2

Autenticação e usuários.

### Fase 3

Integração Evolution API.

### Fase 4

Gerenciamento de instâncias.

### Fase 5

Webhook.

### Fase 6

Contatos e conversas.

### Fase 7

Envio e recebimento de mensagens.

### Fase 8

WebSocket em tempo real.

### Fase 9

Templates de mensagens.

### Fase 10

Agendamento.

### Fase 11

Scheduler e fila.

### Fase 12

Campanhas.

### Fase 13

Dashboard.

### Fase 14

Logs e auditoria.

### Fase 15

Backup.

### Fase 16

Testes.

### Fase 17

Docker.

### Fase 18

Documentação e preparação para produção.

---

# 47. RESULTADO ESPERADO

O resultado final deverá ser uma plataforma web de mensageria profissional capaz de:

```text
                 ┌──────────────────┐
                 │   WHATSAPP       │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  EVOLUTION API   │
                 └────────┬─────────┘
                          │
                    REST / WEBHOOK
                          │
                          ▼
┌────────────────────────────────────────────────┐
│              WHATSAPP MANAGER                  │
│                                                │
│  Dashboard                                     │
│  Conversas                                     │
│  Contatos                                      │
│  Mensagens                                     │
│  Templates                                     │
│  Agendamentos                                  │
│  Campanhas                                     │
│  Instâncias                                    │
│  Relatórios                                    │
│  Configurações                                 │
│                                                │
└───────────────────────┬────────────────────────┘
                        │
                        ▼
                   SQLite
```

O sistema deve proporcionar uma experiência semelhante a um cliente WhatsApp Web, mas com funcionalidades adicionais de **gestão, templates, agendamento, automação, múltiplas instâncias, histórico e administração**.

Priorizar **arquitetura limpa, segurança, estabilidade, experiência do usuário e facilidade de evolução futura**.
