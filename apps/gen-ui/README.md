# gen-ui host

Data-analysis generative UI + Cursor SDK local host.

- Library: `lib/gen-ui`
- Design: `knowledge/apps/gen-ui/design.md`
- Source is public. Do not commit `.env` / API keys.
- GitHub Pages is not required.

## Model (slice 1)

- LLM / mock generates a constrained UI tree, preferably with `dataView`
- Filters, aggregation, chart/table updates run **locally**
- Current dataset: dummy `user_logs` (~8k product analytics events)
- Fields include `event_name`, `platform`, `country`, `plan`, `page`, `duration_ms`, `revenue_usd`, …
- Default screen: user activity; chat: logs / list / form
- SQL / remote fetch comes later on the same `source + query + views` model

## Setup

```bash
cd lib/gen-ui && npm install && npm test && npm run build
cd ../../apps/gen-ui && npm install
```

## Mock

```bash
cd apps/gen-ui
npm run demo:mock
# http://localhost:5177
# default screen: user activity; chat: logs / list / form
```

## Live

```bash
cp .env.example .env   # set CURSOR_API_KEY
npm run dev
```
