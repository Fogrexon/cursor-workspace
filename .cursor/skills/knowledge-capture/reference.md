# Templates

## Inbox (requirements)

```markdown
# YYYY-MM-DD <title>
- Source: chat | issue | other
- App: <app-name | cross-cutting>
- Status: raw | distilled
## Facts
- …
## Interpretation
- …
## Open
- …
## Not code
- （実装方針は未決、など）
```

## App product intent

```markdown
# <App> — Product intent
## Player / user fantasy
## Success
## Non-goals
## Constraints
```

## ADR

```markdown
# NNNN Title
- Status: proposed | accepted | superseded
- Date: YYYY-MM-DD
## Context
## Decision
## Alternatives rejected
## Consequences
```

## Incident

```markdown
# INC-YYYY-MM-DD-<slug>
- Status: open | mitigated | closed
- App / area:
- Symptom:
- Trigger:
- Impact:
- Root cause:
- Fix:
- Prevention:
  - test:
  - rule:
  - skill:
- Do not:
```

## lessons.md row

`| INC-… | one-liner | do not … | test / rule / skill | open |`
