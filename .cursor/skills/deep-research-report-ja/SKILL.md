---
name: deep-research-report-ja
description: >-
  日本語で意思決定に使えるdeep researchレポートを作成・全面改稿する。
  論文・技術資料の再現可能な選定、原典分析、証拠評価、アーキテクチャ比較、
  提言へのトレーサビリティが必要な依頼で使用する。
---

# 日本語deep researchレポート

## 目的

読者が「詳しくなった」と感じるだけでなく、**何を選び、何を作り、何を見送り、何を追加検証するか**を決められる報告書を作る。

deep researchは検索結果の要約ではない。次の連鎖を第三者が追跡できる状態をいう。

```text
読者の意思決定
→ 調査質問
→ 検索・選定
→ 原典の構造的読解
→ 証拠強度の評価
→ 横断比較
→ 提言
→ 実装・検証条件
```

## 成果物の原則

- 読者へ案内する主成果物は**一つの統合レポート**にする。
- 要件メモ、検索ログ、引用取得ログは付録または内部資料であり、別レポートとして案内しない。
- 冒頭だけで、読者が知りたいこと、推奨判断、主要根拠、留保が分かるようにする。
- 本文は結論の根拠を検証できる情報量を持たせる。
- 文章量ではなく、意思決定に必要な情報の充足度で完成を判定する。

## 保存場所（必須）

ユーザー要請の deep research は **`reports/deep-research/`** に置く。`knowledge/` には置かない（knowledge はプロジェクト固有の意図・制約・インシデント）。

```text
reports/deep-research/YYYY-MM-DD-<slug>.md
```

Report Viewer（`apps/report-viewer`）はこのツリーのみを表示する。詳細は `.cursor/rules/reports.mdc` と `reports/README.md`。

### 必須 frontmatter

ファイル先頭に次を置く（一覧・検索用）。

```yaml
---
title: <表示タイトル>
summary: <一覧用要約>
date: YYYY-MM-DD
category: deep-research
tags:
  - <検索用タグ>
status: draft | final
audience: <想定読者>
lang: ja
---
```

提出前に `apps/report-viewer` で `npm run build` し、Pages バンドルを更新する。

## 1. 最初に読者の意思決定を分析する

### 必須質問

依頼文から次を抽出する。

1. 読者はこのレポートの後で何を決めたいか。
2. 比較対象は何か。
3. 成功を何で測るか。
4. 対象範囲と非対象範囲は何か。
5. どの不確実性が判断を変え得るか。
6. 読者が求める深さは、概観、選定、設計、実装仕様のどこまでか。

依頼が曖昧でも、作業を止める必要がなければ合理的な仮定を置く。仮定は冒頭に明記し、用途別の分岐を示す。

### レポート冒頭の書式

```markdown
## このレポートが答える問い
- Q1: …
- Q2: …

## 想定読者と意思決定
- 読者:
- 決めたいこと:
- 前提:
- 対象外:
```

### 禁止

- 依頼文を言い換えただけの「目的」にする。
- 読者の意思決定を分析せず、いきなり論文一覧から始める。
- 未確定事項をすべて「Open」として残し、結論を避ける。

## 2. 調査質問と用語を先に固定する

広い依頼では、対象概念を操作可能な定義へ変える。

例として「エージェント実行基盤のアーキテクチャ」は次を本文で扱う論文と定義する。

- componentと責務
- control flow / data flow
- state、memory、artifact
- model、tool、environment、evaluatorの境界
- concurrency、scheduling、budget
- failure handling、checkpoint、recovery
- isolation、authority、security boundary
- observability、evaluation、reproducibility

「agentの精度を測るだけ」「memory moduleだけ」「prompt手法だけ」の論文は、主対象ではなく補助証拠に分類する。

「効率」は少なくとも次に分解する。

- quality / verified success
- token / API cost
- wall-clock / latency / throughput
- CPU / GPU / memory / storage
- reliability / recovery
- human effort
- unsafe or unintended side effects

## 3. 検索と選定を再現可能にする

### 検索計画

最低限、次を記録する。

- 検索日
- 対象期間
- 検索先
- 検索語または検索式
- 初期候補群
- inclusion / exclusion criteria
- 重複排除規則
- 期間外例外の条件

### 選定軸

論文ごとに0〜3等の共通尺度で評価する。

