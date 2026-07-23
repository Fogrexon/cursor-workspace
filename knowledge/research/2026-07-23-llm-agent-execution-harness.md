# LLMエージェントを効率的・再現可能に動かす実行環境とハーネス

- 調査日: 2026-07-23
- 対象期間: 原則 2024-07-23〜2026-07-23
- 対象: LLMエージェントの実行環境、Agent-Computer Interface（ACI）、ワークフロー、推論予算、記憶、評価・診断

## エグゼクティブサマリー

10本の原論文から得られる最も重要な結論は、**高性能モデルを自由にループさせることは、効率的なエージェント実行の十分条件ではない**という点である。同一モデルでも、ハーネスの違いだけで成功率が大きく変わる。反対に、自律性を減らした固定パイプラインが、複雑なエージェントより安価で高性能になる場合もある。

整備すべきハーネスの中核は次の7点である。

1. **再現可能な隔離実行環境**: OCIコンテナまたはVM、状態スナップショット、依存関係固定、ネットワーク・秘密情報・CPU/GPU/時間の制限。
2. **小さく合成可能なACI**: terminal、Python、browser、file operationを基本とし、安定ID、構造化エラー、観測量制限、失敗後の回復を重視する。
3. **イベントソーシングされた実行制御**: action、observation、tool result、cost、artifact、checkpointを単一trace IDで追跡し、停止・再開・再実行できるようにする。
4. **固定DAGを既定とする段階的自律性**: まず検索→生成→検証の有限ワークフローを使い、必要なタスクだけ動的ループやマルチエージェントへ昇格する。
5. **難度適応型の予算配分**: 一律の反復回数を避け、cheap probeの結果に応じてモデル、トークン、探索幅、試行数、並列度を配分する。
6. **検証を中心にした状態評価**: 最終文面ではなく、DB・filesystem・test・UI・processの状態差分、部分進捗、副作用を採点する。検証を通らない成果を成功や記憶へ昇格させない。
7. **分層された記憶**: 生ログを正本として保持しつつ、作業文脈、fact memory、検証済みworkflow memoryを分離し、通常のプロンプトには必要部分だけを取得する。

## 調査方法と選定基準

### 選定

- 原論文本文と付録を優先して確認した。
- 2024-07-23以降の査読採択論文を基本とした。
- 次の2本は期間直前だが、後続研究の基準点であり、ハーネス設計への直接的な実験証拠が強いため例外採用した。
  - SWE-agent: 2024-05-06
  - Agentless: 2024-07-01
- 影響度は被引用数、査読会議、実験規模、後続ハーネスへの採用状況を併用した。
- arXivは公式閲覧数を公開していないため、「閲覧数」を推測値で補わなかった。

### 引用指標の注意

下表の引用数は Semantic Scholar を2026-07-23に照会した概数である。プレプリント版と会議版の重複、名寄せ、更新タイミングにより値は変動する。特にSWE-agentは会議版とプレプリント版が別レコード化されているため、単一の厳密値として扱わない。引用数は選定の優先度には使ったが、研究内容の正しさを保証する指標とはしていない。

## 選定した10本

