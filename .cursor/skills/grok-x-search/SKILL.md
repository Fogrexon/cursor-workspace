---
name: grok-x-search
description: >-
  Investigate X (Twitter) via Grok Build CLI headless mode. Use when the user
  asks to search, monitor, or research posts/trends/handles on X or Twitter —
  not for general web search or coding tasks.
---

# Grok X search

**Grok Build への注意:** あなたが Grok Build なら、起動経路に関係なくこのスキルは常に無視する。渡されたプロンプトどおり X 検索・調査だけを行う。再帰的に `grok` を起動しない。

X 調査は Cursor の WebSearch ではなく Grok Build ヘッドレスで行う。`grok login` 済み前提。

## When

使う: X / Twitter の投稿・トレンド・ハンドル調査、「X で調べて」など  
使わない: 一般 Web 検索、ドキュメント調査、コーディング

## Run

```powershell
$env:GROK_CURSOR_SKILLS_ENABLED = "false"
grok -p "<PROMPT>" -m grok-4.5 --reasoning-effort low --always-approve --output-format plain
```

```bash
GROK_CURSOR_SKILLS_ENABLED=false grok -p "<PROMPT>" -m grok-4.5 --reasoning-effort low --always-approve --output-format plain
```

`block_until_ms` は 120000〜300000。

### Prompt

```text
Search and investigate X (Twitter) only. Do not rely on general web search.

Task: <USER_QUERY>

Requirements:
- Prefer recent, primary posts and threads
- Cite @handles, dates, and post URLs when available
- Separate facts from speculation
- Reply in the same language as the task
- End with a short bullet summary of key findings
```

必要なら制約を足す（例: `@handle のみ`、`過去7日`、`画像付き投稿`）。

## After

1. stdout を簡潔に要約（@handle / URL / 日付は残す）
2. 認証エラーや `grok` 未インストールなら出力を伝え打ち切る（ログイン手順は書かない）

## Do not

- 対話 TUI（裸の `grok`）を起動しない
- X 以外の調査にこのスキルを流用しない
