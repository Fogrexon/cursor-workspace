---
name: knowledge-capture
description: >-
  Capture business requirements, domain intent, and incident lessons that code
  analysis cannot infer. Write to knowledge/, distill into summaries, and
  promote recurring constraints into rules/skills/tests. Use when the user
  states product intent, non-goals, priorities, constraints, or when an
  incident/regression/repeated mistake occurs (「要件」「意図」「やらない」
  「インシデント」「また同じ」「再発防止」「knowledge」).
---

# Knowledge capture

Repo memory for **intent** and **do-not-repeat**. Code is not the source of truth for these.

Layout: see [knowledge/README.md](../../../knowledge/README.md). Templates: [reference.md](reference.md).

## When to capture

| Signal | Destination |
|--------|-------------|
| Who it's for, success criteria, priority, non-goals | `knowledge/inbox/` → later `domain/` or `apps/<app>/` |
| Platform/ops/legal constraints not obvious in code | `domain/constraints.md` or inbox |
| Bug, regression, "same mistake again", costly debug | `incidents/inbox/` + `lessons.md` + `catalog.md` |
| Why we chose A over B | `decisions/` |

Do **not** dump implementation how-tos here — those belong in skills/rules.

## Capture workflow (requirements)

1. Separate **Fact** (user said) from **Interpretation** (your inference). Mark Open questions.
2. Write `knowledge/inbox/YYYY-MM-DD-<slug>.md` using the inbox template in reference.md.
3. If already stable and app-scoped, also update or create `knowledge/apps/<app>/product-intent.md`.
4. On task boundary or when asked to distill: merge inbox into `domain/` / `apps/` / `decisions/`; mark inbox `distilled` or delete.
5. Promote only **must always obey** items into a short `.cursor/rules/*.mdc` (Must / Must not). Link back to knowledge for background.

## Incident workflow

1. Create `knowledge/incidents/inbox/INC-YYYY-MM-DD-<slug>.md` (incident template).
2. Append one row to `catalog.md` and `lessons.md` (one-liner + Do not + Barrier).
3. **Prevention must not be empty** before status `mitigated`:
   - reproducible → add/adjust a regression **test** (preferred)
   - always-on constraint → short **rule**
   - procedural → update/create a **skill**
4. Same Trigger a second time → promotion to rule or test is **required**, not optional.
5. Close only when Barrier exists and the fix is in place.

## Distill checklist

- [ ] Facts vs Open vs Not-code labeled
- [ ] App intent has fantasy / success / non-goals / constraints
- [ ] Incident has Symptom, Do not, Prevention
- [ ] No duplicate of an existing rule/skill — update that instead
- [ ] Long background stays in `knowledge/`; rules stay thin

## Must not

- Put secrets, credentials, or private personal data in `knowledge/`
- Hand-edit `docs/<app>/` build output to "document" intent
- Grow alwaysApply rules with full incident narratives