| # | 論文 | 初版 / 採択 | 引用概数 | 主な設計論点 |
|---|------|-------------|---------:|--------------|
| 1 | [SWE-agent](https://arxiv.org/abs/2405.15793) | 2024-05 / NeurIPS 2024 | 1,000超のプレプリント系レコード、会議版は別集計 | ACI |
| 2 | [OpenHands](https://arxiv.org/abs/2407.16741) | 2024-07 / ICLR 2025 | 約830 | 汎用実行基盤 |
| 3 | [Agentless](https://arxiv.org/abs/2407.01489) | 2024-07 / FSE 2025 | 約430 | 固定パイプライン |
| 4 | [Scaling LLM Test-Time Compute Optimally](https://arxiv.org/abs/2408.03314) | 2024-08 / ICLR 2025 Oral | 約1,530 | 適応予算 |
| 5 | [MLE-bench](https://arxiv.org/abs/2410.07095) | 2024-10 / ICLR 2025 | 約300 | scaffold比較、長時間実行 |
| 6 | [AFlow](https://arxiv.org/abs/2410.10762) | 2024-10 / ICLR 2025 Oral | 約175 | workflow最適化 |
| 7 | [RE-Bench](https://arxiv.org/abs/2411.15114) | 2024-11 / ICML 2025 Spotlight | 約110 | 長期実行、資源管理 |
| 8 | [BrowserGym](https://arxiv.org/abs/2412.05467) | 2024-12 / TMLR 2025 | 約130 | 共通環境・実験管理 |
| 9 | [A-MEM](https://arxiv.org/abs/2502.12110) | 2025-02 / NeurIPS 2025 | 約750 | 長期記憶、context効率 |
| 10 | [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657) | 2025-03 / NeurIPS 2025 Spotlight | 約470 | MAS失敗診断 |

## 各論文の分析

### 1. SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering

**提案。** 人間向けCLIをそのままLLMへ渡すのではなく、LLMを独立したエンドユーザーとして捉え、専用のACIを設計する。リポジトリ探索、ファイル表示・編集、テスト実行を、出力量が制御されたコマンドとして提供する。編集後のlint失敗は変更を戻し、具体的なエラーと周辺コードを次の観測として返す。

**主要結果。** GPT-4 TurboでSWE-bench全体12.47%、Lite 18.0%、HumanEvalFix 87.7%。同一モデルのshell-only構成に対して、専用ACIがSWE-benchで64%の相対改善を示した。これは「モデル能力」だけでなく、観測・行動契約が成績を左右する直接的な証拠である。

**ハーネスへの意味。**

- ツール数より、ツールの出力境界、明示的な空出力、エラー形式、可逆性が重要。
- 長大なファイルや検索結果をそのままcontextへ入れず、ページング・範囲表示・結果上限を標準化する。
- 構文エラー等の安価で決定的な検証は、action直後のguardrailとして実行する。

**限界。** 主にPythonのソフトウェア修正で評価され、Web、GUI、業務APIへそのまま一般化できるとは限らない。ACIの効果とプロンプト等の共変量を完全に分離した研究でもない。

### 2. OpenHands: An Open Platform for AI Software Developers as Generalist Agents

**提案。** agent、runtime、UI、evaluationをイベントストリームで結合する汎用基盤。各セッションにDocker sandboxを起動し、bash、IPython、Playwright/Chromiumを、少数の汎用actionとして提供する。stateにはaction/observation履歴だけでなく、累積費用、delegation metadata等も含める。

**主要結果。** 同一のCodeAct系エージェントを大きく作り替えず、software、web、general assistanceを含む15ベンチマークで評価可能にした。論文時点のSWE-bench LiteではOpenHandsが26.0%前後の競争力ある成績を示す一方、特化型手法が上回るタスクもあり、汎用性と最高性能のトレードオフも明確だった。

**ハーネスへの意味。**

- runtimeとagent policyを分離し、任意のcontainer imageへ共通action serverを注入する。
- すべてのaction/observationを追記型event streamにして、UI、評価器、人間介入、再開処理が同じ記録を参照する。
- bash、Python、browserのような合成可能なprimitiveを中核にし、特殊toolはadapterとして追加する。

**限界。** プラットフォーム論文であり、個々の設計要素の厳密なablationは限定的。Dockerは強い隔離境界ではなく、敵対的コードを扱う本番環境ではmicroVM等が必要になる。

### 3. Agentless: Demystifying LLM-Based Software Engineering Agents

**提案。** 自由なtool loopを使わず、(1) 階層的な障害箇所特定、(2) 複数patch候補生成、(3) 再現テストと回帰テストによる候補選択、という固定3段パイプラインを採用する。

**主要結果。** SWE-bench Liteで96/300、32.0%を解決し、当時の複雑なオープンソースagentを上回った。候補生成を並列化し、最終選択をテストへ委ねることで、自由な反復による誤tool利用や費用浪費を抑えた。

**ハーネスへの意味。**

- 「agent loop」を既定にしない。構造化できる仕事は有限DAGに落とす。
- 各段階の入力、出力、候補数、予算、検証器を独立に設定し、stage単位で再実行する。
- 多様性は複数agentの会話ではなく、独立候補の並列生成でも得られる。

**限界。** software repair特化であり、ユーザーとの対話や環境変化が必要なタスクには固定DAGだけでは不足する。候補samplingとテスト生成の費用は残る。

### 4. Scaling LLM Test-Time Compute Optimally Can Be More Effective than Scaling Parameters for Reasoning

**提案。** 全queryへ同じ推論量を与えず、問題難度に応じてBest-of-N、逐次revision、PRM探索の計算量を適応配分するcompute-optimal policy。

**主要結果。** MATHを中心とする評価で、Best-of-Nと同等以上の性能を約4分の1のtest-time computeで達成する条件を示した。FLOPsを揃えると、問題によっては小型モデルが14倍大きいモデルを上回った。

**ハーネスへの意味。**

- request受付時にcheap probeを実行し、難度・不確実性・検証可能性を推定する。
- `max_tokens`だけでなく、候補数、revision回数、tool call、wall-clock、FLOPsまたは推定費用を予算化する。
- 最難問へ無制限に計算を足しても利益が飽和するため、打切りと上位モデルへのrouteを分ける。

**限界。** 数学推論と専用verifierが中心で、長期の環境操作agentへ効果量を直接移せない。実運用では難度推定自体の誤差と費用が追加される。

### 5. MLE-bench: Evaluating Machine Learning Agents on Machine Learning Engineering

**提案。** 75件のKaggle競技をオフライン実行環境として再構成し、データ準備、訓練、評価、提出までを最大24時間動かすagentを評価する。同じモデルをAIDE、MLAB、OpenHandsの異なるscaffoldで比較した。

**主要結果。** o1-preview+AIDEは16.9%の競技で銅メダル以上、pass@8で34.1%。GPT-4o固定ではAIDE 8.7%、OpenHands 4.4%、MLAB 0.8%であり、モデルが同じでもscaffoldに大差が出た。24時間から100時間へ延ばした際の改善は8.7%から11.8%に留まり、単純な時間増加の逓減も示した。

**ハーネスへの意味。**

- domain-specific scaffoldをplug-in可能にし、汎用scaffoldと同条件で比較する。
- 長時間runではbest artifactの保持、submission事前検証、heartbeat、checkpoint、停止規則が必要。
- pass@1だけでなく、独立試行のpass@kと総資源を同時に報告する。

**限界。** Kaggle特有の評価と既知手法に寄る。競技データや公開notebookの学習汚染を完全には排除できない。

### 6. AFlow: Automating Agentic Workflow Generation

**提案。** LLM呼出しnodeとcode edgeからなるworkflowを探索対象とし、MCTS、実行feedback、過去の変更履歴を使って自動最適化する。

**主要結果。** QA、code、mathの6ベンチマークで手設計workflowを平均5.7ポイント、既存の自動最適化を19.5ポイント上回った。特定タスクでは最適化した小型モデルworkflowがGPT-4oを4.55%の推論費用で上回った。

**ハーネスへの意味。**

- workflowをコードまたは宣言的DAGとしてversion管理し、promptとmodelだけでなく構造も実験対象にする。
- 探索はvalidation環境でoffline実施し、本番では承認済みDAGを固定実行する。
- optimizerの探索費と、選定workflowの本番費を分けて測る。

**限界。** 明確な自動評価関数と代表的validation setが必要。探索中は同じ候補を複数回評価するため高価で、onlineで毎回動かす用途には向かない。

### 7. RE-Bench: Evaluating Frontier AI R&D Capabilities of Language Model Agents against Human Experts

**提案。** GPUを含む7つのopen-ended ML research engineering環境で、エージェントと専門家に同じ壁時計・計算資源予算を与え、2/8/32時間で比較する。

**主要結果。** 2時間総予算では最高agentが人間の約4倍だが、8時間では人間が僅かに上回り、32時間では人間が約2倍。agentは案の生成と実験を10倍以上速く行う一方、長期では誤仮説、矛盾の見落とし、GPU memory不足、zombie process、timeoutが蓄積した。

**ハーネスへの意味。**

- token数だけでなく、wall-clock、GPU、VRAM、process、並列試行数を資源台帳で管理する。
- process supervisor、lease、heartbeat、timeout、子process回収をruntimeの責務にする。
- 最終scoreだけでなく、score-vs-time、best checkpoint、退行時点を保存する。

**限界。** 7環境と高価なhardwareに限定され、統計力と追試容易性に制約がある。best-of-kと単一長時間runは能力が異なるため、混同してはならない。

### 8. The BrowserGym Ecosystem for Web Agent Research

**提案。** 6種のWeb benchmarkをGym形式の共通action/observation契約へ統合するBrowserGymと、並列実験、設定、trace、費用、再現性を管理するAgentLabを提供する。DOM、AXTree、screenshot、bounding box、安定element IDを選択可能な観測として扱う。

**主要結果。** 共通設定で6モデルを比較し、WorkArena L2ではClaude 3.5 Sonnet 39.1%、GPT-4o 8.5%と大差が出た。hidden elementへのclick等の例外はrunを壊さず、次の観測の`last_action_error`として返す設計を採用する。

**ハーネスへの意味。**

- agent controllerとenvironment adapterを分離し、benchmarkごとの差をadapterへ閉じ込める。
- observation modality自体を設定・計測対象にし、DOM/AXTree/imageを無条件に全投入しない。
- backend reset、seed、browser/OS/locale/timezone、依存versionをRunSpecへ固定する。

**限界。** live Webには広告、地域、時刻、サイト変更による非決定性が残る。Web UIの知見をAPI-onlyやコード環境へそのまま適用できない。

### 9. A-MEM: Agentic Memory for LLM Agents

**提案。** Zettelkastenに着想を得て、会話・経験をcontext、keyword、tag、linkを持つnoteへ変換し、新規記憶に応じて既存記憶のlinkと内容を更新する。推論時はtop-kだけ取得する。

**主要結果。** LoCoMoで、GPT-4o利用時の入力長は全履歴系約16,900 tokensに対し約1,216 tokens。論文はmemory operation当たり約1,200 tokens、85〜93%削減、商用APIで0.0003ドル未満と報告する。DialSim F1は3.45で、LoCoMo方式の2.55を35%上回った。

**ハーネスへの意味。**

- raw traceを直接memoryとせず、fact、procedure、artifact referenceへ抽出する。
- retrievalはtop-kとし、全履歴投入はfallbackに限定する。
- memoryの作成・変更・link追加を監査可能にし、非同期更新でcritical pathから外す。

**限界。** 長期会話QAが中心で、コード変更やツール実行の正しさを測った研究ではない。記憶抽出の誤りが永続化する危険があるため、agent実行では検証済み情報だけを昇格させる必要がある。

### 10. Why Do Multi-Agent LLM Systems Fail?

**提案。** 7種のmulti-agent system（MAS）から1,642 traceを収集し、14 failure modeをsystem design、inter-agent misalignment、task verificationの3群へ整理したMASTを提案する。

**主要結果。** 人手annotationの一致度はCohen's κ=0.88。few-shot LLM judgeは人手に対してaccuracy 94%、κ=0.77。調査対象MASの失敗率は41〜86.7%で、単純なsingle-agentやBest-of-Nに対する改善が小さい例も多い。MASTに基づくworkflow修正で成功率が9.4ポイント改善したcase studyも示した。

**ハーネスへの意味。**

- multi-agent化の前に、single-agent、固定DAG、Best-of-Nのbaselineを必須にする。
- agent間messageをtraceの第一級eventとし、役割逸脱、情報隠蔽、無限反復、未検証終了を自動検出する。
- 全結合broadcastを避け、delegation契約に入力、期待出力、deadline、完了条件を持たせる。

**限界。** failure taxonomyと診断データが中心であり、汎用的な効率改善アルゴリズムを直接証明した論文ではない。LLM judge依存と、対象frameworkの偏りがある。

## 横断分析

### 研究から直接支持される判断

1. **ハーネスはモデルと同等に重要。** SWE-agentのACI ablationとMLE-benchのscaffold比較が直接証拠である。
2. **自律性は少ないほどよい場合がある。** Agentlessは、検証可能な修正タスクでは固定DAGが自由なloopを上回り得ることを示す。
3. **計算量は要求ごとに変えるべき。** test-time compute研究は、一律Best-of-Nより難度適応配分が効率的であることを示す。
4. **長時間化だけでは改善しない。** MLE-benchとRE-Benchでは、時間を増やしたときの逓減、process・GPU管理失敗、仮説の固着が確認された。
5. **全履歴投入は高価で不要。** A-MEMは選択的取得で大幅なtoken削減を示す。ただし、agent actionの記憶には検証gateを追加すべきである。
6. **multi-agentは既定解ではない。** MAS研究は、調整・伝達・検証の新しい失敗面が追加されることを示す。
7. **再現性はadapterとmanifestの問題。** BrowserGymとOpenHandsは、agent policyとruntime/environmentを分離する実装パターンを示す。

### 研究だけではまだ確定しない点

- コーディング、Web、ML研究、長期会話の結果を、単一の万能ハーネスへ完全に一般化できるか。
- memoryの自動更新が、長期の現実タスクで誤情報をどの程度蓄積するか。
- workflow optimizerが頻繁に分布変化する本番タスクでも探索費を回収できるか。
- multi-agentが明確にsingle-agentを上回るタスクを、実行前に安価に判定できるか。

したがって、以下の提言は「すべてを最初から有効化する」のではなく、計測可能な層として実装し、baselineとの比較で昇格させる設計を採る。

## 推奨するエージェント実行ハーネス

### 1. 不変なRunSpec

各run開始時に、次をimmutable manifestとして保存する。

```yaml
run:
  task_id: ...
  trace_id: ...
  agent_commit: ...
  workflow_version: ...
model:
  provider: ...
  model: ...
  api_version: ...
  decoding: ...
environment:
  image_digest: ...
  os_browser_locale_timezone: ...
  dependency_lock_digest: ...
  snapshot_id: ...
policy:
  tool_allowlist: ...
  network_policy: ...
  secret_scopes: ...
budget:
  input_tokens: ...
  output_tokens: ...
  tool_calls: ...
  wall_seconds: ...
  cost_usd: ...
  cpu_gpu_memory: ...
evaluation:
  grader_version: ...
  seed: ...
  repetitions: ...
```

これにより、「モデルが変わった」「環境が変わった」「scaffoldが変わった」を分離できる。

### 2. Control planeとExecution planeの分離

**Control plane**

- workflow/state machine
- budget allocator
- model router
- approval policy
- event store
- scheduler/checkpoint manager
- evaluator

**Execution plane**

- task単位のcontainerまたはmicroVM
- terminal、Python、browser、domain API adapter
- filesystem/DB/service snapshot
- resource/process supervisor
- network egress proxy
- scoped secret broker

敵対的または未知のコードを実行する場合、Docker単独をセキュリティ境界とみなさず、microVM、rootless runtime、read-only base、短命credentialを組み合わせる。

### 3. 共通Event Schema

少なくとも以下を追記型で保存する。

- `run.started / run.paused / run.resumed / run.ended`
- `model.request / model.response`
- `action.proposed / action.approved / action.executed`
- `observation.created`
- `tool.error / policy.denied / budget.exceeded`
- `artifact.created / checkpoint.saved`
- `grader.result`
- `memory.proposed / memory.verified / memory.promoted`
- `delegation.started / delegation.completed`

各eventにはtimestamp、parent event、actor、token、cost、latency、environment state hash、artifact referenceを付ける。生ログは正本とし、要約は派生物として再生成可能にする。

### 4. ACIの標準

- 基本primitiveは`terminal`、`python`、`browser`、`file`、`domain_api`。
- 大きな出力は自動的にartifact化し、モデルへは要約、先頭・末尾、取得handleだけを返す。
- file表示、検索、DOM/AXTreeは範囲・件数・token上限を必須にする。
- element、file span、process、artifactに安定IDを付ける。
- エラーを例外終了ではなく構造化observationとして返し、再試行可能性を明示する。
- 構文検査、schema検査、dry-run等の安価なguardrailをaction直後に実行する。
- 破壊的action、外部送信、課金、権限変更はrisk tierに応じて承認を要求する。

### 5. 段階的な実行戦略

```text
Tier 0: deterministic code / direct tool call
Tier 1: fixed single-agent DAG
Tier 2: bounded agent loop
Tier 3: Best-of-N / verifier-guided search
Tier 4: explicit delegation / multi-agent
```

上位tierへ進む条件は、下位tierの失敗、推定難度、期待価値、残予算、検証可能性で決める。multi-agentは「役割が異なる」「並列化利益がある」「受渡しを検証できる」の3条件が揃う場合だけ使う。

### 6. 予算allocator

受付時のcheap probeで、要求を最低でも次の軸で分類する。

- 既知手順か、探索が必要か
- 成果を決定的に検証できるか
- actionの危険度と可逆性
- context量
- 推定難度
- 失敗時の損失

分類結果に応じて、model、reasoning budget、candidate数、tool回数、wall-clock、並列度を設定する。hard limitだけでなくsoft limitを持ち、soft limit到達時に「検証して終了」「checkpointして上位modelへroute」「人間へescalate」を選ぶ。

### 7. ContextとMemoryの分層

1. **Raw event log**: 完全・追記型・通常promptへは入れない。
2. **Working context**: 現runの直近action、未解決事項、artifact index。
3. **Fact memory**: 出典、時刻、scope、confidenceを持つ事実。
4. **Workflow memory**: 前提条件、手順、終了条件、過去成功率を持つ再利用可能procedure。
5. **Artifact store**: ファイル、画像、テスト結果、長大出力。

memoryへの昇格条件は、grader通過、出典保持、scope明示、失効条件設定である。agentが自己申告した「成功」を根拠に昇格させない。

### 8. Verification-first評価

- 最終自然言語ではなく、環境の前後状態を比較する。
- `goal reached`、`milestone`、`forbidden side effect`、`regression`を別々に採点する。
- oracle解が通る、no-opが落ちる、既知誤答が落ちることをgrader CIで確認する。
- 複数seed・複数trialを実行し、平均だけでなくpass@k、全k回成功する信頼性、95% CIを出す。
- `agent / model API / environment / task spec / grader / user simulator`の失敗を区別する。
- static benchmarkだけでなく、時系列で新しいprivate taskを保持し、task日時、model cutoff、ネットワークアクセスを記録する。

### 9. 必須メトリクス

品質指標と資源指標を同じtraceへ結合する。

- task success、partial score、regression、副作用
- input/output/retrieved tokens
- model call、tool call、retry、invalid action
- wall-clock、model latency、tool latency、queue time
- API費用、CPU/GPU時間、peak memory/VRAM
- checkpoint数、best score到達時刻、score-vs-time
- context圧縮率、memory hit率、memory採用後の改善/悪化
- delegation数、message token、agent別寄与
- failure taxonomy

最適化目標は成功率単独ではなく、たとえば `verified_success / cost`、`verified_success / wall-clock`、制約付きPareto frontとして扱う。

## 整備の優先順位

### P0: 信頼できる土台

- immutable RunSpec
- sandbox + resource/process/network/secret policy
- 共通event logとartifact store
- timeout、cancel、checkpoint、resume
- 状態ベースgraderとgrader CI
- token/cost/latency/tool call計測

### P1: 効率の基準線

- fixed single-agent DAG
- bounded observationと構造化errorを持つACI
- verification gate
- Best-of-Nを含むbaseline suite
- 失敗主体とMAST系failure modeの分類

### P2: 適応化

- difficulty probeとbudget/model router
- working-context compaction
- 検証済みfact/workflow memory
- score-vs-timeによる早期停止・退行検知

### P3: 高度な探索

- offline workflow optimization
- domain-specific scaffold plug-in
- contributionが測れる限定的multi-agent delegation
- live/private taskによる継続評価

順序が重要である。P0の再現性と評価がないままP2/P3を導入すると、改善がモデル、prompt、環境、偶然のどれによるものか判別できない。

## 実装判断のチェックリスト

- [ ] 同じRunSpecから環境をresetして再実行できる
- [ ] agentのactionとenvironmentのobservationを完全に追跡できる
- [ ] task失敗とinfra/grader失敗を分離できる
- [ ] 全toolにtimeout、出力上限、権限、構造化errorがある
- [ ] 予算超過時に安全にcheckpoint・停止できる
- [ ] 最終成果を独立graderで検証している
- [ ] fixed DAGとsingle-agent baselineを上回る証拠なしにMASを使っていない
- [ ] memoryは出典、scope、検証状態、失効条件を持つ
- [ ] model、workflow、environment、graderのversionを別々に固定している
- [ ] 成功率だけでなく、費用、時間、信頼性、副作用を報告している

## 結論

推奨するのは「万能agent framework」ではなく、**再現可能なruntime、明確なACI、追記型event log、検証中心の固定workflow、適応予算、検証済みmemoryを疎結合にした実験・運用基盤**である。

最初に作るべきものはmulti-agent orchestrationではない。まず、同一taskを同一環境で再実行でき、どのactionがいくらかかり、何を壊し、どのgraderを通ったかを説明できる基盤を作る。その上で、固定DAGより動的loopが有利か、single-agentよりMASが有利か、全履歴よりmemoryが有利かを、task群ごとに測って昇格させる。この順序が、10本の研究を通じて最も一貫して支持される実装方針である。

## 補助的に参照した原論文

選定10本には含めなかったが、評価ハーネスの具体化に有用な原論文。

- [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045) — 終了時DB状態と反復信頼性
- [ToolSandbox](https://arxiv.org/abs/2408.04682) — milestone、minefield、stateful tool-use
- [AppWorld](https://arxiv.org/abs/2407.18901) — reset可能な合成app/API世界と副作用評価
- [SWE-rebench](https://arxiv.org/abs/2505.20411) — 継続収集と時系列decontamination
- [Terminal-Bench 2.0](https://arxiv.org/abs/2601.11868) — container task、oracle/no-op検証、反復試行
