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

## Boas práticas e notas importantes

- O frontend NÃO deve conectar diretamente ao RabbitMQ — consuma via API/projeções.
- Tokens JWT atuais são armazenados em localStorage (educacional). Para produção, considere cookies httpOnly + endpoint de refresh.
- Sempre incluir `?turmaId=` nas chamadas que exigem `turmaId` (boletins/disciplinas).
- Validar `res.ok` antes de chamar `res.json()` em requests fetch.

---

## Testes e CI

- Testes backend e frontend usam Jest/@testing-library. Configure pipeline para rodar `npm test -- --coverage` em CI.

---

## Contribuindo

1. Abra uma issue descrevendo a mudança.
2. Crie um branch nomeado `feat/<descricao>` ou `fix/<descricao>`.
3. Faça PR com descrição e link para issue.

---

Se quiser, atualizo este README com seções adicionais: badges, instruções de deployment, ou exemplos de API. Quer que eu aplique essas melhorias agora?