| 軸 | 確認内容 |
|---|---|
| Relevance | 調査質問へ直接答えるか |
| Architecture centrality | architectureが主題か |
| Evidence strength | ablation、同条件比較、規模、統計 |
| Recency | 指定期間との適合 |
| Impact | 被引用、採択、利用、後続採用 |
| Reproducibility | code、data、environment、設定 |
| Generalizability | 対象用途へ移せるか |

被引用数だけで選ばない。新しい論文は引用が蓄積していないため、査読、実験規模、実装公開、問題への直接性で補う。

### 引用指標

- source、record ID、取得日時を記録する。
- preprint版と会議版の重複を確認する。
- 索引間で大差がある場合は値を断定せず、重複・名寄せ問題を説明する。
- arXiv閲覧数など、公式に提供されない値を推測しない。

### 選定結果の提示

主対象10本だけでなく、主要な落選候補と理由を短く示す。これにより「なぜこの10本か」を検証できる。

## 4. 原典を構造的に読む

二次記事は候補発見に使ってよいが、主要主張の根拠にはしない。原論文本文、付録、公式会議ページ、必要なら公式実装を確認する。

### 各論文から必ず抽出する項目

```markdown
### 書誌と位置づけ
- 正式タイトル、著者、初版、版、採択、原典URL
- 選定理由
- 証拠種別: causal ablation / controlled comparison / system evaluation /
  observational study / platform description / preprint proposal

### 解こうとした問題
- 既存基盤の何がボトルネックか
- 想定workloadと制約

### 提案アーキテクチャ
- component
- control/data flow
- state boundary
- execution/environment boundary
- scheduling/concurrency
- failure/recovery
- security/authority
- observability/evaluation

### 実験
- task、sample、model、baseline
- budget、hardware、trial/seed
- metric、effect size、cost
- ablation

### 何を証明したか
- 原論文から直接支持される結論

### 何を証明していないか
- 未評価、外挿、交絡、再現性、汚染

### 実装へ持ち込む判断
- 採用するpattern
- 採用しない部分
- 導入前に必要な検証
```

architectureを扱うレポートでは、各論文の「提案アーキテクチャ」を省略してはならない。

### 数値の扱い

- percentageとpercentage pointを区別する。
- best-of-kと単一長時間runを区別する。
- model差とharness差を分離する。
- 最終品質、費用、時間、throughputを別指標として扱う。
- 数値には原論文のsection、table、figureを可能な限り付ける。
- 異なるbenchmarkの成功率を同じ尺度として順位付けしない。

## 5. 証拠と提言を分離する

提言には次のラベルを付ける。

| ラベル | 意味 |
|---|---|
| E1 | 複数の原論文で直接支持 |
| E2 | 単一論文または限定領域で直接支持 |
| E3 | 論文結果からの合理的外挿 |
| P | セキュリティ・分散システム等の実務原則 |
| H | 自組織で検証すべき仮説 |

たとえば「sandboxを分離する」は研究で実装例があっても、microVMが常にDockerより優れることまで証明されているとは限らない。事実、著者の主張、こちらの設計判断を同じ断定文に混ぜない。

### トレーサビリティ表

| 提言 | 根拠論文 | ラベル | 期待効果 | 反証条件 |
|---|---|---|---|---|
| bounded observation | SWE-agent | E2 | contextと誤操作を削減 | 対象taskで成功率低下 |

## 6. 横断分析は論文順ではなく意思決定順に書く

個別要約後は、読者が決める単位で再構成する。

実行基盤なら次の順が使える。

1. workloadとautonomy level
2. agent / harness / environment / evaluatorの境界
3. tool・ACI contract
4. state、artifact、memory
5. schedulingとresource management
6. sandboxとcheckpoint/recovery
7. verificationとevaluation
8. observability
9. multi-agent
10. securityとhuman approval

各節で「選択肢」「使い分け」「根拠」「導入条件」を示す。

## 7. 提言を実装可能な形へ落とす

レポートがarchitectureを提言する場合、最低限次を含める。

- component diagramとtrust boundary
- run lifecycle / state machine
- component contract
- RunSpecまたは同等の実行manifest
- event / trace schema
- tool contractとside-effect分類
- retry、timeout、idempotency、checkpoint semantics
- workload別decision matrix
- MVP / later / do not build
- build-vs-buyの境界
- KPI / SLO / adoption gate
- rollback条件

具体的なSLO値は、論文の普遍値ではなく「設計初期値」と明記する。

## 8. 日本語レポートの体裁

### 推奨章立て

