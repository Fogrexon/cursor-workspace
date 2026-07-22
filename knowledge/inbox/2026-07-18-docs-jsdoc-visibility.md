# 2026-07-18 Design docs, JSDoc, visibility
- Source: chat
- App: cross-cutting
- Status: distilled
## Facts
- 各ライブラリ / アプリに設計ドキュメントを残すべき。
- アプリコード自体に JSDoc コメントを書いてほしい。
- コード分割のように、可視性（読みやすさ・責務の見通し）を意識して書いてほしい。
## Interpretation
- ビジネス意図は knowledge/ に残しつつ、各 lib/app 直下に開発者向け README（設計・構成）を置く二層にする。
- 公開 API（lib の export、UI/logic のエントリ関数）に JSDoc を付ける。実装詳細の逐条コメントは不要。
- 大きいファイルは責務ごとに分割し、ディレクトリで意図が読めるようにする（separation-of-concerns の強化）。
## Open
- 既存アプリへ遡って README/JSDoc を付けるかは個別判断（新規・変更箇所を優先）。
## Not code
- 「可視性」は網羅コメントではなく、構造と公開境界の明確化を指す。
