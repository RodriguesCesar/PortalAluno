# Portal de Notas

Portal de gestão e visualização de notas acadêmicas — implementação educativa em TypeScript seguindo princípios Hexagonal, DDD, CQRS e Event-Driven.

Principais contextos: Identidade & Acesso, Catalogo Academico, Matriculas, Boletim, Vinculo Docente e Relatorios.

---

## Rápido começo (desenvolvimento)

1. Subir dependências de infraestrutura:

```bash
docker compose up -d
```

2. Backend

```bash
# na raiz do repositório
npm install
npm run dev        # inicia em http://localhost:3000
```

3. Frontend

```bash
cd src\apps\portal\frontend
npm install
npm start          # inicia em http://localhost:8032
```

> Copie `.env.example` para `.env` tanto no backend quanto no frontend antes de rodar.

---

## Scripts úteis (raiz)

- npm run dev           — inicia backend em modo de desenvolvimento
- npm run build         — build do backend
- npm test              — executa testes
- npm run lint          — linting
- npm run seed:mongo    — popula dados de exemplo no MongoDB
- npm run seed:mongo:docker — executa seed via container (se não tiver mongosh local)

Frontend (src\apps\portal\frontend):
- npm start             — inicia CRA (porta 8032)
- npm run build         — build do frontend
- npm test              — testes frontend

---

## Infraestrutura

- MongoDB (`mongo:7`) — porta 27017, database: `portal_notas`
- RabbitMQ (`rabbitmq:3-management`) — AMQP 5672, UI 15672

Use `docker compose ps` para verificar serviços.

---

## Variáveis de ambiente

Principais variáveis (veja `.env.example`):

- MONGODB_URI
- RABBITMQ_URL
- RABBITMQ_EXCHANGE
- JWT_SECRET (obrigatório)
- FRONTEND_ORIGIN
- REACT_APP_API_URL (frontend)

---

## Segurança da API

- O backend aplica **headers de segurança** com `helmet`.
- O endpoint `POST /auth/login` possui **rate limiting** (janela de 15 minutos, até 10 tentativas por IP).
- Em caso de excesso de tentativas, a API retorna `429` com mensagem orientando a tentar novamente depois.

---

## Baseline operacional de segurança

- **Segredos**
  - Não comite `.env` em repositório.
  - Trate `JWT_SECRET` como segredo sensível e faça rotação periódica.
- **CORS por ambiente**
  - Defina `FRONTEND_ORIGIN` de acordo com o ambiente (dev/homolog/prod).
  - Evite origem ampla (`*`) em produção.
- **Logs**
  - Não registrar token JWT, senhas, cookies, ou payloads sensíveis.
  - Em erros, priorizar mensagens técnicas sem dados pessoais.
- **Sessão**
  - Estado atual usa `localStorage` (educacional).
  - Estratégia recomendada para produção: cookie `httpOnly` + refresh token com rotação.

---

## Testes e CI

- O repositório possui workflow de CI em `.github/workflows/ci.yml` com:
  - lint, build e testes de backend;
  - build e testes de frontend;
  - auditoria de dependências.

### Política de falha no pipeline

- **Bloqueante**: lint/build/test e auditoria de dependências de produção do backend (`npm audit --omit=dev --audit-level=high`).
- **Advisory (temporário)**: auditoria de dependências de produção do frontend.
  - A falha é registrada no workflow, mas não bloqueia merge nesta fase.
  - Meta: tornar bloqueante após estabilização das dependências legadas.

---

## Boas práticas e notas importantes

- O frontend NÃO deve conectar diretamente ao RabbitMQ — consuma via API/projeções.
- Sempre incluir `?turmaId=` nas chamadas que exigem `turmaId` (boletins/disciplinas).
- Validar `res.ok` antes de chamar `res.json()` em requests fetch.

---

## Contribuindo

1. Abra uma issue descrevendo a mudança.
2. Crie um branch nomeado `feat/<descricao>` ou `fix/<descricao>`.
3. Faça PR com descrição e link para issue.