1. 表紙情報
2. 意思決定サマリー
3. このレポートが答える問い
4. 推奨構成と作らないもの
5. 調査方法
6. 選定結果
7. 論文別分析
8. 横断比較
9. 証拠から要件へのトレーサビリティ
10. 参照アーキテクチャ
11. 用途別decision matrix
12. 実装仕様
13. 評価計画と導入gate
14. リスク・未解決事項
15. 結論
16. 参考文献・付録

### 書き方

- 結論を先に書き、その後に理由を書く。
- 一段落一論点とする。
- 主語を省略して責任主体を曖昧にしない。
- 「効率的」「堅牢」「柔軟」だけで済ませず、何の指標かを書く。
- 英語用語は初出で日本語説明を付け、その後の表記を統一する。
- 長い列挙より、比較表、decision table、図を使う。
- 表や図の直後に「この表から何を判断すべきか」を書く。
- 背景説明より、読者の判断を変える情報へ紙幅を使う。

### 図

関係を理解しやすくする場合だけ使う。architectureでは次が有効。

- component / trust-boundary図
- run state machine
- action→observation→verification sequence
- autonomy escalation tree
- evidence map

## 9. 品質ゲート

完成前にすべて確認する。

可能なら提出前に二つの独立したreview passを行う。

1. **原典監査**: 書誌、査読状況、数値、Table/Figure、実験条件、証明範囲を確認する。
2. **読者監査**: 読者の問い、選定妥当性、情報量、比較可能性、実装判断、単一成果物性を確認する。

原典監査の修正が終わる前に、文章の見栄えだけを整えて完了にしない。

### Intent

- [ ] 読者が決めたいことを冒頭に書いた
- [ ] 主要な問いへ結論を返した
- [ ] 仮定と対象外を明記した

### Research

- [ ] 検索・選定手順を再現できる
- [ ] 主張は原典まで追跡できる
- [ ] 各論文の選定理由と落選理由が分かる
- [ ] 最新性と影響度を別々に評価した
- [ ] citation recordの重複問題を処理した

### Analysis

- [ ] 各論文にarchitecture、実験、証明範囲、限界がある
- [ ] 比較不能な成功率を直接比較していない
- [ ] 数値に条件と原典箇所がある
- [ ] evidenceとdesign inferenceを区別した

### Decision

- [ ] 推奨と非推奨が具体的
- [ ] workload別の使い分けがある
- [ ] MVPと後続段階にexit criteriaがある
- [ ] build-vs-buyと追加実験がある

### Presentation

- [ ] 主成果物は一つ
- [ ] 保存先が `reports/deep-research/` である（`knowledge/` ではない）
- [ ] 必須 frontmatter（title / summary / date / category / tags）がある
- [ ] 冒頭だけで結論と留保が分かる
- [ ] 用語、単位、時制、表記が統一されている
- [ ] 参考文献と原典URLがある
- [ ] 内部メモを成果物として案内していない
- [ ] Report Viewer 向けに `apps/report-viewer` を rebuild した

一つでも主要項目が欠けた場合、情報量を増やす前に構成と調査をやり直す。

## 10. よくある失敗

- 論文10本を一段落ずつ要約して終える。
- architectureを知りたい依頼に、benchmarkやmemoryの論文を中心選定する。
- 「引用数が多い」を理由に古い論文だけを選ぶ。
- 最新preprintを査読済み研究と同じ確度で扱う。
- platformの存在を、性能改善の因果的証拠として扱う。
- benchmarkのagent scoreを、runtime architectureの性能証拠にする。
- best-of-kの総予算比較を、単一agentの長時間耐久性と解釈する。
- event logがあることをdurable executionやdeterministic replayと同一視する。
- Docker利用を強いsecurity isolationの証明とみなす。
- 自分の設計提案を論文の結論として書く。
- 読者へ内部要件メモとレポートを並べて渡す。
- deep research を `knowledge/` に保存する。

## 11. 今回の失敗からの恒久ルール

- ユーザーが「何を知りたいか」を本文冒頭で分析する。
- 「〜についての論文」は、タイトルだけでなく本文の中心課題とarchitecture記述でscreeningする。
- deep researchでは、個別論文に「アーキテクチャ」「証明したこと」「証明していないこと」を必須化する。
- 設計提言は論文の寄せ集めではなく、根拠、適用条件、反証条件まで示す。
- 要件captureは内部作業であり、依頼されたレポートの代わりや第二の成果物にしない。
- 成果物は `reports/deep-research/` + 必須 frontmatter。プロジェクト固有メモは `knowledge/`。
