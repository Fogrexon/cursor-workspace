(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`# LLMエージェント実行基盤アーキテクチャ調査

## 最新研究10本から導く、実装・評価・運用ハーネスの参照設計

| 項目 | 内容 |
|---|---|
| 調査日 | 2026-07-23 |
| 主対象期間 | 2024-07-23〜2026-07-23 |
| 期間外例外 | 後続の実行基盤設計を規定した基準論文2本 |
| 対象 | agent runtime、harness、ACI、scheduler、sandbox、checkpoint、evaluation infrastructure |
| 想定読者 | エージェント開発基盤の設計・投資・技術選定を行う人 |
| 成果物 | 本書一冊。内部要件メモは成果物に含めない |

---

## 0. このレポートが答える問い

### 0.1 読者が本当に知りたいこと

この調査の目的は、LLMエージェント研究を広く知ることではない。読者が知りたいのは、**エージェントを効率的かつ再現可能に開発・評価・運用するために、どのような実行基盤を実際に整備すべきか**である。

その判断を、次の問いへ分解した。

1. モデルの外側に、どのcomponentと責務を置くべきか。
2. agent、harness、model、tool、sandbox、evaluatorをどの境界で分離すべきか。
3. 一つのtaskを動かす制御フローと状態機械はどうあるべきか。
4. 多数のagent workflowを動かすschedulerは、個別LLM requestではなく何を単位に管理すべきか。
5. 長時間実行や分岐探索で、conversation、filesystem、process stateをどう保存・復旧すべきか。
6. ACIとtool contractをどう設計すれば、context浪費と誤操作を減らせるか。
7. harnessの改善とmodelの改善を、どう分離して評価すべきか。
8. 何を最初に作り、何を後回しにし、何を作らないべきか。
9. 自社で保持すべきcontrol pointと、外部製品を利用できる部分はどこか。
10. どのKPIと導入gateを満たせば、本番で権限を拡大してよいか。

### 0.2 本書でいう「実行基盤アーキテクチャ」

本書では、次のうち複数を具体的に記述する研究を主対象とする。

- componentと責務
- control flow / data flow
- state、memory、artifactの境界
- action / observation / tool contract
- concurrency、scheduling、resource management
- isolation、sandbox、authority boundary
- timeout、retry、checkpoint、rollback、recovery
- trace、cost、evaluation、reproducibility

単にagentの成功率を測るbenchmark、memory手法だけの研究、数学推論だけのtest-time compute研究は、重要でも主要10本には入れない。

### 0.3 「効率」の定義

成功率だけを効率とは呼ばない。本書では次を同時に扱う。

\`\`\`text
verified quality
÷
{ API cost, token, wall-clock, GPU, CPU, memory, storage,
  human effort, failure/recovery cost, unsafe side effect }
\`\`\`

### 0.4 用語と表記

| 用語 | 本書での意味 |
|---|---|
| agent（エージェント） | model callとtool/environment interactionを組み合わせた実行process |
| harness（ハーネス） | context、workflow、tool、state、retry、verification、stopを組み立てる外部実行system |
| runtime（ランタイム） | harnessの指示を実行し、model、tool、resource、state transitionを管理する機構 |
| ACI | Agent-Computer Interface。agent向けのaction / observation契約 |
| sandbox | agent actionを隔離して実行するcontainerまたはVM |
| checkpoint / restore | ある時点のstateを保存し、そこへ復元すること |
| scaffold | modelの周囲のprompt、loop、tool、memory等を組み合わせたagent構成。HALの用語に合わせる |
| Semantic Scholar | 被引用指標の参照に用いた学術索引。本文では略号S2を使わない |
| plane（機能面） | 同種の責務をまとめたarchitecture上の区分。network planeを意味しない |

本書には英語のAPI名と論文固有語が多いため、一般概念は初出で日本語説明を付け、schema fieldや原論文用語は英語を保持する。

### 0.5 前提と対象外

- coding、Web、research、enterprise tool-useを載せられる共通基盤を想定する。
- 特定cloud、model provider、agent frameworkへの固定は前提にしない。
- model training architectureそのものは対象外とする。
- 本書は2026年7月時点の研究を基にする。2026年のpreprintは有望性を示すが、査読済み研究と同じ確度では扱わない。

---

## 1. 意思決定サマリー

### 1.1 結論

整備すべきものは「巨大なmulti-agent framework」ではない。推奨するのは、次の五つのplaneを持つ実行基盤である。

1. **Specification plane**
   task、harness policy、model、tool、環境、予算、権限、評価条件をversion付きRunSpecにする。

2. **Control plane**
   durable orchestrator、state machine、budget manager、policy/approval、workflow-level schedulerを置く。

3. **Execution plane**
   model gateway、typed tool gateway、短命sandbox/browser、resource supervisorを置く。

4. **State and evidence plane**
   append-only event、artifact、checkpoint、environment state、verification resultを分離保存する。

5. **Evaluation plane**
   model × harness × environment × benchmarkを独立componentとして比較し、agentとは別権限で採点する。

### 1.2 参照アーキテクチャ

\`\`\`mermaid
flowchart TB
    U[User / Task API] --> RS[RunSpec Validator]
    RS --> PC[Policy Compiler]
    RS --> OR[Durable Orchestrator]

    subgraph Control Plane
      OR --> WA[Workflow-level Scheduler]
      OR --> BM[Budget Manager]
      OR --> AP[Approval Service]
      OR --> CB[Context Builder]
    end

    subgraph Execution Plane
      WA --> MG[Model Gateway]
      WA --> TG[Typed Tool Gateway]
      TG --> SB[Sandbox / Browser Pool]
      SB --> PS[Process and Resource Supervisor]
    end

    subgraph State and Evidence Plane
      ES[(Append-only Event Store)]
      AS[(Artifact Store)]
      CS[(Checkpoint Store)]
      MS[(Scoped Memory)]
    end

    subgraph Evaluation Plane
      EV[Independent Verifier]
      ER[Evaluation Runner]
      AN[Trajectory Analyzer]
    end

    OR <--> ES
    CB <--> MS
    SB <--> AS
    SB <--> CS
    OR --> EV
    EV --> ES
    ER --> EV
    ES --> AN
\`\`\`

### 1.3 最初に作るもの

| 優先 | 機能 | 判断 |
|---|---|---|
| P0 | RunSpec、run state machine、event log | 必須 |
| P0 | typed tool gateway、side-effect分類、hard budget | 必須 |
| P0 | task単位sandbox、network/secret/resource policy | 必須 |
| P0 | 独立verifier、artifact、状態ベース評価 | 必須 |
| P1 | bounded ACI、structured error、transactional edit | 必須 |
| P1 | model × harness × environmentの評価分離 | 必須 |
| P1 | process supervisor、timeout、cancel、best artifact保持 | 必須 |
| P2 | workflow-aware scheduling、KV/tool lifecycle管理 | 負荷が増えたら導入 |
| P2 | conversation + filesystem + process checkpoint | 長時間runで導入 |
| P2 | declarative harness policy | harnessが増えたら導入 |
| P3 | 高頻度rollback substrate | tree search / RLで導入 |

### 1.4 最初は作らないもの

- 自由に再帰spawnするagent swarm
- 全agentが全tool、全secret、全memoryを共有する構成
- self-declared completionだけで成功とする構成
- 生のshell、URL、SQLを無制限に実行するtool
- conversationだけを保存して「checkpoint」と呼ぶ機能
- 全turnのfull VM snapshot
- online本番trafficで自己変更するharness
- 一つの公開benchmarkだけを最適化するrouter
- LLM-as-a-judge単独のrelease gate

### 1.5 強い根拠と未成熟な部分

| 判断 | 根拠強度 | 理由 |
|---|---|---|
| ACIの出力量・error・edit transactionが重要 | E2 | SWE-agentのablation。BrowserGymは実装例 |
| agent / runtime / evaluatorの分離 | E2 | OpenHands、BrowserGym、HALの実装・大規模運用 |
| request単位でなくworkflow単位で資源管理 | E2 | ThunderAgentの直接評価。AIOSはsyscall単位 |
| conversationだけでは完全復旧できない | E2 | Crabのfault-injection評価 |
| 高頻度探索には差分checkpointが有効 | E2 | DeltaBox。2026 preprint |
| harness policyの外部化 | E2 | NLAH。2026 preprint |
| multi-agentを既定にする | 支持なし | Magentic-Oneは用途例であり、一般優位を証明しない |
| microVMが全用途で必須 | 支持なし | threat modelとworkloadによる |

E1は複数研究、E2は単一または限定領域の直接証拠、E3は合理的外挿、Pは実務原則、Hは検証仮説を表す。

---

## 2. 調査方法

### 2.1 検索方針

2026-07-23時点で、次の概念を組み合わせて原論文を探索した。

- LLM agent runtime / execution architecture
- agent operating system / scheduler
- agent harness / scaffold architecture
- agent sandbox / checkpoint / rollback
- agent evaluation infrastructure
- event-driven / durable agent execution
- agent-computer interface
- program-aware agent serving

検索先はarXiv、OpenReview、会議proceedings、著者・研究機関の公式publication page、原論文が参照する公式repositoryである。

### 2.2 Screening

38候補を次の順でscreeningした。候補数と分類は、下記criteriaを使った本調査者のjudgment-based screeningであり、bibliometric databaseから自動生成した系統レビューではない。全候補と除外理由は付録Aに示す。

\`\`\`text
候補38
├─ architectureが中心でない: 12
├─ survey・仕様書・二次資料: 5
├─ 単一moduleでruntime全体を扱わない: 6
├─ architecture記述または実験が弱い: 5
└─ 主要10本
\`\`\`

### 2.3 Inclusion criteria

以下のうち四つ以上を満たすことを原則とした。

1. architectureが論文の主要貢献である。
2. componentとcontrol flowが明示される。
3. stateまたはenvironment境界が明示される。
4. failure、scheduling、isolation、evaluationの少なくとも一つを扱う。
5. 実装またはcodeが公開される。
6. 定量評価、ablation、fault injectionのいずれかがある。
7. 査読採択、被引用、利用規模、最新性のいずれかが強い。

### 2.4 最新性と影響度の両立

引用数だけで選ぶと2026年のsystems研究を落とす。一方、最新性だけで選ぶと未検証preprintに偏る。そのため、10本を二群に分けた。

- **影響力アンカー 5本**: 査読・被引用・後続利用が蓄積した基盤設計。
- **frontier architecture 5本**: 2025後半〜2026に登場し、実行基盤の未解決問題を直接扱う研究。

### 2.5 引用数の注意

被引用数には「公式な唯一の値」がない。Semantic ScholarではarXiv版と会議版の統合状態により、SWE-agentのように同一論文へ大きく異なるrecordが存在する。OpenAlexも会議版とpreprint版を分離する場合がある。引用指標は2026-07-23 UTC取得で、取得recordを付録Bに示す。

本書では、厳密な順位付けより次を優先した。

- 取得元と取得日を明記する。
- record重複を合算しない。
- 2026年論文は「引用未蓄積」と明記する。
- arXivが公開しない閲覧数を推定しない。

### 2.6 選定した10本

| # | 論文 | 年・位置づけ | architecture中心性 | 影響指標の扱い |
|---|---|---|---:|---|
| 1 | SWE-agent | NeurIPS 2024 | 3/3 | 高被引用、期間前基準 |
| 2 | AIOS | COLM 2025 | 3/3 | 影響度: 中〜高。期間前基準 |
| 3 | OpenHands | ICLR 2025 | 3/3 | 影響度: 非常に高い。被引用・OSS利用とも大 |
| 4 | BrowserGym | TMLR 2025 | 3/3 | 影響度: 高い。複数Web benchmarkへ統合 |
| 5 | Magentic-One | MSR Technical Report 2024 | 3/3 | 影響度: 高い。未査読 |
| 6 | Holistic Agent Leaderboard | ICLR 2026 | 3/3 | 査読済み、21,730 rollouts |
| 7 | ThunderAgent | ICML 2026 | 3/3 | 査読済み、引用は未蓄積 |
| 8 | Crab | arXiv 2026 | 3/3 | 引用未蓄積、fault injection |
| 9 | DeltaBox | arXiv 2026 | 3/3 | 引用未蓄積、OS substrate |
| 10 | Natural-Language Agent Harnesses | arXiv 2026 | 3/3 | 引用未蓄積、harness直接研究 |

### 2.7 主要な落選候補

| 候補 | 扱い | 理由 |
|---|---|---|
| Agentless | 補助証拠 | 固定pipeline設計として重要だがruntime全体ではない |
| AFlow | 補助証拠 | offline workflow optimizerであり実行substrateではない |
| MLE-bench | 補助証拠 | scaffold差を示すがarchitecture自体が主研究対象ではない |
| RE-Bench | 補助証拠 | 長時間失敗分析は重要だがruntime architecture論文ではない |
| A-MEM | 補助証拠 | memory moduleに限定される |
| Why Do Multi-Agent LLM Systems Fail? | 補助証拠 | taxonomyであり新規runtime提案ではない |
| Scaling Test-Time Compute Optimally | 補助証拠 | compute policyでありagent execution substrateではない |
| ToolSandbox | 補助証拠 | stateful evaluationには重要だが主にbenchmark |
| Terminal-Bench 2.0 | 補助証拠 | Harborは重要だが論文の中心はtask setとagent比較 |
| AgentCompass | watch list | 2026-07公開直後。評価infraとして有望だが実証蓄積前 |
| AutoGen v0.4 | 公式実装資料 | actor architectureの査読論文がないため主要論文から除外 |

この選定変更により、前稿のMLE-bench、RE-Bench、A-MEM、test-time compute、MAS failure taxonomyは主要10本から外れた。いずれも有用だが、今回の読者が求める「実行基盤アーキテクチャ」を直接説明する論文ではなかったためである。

---

## 3. 論文別アーキテクチャ分析

## 3.1 SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering

### 書誌と選定理由

- John Yang et al.
- NeurIPS 2024
- 初版: 2024-05-06
- 原典: [arXiv:2405.15793](https://arxiv.org/abs/2405.15793)
- 会議版: [NeurIPS Proceedings](https://papers.nips.cc/paper_files/paper/2024/hash/5a7c947568c1b1328ccc5230172e1e7c-Abstract-Conference.html)
- 選定理由: agentとcomputerの境界をarchitectureの主題にし、ACI componentをablationした基準論文。

### 解こうとした問題

人間向けshellをそのままLMへ渡すと、表示量、検索、編集、error feedbackがLMの能力と合わない。モデルを変更せず、interface設計だけでsoftware taskの成功率を改善できるかを問う。

### 提案アーキテクチャ

\`\`\`text
Issue
  ↓
LM Agent / ReAct controller
  ↓ thought + one command
Parser
  ↓ validated action
Agent-Computer Interface
  ├─ file viewer
  ├─ summarized search
  ├─ transactional editor + lint
  └─ shell/test
  ↓
Docker repository environment
  ↓ observation
History processor
  ↓ bounded context
LM Agent
\`\`\`

実装は\`agent\`、\`environment\`、\`logging\`の三moduleに分かれる。ACIはYAMLでprompt、command、parser、history processor、environment variableを宣言する。

### Action / observation contract

- 一turn一command。
- file viewerは100行window。
- searchは最大50件。多すぎる場合、巨大出力を返さずquery refinementを求める。
- stdoutが空でも、成功して出力がないことを明示する。
- malformed actionは再生成させる。
- edit actionは適用後にselective lintを行い、新たなlint errorを導入したinvalid editを破棄する。
- invalid edit時はbefore/after、error、周辺codeを返して再編集を求める。
- 推論用contextでは古いobservationを圧縮するが、完全trajectoryはlogへ残す。

### State、failure、evaluation

- environment state: filesystem、cwd、process。
- ACI state: current file、line、search result index。
- controller state: 圧縮されたmessage history。
- 最終成果: agentの完了文ではなくrepository diff。
- evaluator: agentから分離したSWE-bench hidden tests。
- 1 instance当たり$4で停止し、残存patchを提出する。

### 実験と効果

GPT-4 TurboはSWE-bench全2,294件で12.47%、Liteで18.0%。Shell-only 11.0%に対し、専用ACIは18.0%で相対64%改善した。

主要ablation（Table 3）:

| 変更 | Lite成功率 |
|---|---:|
| 完全ACI | 18.0% |
| lintなし | 15.0% |
| 専用editなし | 10.3% |
| summarized search | 18.0% |
| interactive search | 12.0% |
| viewer 100行 | 18.0% |
| file全文 | 12.7% |
| 直近5 observation | 18.0% |
| full history | 15.0% |

### 証明したこと

**E2:** LM向けにbounded observation、transactional edit、structured feedbackを設計すると、同一model・同一taskで成功率が変わる。

### 証明していないこと

- coding以外でも同じcommand集合が最適とは限らない。
- Docker environmentのsecurityは評価していない。
- checkpoint/resume、distributed scheduling、multi-agent runtimeは扱わない。

### 実装判断

採用する:

- versioned ACI
- full traceとinference contextの分離
- bounded search/view
- action直後の安価なdeterministic guard
- budget超過時のpartial artifact保持

採用しない:

- SWE-agent固有commandを全domainの標準にすること
- shellだけを万能toolとみなすこと

---

## 3.2 AIOS: LLM Agent Operating System

### 書誌と選定理由

- Kai Mei et al.
- COLM 2025
- 初版: 2024-03-25、現行arXiv v5
- 原典: [arXiv:2403.16971](https://arxiv.org/abs/2403.16971)
- 選定理由: scheduler、context switch、memory、storage、tool、accessをkernel serviceとして統合し、No-AIOSとの比較を持つ。

### 解こうとした問題

各agentがLLM、tool、memoryへ直接アクセスすると、同時実行時のresource競合、context切替、tool conflict、access controlが各frameworkへ重複実装される。これらをagent applicationからkernelへ移せるかを問う。

### 提案アーキテクチャ

\`\`\`text
Application Layer
  Agent / Framework adapters / AIOS SDK
              ↓
Kernel Layer
  Agent Scheduler
    ├─ LLM Core
    ├─ Context Manager
    ├─ Memory Manager
    ├─ Storage Manager
    ├─ Tool Manager
    └─ Access Manager
              ↓
OS / Hardware / Model endpoint / Tools
\`\`\`

agent queryをLLM、memory、storage、toolのsyscall列へ分解し、中央queueから各managerへdispatchする。

### Stateとscheduling

- LLM生成の中断時にcontext snapshotを取り、再開する。
- closed modelでは生成済みtext、logitを取得できるmodelではsearch stateを保存する。
- runtime memoryはconversation logとtool resultを扱う。
- memory使用量80%でLRU-Kによりpersistent storageへevictする。
- schedulerはFIFOとpreemptive Round Robinを実装する。
- tool managerはparameter validationとparallel conflict回避を行う。
- access managerはagent IDとprivilege groupを管理する。

### 実験

単一RTX A5000、Llama-3.1-8B / Mistral-7B、default最大250 concurrent agentsというresource-constrained条件で効率を評価した。別のscalability実験では、複製したHumanEval workloadを用いて250〜2,000 active agentsを測定した。

| 構成 | 総実行時間 | 平均待機 | p90待機 |
|---|---:|---:|---:|
| No AIOS | 152.1 s | 9.8 s | 11.0 s |
| FIFO | 74.2 s | 3.0 s | 5.0 s |
| Round Robin | 77.3 s | 3.2 s | 4.2 s |

workloadにより最大2.1倍の**AIOS system calls per second**改善を報告する。これはcompleted task throughput一般の2.1倍を意味しない。FIFOは総時間、Round Robinはtail fairnessで優位だった。

### 証明したこと

**E2:** LLMを共有bottleneckとする条件では、agent requestをkernel queueでscheduleしcontext switchすることで、無調整な同時実行より待機時間とthroughputを改善できる。

### 証明していないこと

- multi-GPU、cloud API、分散nodeで同じ効果が得られるとは限らない。
- durable queue、crash recovery、idempotent syscallはない。
- AIOSのaccess managerは強いmulti-tenant security boundaryではない。
- code sandboxを提供するarchitectureではない。

### 実装判断

採用する:

- agent applicationとresource managerの分離
- syscall queueとagent metadataを持つ中央scheduler
- context snapshot/restoreを独立serviceにすること
- memory、storage、tool、accessの責務分離

留保:

- OS metaphorをそのまま製品architectureにする必要はない。
- model servingが外部APIなら、GPU schedulerよりbudget/rate-limit schedulerが重要になる。

---

## 3.3 OpenHands: An Open Platform for AI Software Developers as Generalist Agents

### 書誌と選定理由

- Xingyao Wang et al.
- ICLR 2025
- 初版: 2024-07-23
- 原典: [arXiv:2407.16741](https://arxiv.org/abs/2407.16741)
- 公式: [OpenReview](https://openreview.net/forum?id=OJd3ayDDoF)
- 選定理由: agent、event stream、runtime、sandbox、browser、evaluationを統合した実装済みplatform。

### 解こうとした問題

agentごとにshell、browser、code execution、UI、evaluationを作り直すと、agent policyとruntimeが密結合する。複数agentと複数benchmarkを同一platformへ載せる共通境界を設計する。

### 提案アーキテクチャ

\`\`\`text
User / UI
   ↕
State + chronological Event Stream
   ↕
Agent.step(State) → Action
   ↓
Runtime REST API
   ↓
Per-session Docker sandbox
   ├─ bash
   ├─ IPython/Jupyter
   ├─ file operations
   └─ Playwright/Chromium
   ↓
Observation → Event Stream
\`\`\`

Actionは\`CmdRunAction\`、\`IPythonRunCellAction\`、\`BrowserInteractiveAction\`等の少数のgeneral primitive。任意Docker imageへAction Execution APIを注入できる。

### State、delegation、observability

- Stateはaction、observation、user feedback、累積LLM費用、delegation metadataを持つ。
- \`AgentDelegateAction\`で専門agentへsubtaskを渡せる。
- UIはfile、bash、Python、browser activityを表示し、人が介入できる。
- evaluation frameworkは15 benchmarkを共通実行する。

### 実験

論文時点のCodeActAgent + Claude 3.5 SonnetはSWE-bench Liteで約26.0%、平均約$1.10/task。software、Web、general assistanceを同一agent abstractionで評価できることを示した。

### 証明したこと

**E2:** event streamと共通runtime interfaceにより、異なるagent、Docker image、tool modality、benchmarkを一つのplatformへ統合できる。

### 証明していないこと

- event streamが成功率やlatencyを改善するarchitecture ablationはない。
- event streamはdurable event sourcing、exactly-once delivery、deterministic replayを意味しない。
- action並列実行、backpressure、distributed schedulerは論文で規定されない。
- Docker escape、network egress、secret isolationは評価していない。

### 実装判断

採用する:

- agent policyとruntimeの分離
- action / observationを共通event envelopeへ載せる
- general primitive + domain adapter
- taskごとの短命environment
- UI、human intervention、evaluationが同じeventを参照する構成

追加する:

- durable semantics
- idempotency
- explicit network/secret policy
- verifier権限分離

---

## 3.4 The BrowserGym Ecosystem for Web Agent Research

### 書誌と選定理由

- Thibault Le Sellier de Chezelles et al.
- TMLR 2025
- 初版: 2024-12-06
- 原典: [arXiv:2412.05467](https://arxiv.org/abs/2412.05467)
- 公式: [OpenReview](https://openreview.net/forum?id=5298fKGmv3)
- 選定理由: agent、environment、task validator、experiment managerをprotocolで分離したWeb実行基盤。

### 提案アーキテクチャ

\`\`\`text
AgentLab
  ├─ study/config
  ├─ episode scheduler/retry
  ├─ token/cost/log
  └─ AgentXRay
         ↓
Agent.get_action(observation)
         ↕
BrowserGym Gymnasium API
  reset() / step(action)
         ↓
Chromium + Playwright
         ↕
Task.setup() / Task.validate()
         ↕
Benchmark backend + reset
\`\`\`

### Action / observation contract

\`reset()\`は\`observation, info\`、\`step()\`は\`observation, reward, terminated, truncated, info\`を返す。

observationにはgoal/chat、tab、URL、screenshot、DOM、AXTree、bbox、visibility、BrowserGym ID、\`last_action_error\`を含められる。agent側が必要なmodalityを選ぶ。

actionはclick、fill、press、drag、tab、navigation、message、infeasible report、scroll等。Playwright exceptionはepisodeをcrashさせず、次のobservationで返す。

### State、reset、parallelism

- stateはDOM、rendering、cookie/session、tabs、chat、backend DB。
- episode resetとbackend resetを分離する。
- WebArena系はDocker backendを初期状態へ戻す。
- AgentLabはRayまたはmultiprocessで20〜100 episodeを並列化できる。
- benchmarkのbackend dependencyにより実効並列度が2〜4へ落ちる場合がある。
- failed episodeは最大3回再launchする。

### 実験

Table 2の8 benchmark rowsで合計5,978 evaluation episodes、6 model群を評価した。WorkArena L2ではClaude 3.5 Sonnet 39.1%、GPT-4o 8.5%。同時に、VisualWebArenaではGPT-4oがClaudeを上回り、model順位がenvironmentで変わることも示した。

### 証明したこと

**E2:** action/observation、task setup/validation、backend resetをprotocol化すると、異なるWeb benchmarkとagentを共通runnerで比較できる。

### 証明していないこと

- \`bid\`は観測内の参照を安定化するが、navigationや再実行を越える永続IDとは限らない。
- DOM、AXTree、screenshotのどの組合せが一般に最適かはablationしていない。
- live Webのdeterministic replayは保証しない。
- Web securityやprompt injectionへの防御は主題ではない。

### 実装判断

採用する:

- environmentをGym型protocolにする
- episode resetとservice/backend resetを分離する
- tool errorをstructured observationにする
- text/visual表現を共通element referenceで結ぶ
- dependency graphに基づく並列度制御

---

## 3.5 Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks

### 書誌と選定理由

- Adam Fourney et al.
- Microsoft Research Technical Report MSR-TR-2024-47
- 初版: 2024-11-07
- 原典: [arXiv:2411.04468](https://arxiv.org/abs/2411.04468)
- 公式: [Microsoft Research](https://www.microsoft.com/en-us/research/publication/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/)
- 選定理由: multi-agent controlを「会話」ではなく、明示的ledger、stall detection、replanで構成し、worker ablationを持つ。
- 留保: 査読会議論文ではない。

### 提案アーキテクチャ

\`\`\`text
Orchestrator
  ├─ Outer loop: Task Ledger
  │    facts / unknowns / guesses / plan
  └─ Inner loop: Progress Ledger
       complete? in loop? progress?
       next worker? instruction?
          ↓
   ┌───────────────┬──────────┬────────┬──────────┐
   WebSurfer    FileSurfer   Coder   ComputerTerminal
\`\`\`

### Control flowとstate

- outer loopが全体planとfactsをTask Ledgerへ保持する。
- inner loopが毎round、完了、loop、進捗、次speaker、instructionをProgress Ledgerへ書く。
- stall counterが閾値2以下なら局所回復を続ける。
- 閾値を超えるとinner loopを抜け、reflection、replan、worker context resetを行う。
- 一度にOrchestratorが一workerを選ぶため、team内部は基本逐次実行。
- task間の長期memoryは持たない。

### Runtime、evaluation、安全性

- WebSurferはChromium、FileSurferはread-only preview、CoderはPython、Terminalはshell/Python。
- AutoGenBenchがtaskごとにfresh Docker containerを起動し、logをhostへ保存する。
- GAIA、AssistantBench、WebArenaで評価。
- full Orchestratorを単純speaker selectorへ変えるとGAIA validationで31%低下。
- worker除去で21〜39%低下。

### 証明したこと

**E2:** 複雑taskのmulti-agent orchestrationでは、structured ledger、progress判断、stall-triggered replan、役割分離が、単純speaker selectionより有効になり得る。

### 証明していないこと

- multi-agentが同一予算single-agentを一般に上回るとは証明しない。
- team内部の並列schedulerではない。
- ledger判定そのものがLLMなので、完了・進捗判定は決定的ではない。
- process crash recoveryやdurable checkpointはない。

### 実装判断

採用する:

- plan stateとprogress stateの分離
- explicit stall counter
- bounded local recovery後のreplan
- workerごとのtool scope
- multi-agent component ablation

採用条件:

- single-agent baselineより同一予算で改善すること
- handoff artifactとcompletion criterionを型付けできること

---

## 3.6 Holistic Agent Leaderboard: The Missing Infrastructure for AI Agent Evaluation

### 書誌と選定理由

- Sayash Kapoor et al.
- ICLR 2026 Poster
- 初版: 2025-10
- 原典: [arXiv:2510.11977](https://arxiv.org/abs/2510.11977)
- 公式: [OpenReview](https://openreview.net/forum?id=vUaY1t64ZZ)
- 選定理由: model、scaffold、benchmarkを分離し、大規模に再実行する評価実行基盤を具体化した。

### 解こうとした問題

leaderboard scoreはmodelだけでなくscaffold、retry、tool、environment、cost accountingに左右される。既存評価はframeworkごとに実装が異なり、比較不能、遅い、再現しにくい。

### 提案アーキテクチャ

\`\`\`text
Unified CLI / Config
     ↓
Benchmark adapter ─ Agent/Scaffold adapter
     ↓ minimal run(input) contract
Execution runner
  ├─ local / conda
  ├─ Docker
  └─ Azure VM orchestration
     ↓
Model provider via normalized client
     ↓
Central trace + token + cost logging
     ↓
Scoring + model × scaffold × benchmark leaderboard
     ↓
LLM-aided trajectory inspection
\`\`\`

agent codeへ特定frameworkを要求せず、最小Python interfaceへ適合させる。VMのprovision、parallel execution、teardownをharnessが管理する。

### 実験規模

- 9 models
- 9 benchmarks
- 21,730 agent rollouts
- 約40,000ドル
- 2.5B tokensのmodel-call log
- 数百VMでweeksからhoursへ評価時間を短縮

cost–accuracy Paretoとmodel × scaffold × benchmarkの三軸分析を行う。higher reasoning effortが多数のrunでaccuracyを下げる等、単純な「計算を増やせばよい」に反する結果も報告した。

### 証明したこと

**E2:** agent evaluationではmodelとscaffoldを別factorとして扱い、共通runner、cost accounting、trace inspectionを持つことで、比較の再現性と診断可能性を上げられる。

### 証明していないこと

- HAL harness自体が本番agent runtimeとして最適とは限らない。
- 一部benchmarkはpublic taskで、contaminationを完全には防げない。
- caching等を含むcost accountingには不完全性がある。
- 大規模評価の費用は小規模組織にそのまま適用できない。

### 実装判断

採用する:

- \`model × harness × environment × task\`を独立versionにする
- paired comparison
- cost、token、traceを必須結果にする
- local / container / VMで同じadapter contractを使う
- trajectoryからcheating、危険action、loopを検査する

---

## 3.7 ThunderAgent: A Simple, Fast and Program-Aware Agentic Inference System

### 書誌と選定理由

- Hao Kang et al.
- ICML 2026、初版2026-02
- 原典: [arXiv:2602.13692](https://arxiv.org/abs/2602.13692)
- 公式: [ICML 2026](https://icml.cc/virtual/2026/poster/62040)
- 選定理由: LLM servingとtool orchestrationをrequest単位で別管理する非効率を、workflow-level program abstractionで解くsystems研究。
- 留保: 査読済みだが、公開後が短く独立追試は未蓄積。

### 解こうとした問題

agent workflowはreasoningとtool executionを交互に行い、同じ長いcontextのKV cacheと同じtool environmentを再利用する。しかしvLLM等は各LLM requestを独立処理し、Kubernetes等はsandboxを別管理する。その結果:

- tool待ち中にKV cacheがevictされ、再prefillが発生する。
- node間でKV memoryが偏る。
- 終了したsandbox、disk、network portが回収されない。
- environment準備がcritical pathへ入る。

### 提案アーキテクチャ

ThunderAgentはworkflowを次の\`Agentic Program\`として表す。

\`\`\`text
P = <global ID,
     context token size,
     tool environments,
     node placement,
     phase: Reasoning | Acting,
     status: Active | Paused | Terminated>
\`\`\`

\`\`\`text
Agent workflows
     ↓ OpenAI-compatible request + Program ID
Global program-aware waiting queue
     ↓
Program-aware Scheduler
  ├─ state-aware Pause / Restore
  ├─ shortest-context eviction
  ├─ cross-node migration
  └─ KV pressure monitor
     ↕
LLM inference backends / KV cache

Program-aware Tool Resource Manager
  ├─ async environment preparation
  ├─ dependency tracking
  └─ lifecycle-aware garbage collection
     ↕
Docker / API server / disk / network port
\`\`\`

### scheduling policy

- Reasoning中のprogramを優先し、tool実行中のActing programを先にpauseする。
- context長とphaseを基にPause/Restoreを決める。
- tool待ちが長いKV cacheはtime-decayで保持優先度を下げる。
- global queueでnodeを跨いだmemory imbalanceを補正する。
- tool environmentの初期化をLLM reasoningとoverlapする。
- program termination signalでsandboxとportを回収する。

### 実験

8〜64 H100規模で、SWE-agent、OpenHands、ToolOrchestra等を評価した。

- serving throughput: 1.48〜3.58倍
- RL rollout throughput: 1.79〜3.92倍
- disk memory: 最大4.2倍削減
- request-aware baselineではKV thrashingによりend-to-end latencyが最大7.14倍増加
- 90分runでnode間memory imbalanceが最大51%

### 証明したこと

**E2:** 高並列・self-hosted model条件では、agent workflowのphase、context、tool environmentを一つのprogramとしてscheduleすると、LLM requestとcontainerを別々にscheduleするよりthroughputとresource回収を改善できる。

### 証明していないこと

- 低並列や外部model APIでも同じ改善が得られるとは限らない。
- task success自体を改善するarchitectureではない。
- durable recoveryやsecurity isolationを主題にしない。
- Program metadataをagentからどう信頼するかは追加設計が必要。

### 実装判断

採用する:

- schedulerの単位をLLM requestではなくrun/workflowにする
- \`Reasoning / Acting / Waiting / Terminated\`をruntime stateにする
- model KV、sandbox、port、diskを同じlifecycleへ結び付ける
- environment warm-upを先読みする
- terminationに連動したresource GC

導入条件:

- self-hosted model
- 高並列agent servingまたはRL rollout
- KV cache thrashingやsandbox leakageが実測されること

---

## 3.8 Crab: A Semantics-Aware Checkpoint/Restore Runtime for Agent Sandboxes

### 書誌と選定理由

- Tianyuan Wu et al.
- arXiv preprint、2026-04
- 原典: [arXiv:2604.28138](https://arxiv.org/abs/2604.28138)
- 選定理由: conversation checkpointとOS state checkpointの違いをfault injectionで定量化し、長時間agentの復旧architectureを直接扱う。
- 留保: 未査読preprint。

### 解こうとした問題

agent stateはchat historyだけではない。shell、package install、background process、open file、filesystem mutationがsandboxへ残る。

- chat-only recoveryはOS side effectを失う。
- filesystem-only recoveryはprocess stateを失う。
- 毎turn full checkpointはI/O負荷が高い。

この「agent–OS semantic gap」を解く。

### 提案アーキテクチャ

\`\`\`text
Agent
  ↓ HTTP model request
Coordinator / LLM reverse proxy
  ├─ turn boundary detection
  ├─ conversation log
  ├─ async checkpoint dispatch
  └─ completion gate
         ↓
eBPF Inspector
  └─ classify OS-visible effects:
     none / filesystem / process / full
         ↓
Host-scoped C/R Engine
  ├─ scheduler
  ├─ workers
  ├─ ZFS filesystem snapshot
  ├─ CRIU process checkpoint
  └─ version manager
         ↕
Co-located agent sandboxes
\`\`\`

Coordinatorはagentが次のLLM requestを送る時点をturn完了とみなす。LLM応答待ちの間にcheckpointを実行し、完了前に次turnへ進ませない。

### Stateとrecovery semantics

- persistent conversation log
- filesystem snapshot
- process/memory checkpoint
- turn-aligned version
- recovery時はcheckpointへ戻し、必要ならconversationをfast-forwardする
- host全体でcheckpoint trafficをscheduleする

### 実験

Terminal-BenchとSWE-bench、複数agent/model、最大96 sandbox densityでfailureを注入した。

- chat-only recovery: 評価したTerminal-Bench条件で8〜13%
- chat + filesystem: 同条件で28〜42%
- Crab: 評価したTerminal-Bench/SWE-bench構成と注入failure条件で100% recovery correctness
- checkpoint traffic: 評価条件内で最大87%削減
- fault-free runtime比: 1.9%以内
- every-turn full checkpoint: 高密度で最大3.78倍のslowdown
- 75%以上のturnがrecovery-relevant stateを作らない

### 証明したこと

**E2:** 評価したshell-intensive / code-repair agentでは、chat historyだけのcheckpointは不十分だった。turn semanticsとOS-visible effectを結合すると、評価条件内ではfull checkpoint頻度を減らしながら復旧正しさを保てた。

### 証明していないこと

- network上の外部副作用、決済、メール送信、SaaS更新をrollbackできるわけではない。
- eBPF signalだけでbusiness-level effectを理解できるわけではない。
- すべてのkernel、container runtime、cloudで同じ実装を移植できるとは限らない。

### 実装判断

採用する:

- replay levelをconversation、filesystem、process、external effectに分ける
- checkpointをturn boundaryへ揃える
- LLM wait時間へI/Oをoverlapする
- host-level checkpoint scheduler
- \`UNKNOWN_EXTERNAL_EFFECT\`状態

適用:

- 長時間coding/terminal agent
- spot instance
- failure recovery

---

## 3.9 DeltaBox: Scaling Stateful AI Agents with Millisecond-Level Sandbox Checkpoint/Rollback

### 書誌と選定理由

- Yunpeng Dong et al.
- arXiv preprint、2026-05
- 原典: [arXiv:2605.22781](https://arxiv.org/abs/2605.22781)
- 選定理由: tree searchとRL fan-outに必要な高頻度sandbox分岐・rollbackをOS substrateとして設計した。
- 留保: 未査読preprint、custom kernel moduleを含む。

### 解こうとした問題

Best-of-Nは同じ初期stateを多数cloneし、MCTSは中間stateへ頻繁に戻る。coding agentではpromptを切るだけではfilesystemとprocessを戻せない。full VM snapshotは数百ms〜秒で、探索のcritical pathを支配する。

### 提案アーキテクチャ

\`\`\`text
Search / RL Controller
      ↓ checkpoint / restore
Host Sandbox Controller
      ↓
Guest State Daemon
      ↓
StateManager
  ├─ DeltaFS
  │    dynamic overlay layers
  │    XFS reflink / copy-on-write
  └─ DeltaCR
       CRIU dump
       frozen process template
       lazy-page fallback
      ↓
Firecracker microVM
\`\`\`

StateManagerは各checkpointを\`(filesystem layer configuration, process image/template)\`のatomic pairとして保持し、search treeと同型のsnapshot index treeを管理する。

### checkpoint / restore

- checkpoint時、現在のwritable overlayをread-only lowerへ降格し、新しいupperを挿入する。
- processはCRIU dumpとfrozen templateを作る。
- bounded template poolからevictされたstateはCRIU slow pathへfallbackする。
- restore時、overlay stackをtargetへ切り替え、templateからforkする。
- Network Proxy DaemonがLLM connectionをagent processの外へ持ち、process checkpoint中も通信を進める。

### 実験

- arXiv v2で、非同期CRIU dump完了時間を除くcheckpoint API blocking intervalの加重平均: 約10.83 ms
- process templateが残る場合のfast restore: 約1.86 ms
- template miss時: CRIU lazy-page slow path
- E2B baselineで23〜48%だったstate management overheadを1〜2%へ削減
- SWE-bench MCTSとRL microbenchmarkで、固定時間内に探索できるnode数を増加

### 証明したこと

**E2:** 高頻度branch/rollback workloadでは、full-state copyではなくfilesystemとprocessのdeltaをcoupled stateとして管理すると、rollbackをmillisecond級へ短縮できる。

### 証明していないこと

- 一般的な本番agentにこの複雑性が必要とは限らない。
- custom overlayfs module、CRIU、Firecrackerの運用コストは大きい。
- external service stateはrollbackしない。
- security isolationの比較研究ではない。

### Crabとの使い分け

| 用途 | Crab | DeltaBox |
|---|---|---|
| 主目的 | fault recovery | 高頻度branch / rollback |
| checkpoint判断 | semantic、必要時だけ | 各探索nodeのdelta |
| 既存agentへの透明性 | 高い | workerをsandbox内で管理 |
| 実装侵襲 | host proxy + eBPF + C/R | custom FS + CRIU + microVM |
| 推奨時期 | 長時間runのP2 | tree search / RLのP3 |

### 実装判断

採用する:

- checkpointをconversation、filesystem、processのatomic pairとして扱う考え方
- search treeとcheckpoint indexを対応させること
- inference待ち時間へのcheckpoint I/O overlap

限定採用:

- custom filesystem、CRIU template、Firecracker統合は、branch/rollbackが実測bottleneckであり、通常snapshotより十分な改善が確認できた場合だけP3で導入する。

---

## 3.10 Natural-Language Agent Harnesses

### 書誌と選定理由

- Linyue Pan, Lexiao Zou, Shuo Guo, Jingchen Ni, Hai-Tao Zheng
- arXiv preprint、2026-03
- 原典: [arXiv:2603.25723](https://arxiv.org/abs/2603.25723)
- 選定理由: harnessを「controller codeの付随物」ではなく、独立し比較・version・ablationできるarchitecture artifactとして直接研究した。
- 留保: 未査読preprintであり、prototype runtimeのtoken overheadが大きい。

### 解こうとした問題

通常のcode harnessは、prompt、tool adapter、parser、retry、state、validator、artifact path、stop conditionが一つのcontrollerへ混ざる。そのため小さな変更でも複数条件が変わり、harness同士を比較できない。

### 提案アーキテクチャ

\`\`\`text
Layer 1: Base Agent
  minimal model loop + terminal

Layer 2: Intelligent Harness Runtime policy
  NLAH interpretation and orchestration semantics

Layer 3: Natural-Language Agent Harness
  stage / role / state / evidence / retry / stop policy

Layer 4: Deterministic scripts and adapters
  tool / parser / sandbox / test / validator
\`\`\`

NLAHはtask contract、stage、state、artifact、validation gate、recovery、stopping conditionを記述する。IHRはparent orchestratorとしてchild agentを起動し、task packet、file-backed state、artifactを介してhandoffする。

重要な境界は、**自然言語へpolicyを置き、精密性が必要なmechanismはcodeへ残す**ことにある。

### 実験

SWE-bench Verified、Terminal-Bench 2.0、OSWorldで、native code harness、同じNLAHを通常promptにした構成、IHR-executed NLAHを比較した。全実験はCodex CLI 0.123.0、gpt-5.4-mini、reasoning effort xhigh、Ubuntu 24.04、Docker条件で行われた。

| 対象 | Code | Prompt | NLAH |
|---|---:|---:|---:|
| Live-SWE performance | 67.0 | 77.0 | 73.0 |
| Terminal harness performance | 36.0 | 57.3 | 53.9 |
| OSWorld performance | 47.1 | 47.9 | 46.3 |

static policyはLive-SWEでcode materials 60.1k tokensからNLAH 2.9kへ、terminal harnessで10.5kから0.8kへ縮小した。

一方、NLAHはmodel call、tool call、prompt tokenが増える場合があり、Live-SWEでは約2.2M prompt tokensを使用した。handoff recallも低いcaseがある。Table 1は記述的比較であり、統計的同等性検定ではない。特にTerminal-Benchのnative MHTBAは別model向けartifactをgpt-5.4-miniへ移植した条件で、model–harness mismatchとtimeoutが交絡する。これは表現・実行可能性の証拠であって、code harness一般との性能同等性や、現実装の運用効率が高いことの証拠ではない。

### 証明したこと

**E2:** harness policyを独立した自然言語artifactとして外部化し、共通runtimeで実行可能であることを三domainの記述的比較で示した。SWE VerifiedとOSWorldでは近い成績だが、code harness一般との統計的同等性は証明していない。module-level ablationを可能にする研究設計を示した。

### 証明していないこと

- 自然言語policyがdeterministic codeより安価・安全とは証明しない。
- IHR自体がdurable execution engineであるとは限らない。
- policyの曖昧さやprompt injectionを強制的に防ぐものではない。

### 実装判断

採用する:

- harness policyをversioned artifactへ分離
- task contractを最初に書く
- state、evidence、validation、stop conditionを明示
- module boundaryをablation可能にする

codeに残す:

- authorization
- sandbox
- schema validation
- budget hard limit
- idempotency
- test execution
- destructive action gate

## 3.11 実験条件の正規化

論文間の成功率はbenchmarkが異なるため直接比較できない。下表は「そのarchitectureが何を根拠に評価されたか」を比較するためのものである。

| 論文 | workload / 規模 | model / hardware | baseline・予算 | 主metric | 原典箇所 |
|---|---|---|---|---|---|
| SWE-agent | SWE-bench full 2,294、Lite 300、HumanEvalFix | GPT-4 Turbo、Claude 3 Opus | Shell-only、RAG、task当たり$4上限 | resolved、cost | §4–5、Tables 1–3、Fig. 8 |
| AIOS | HumanEval、MINT、GAIA、SWE-bench Lite。scalabilityは250〜2,000 agents | RTX A5000 1枚、Llama-3.1-8B / Mistral-7B | No AIOS、FIFO、Round Robin | system calls/s、waiting time、task accuracy | §4、Fig. 6、Appendix Tables 6–7 |
| OpenHands | software / Web / generalの15 benchmarks | Claude 3.5 Sonnet、GPT-4o等 | 複数agent/scaffold。benchmark別cost | success、cost | §4、Tables 2、4–6 |
| BrowserGym | Table 2合計5,978 episodes、8 benchmark rows、6 model群 | GPT-4系、Claude 3.5、Llama 3.1 | GenericAgent共通設定、benchmark別step上限 | success、steps、cost | §6–7、Tables 1–2 |
| Magentic-One | GAIA 300、AssistantBench 181、WebArena 812 | GPT-4o、部分的o1-preview | simple selector、worker removal、時間/attempt上限 | success、95% Wald interval | §5、Table 1、Fig. 3 |
| HAL | 21,730 rollouts、9 models、9 benchmarks | 複数provider、local/Docker/Azure VM | model × scaffold × benchmark、約$40k | accuracy–cost Pareto、trace behavior | §2–3、Table 2、Fig. A1 |
| ThunderAgent | coding、routing、science agent。8〜64 H100 | GLM-4.6等self-hosted models | vLLM/Kubernetes、request-aware systems | serving/RL throughput、KV、disk | §3–5、Figs. 1–3 |
| Crab | Terminal-Bench / SWE-bench、3 agent/model系、最大96 sandboxes | AWS c6id.32xlarge等 | restart、chat-only、chat+FS、full checkpoint | recovery correctness、runtime、traffic | §3、§7、Figs. 1、13 |
| DeltaBox | SWE-bench MCTS、RL microbenchmarks | Firecracker、CRIU、custom overlayfs | E2B、Docker/VM snapshot等 | checkpoint/restore latency、explored nodes | arXiv v2 §3、§6、Table 1 |
| NLAH | SWE Verified、TB2 89、OSWorldのaudited settings | gpt-5.4-mini xhigh、Docker | code / prompt / NLAH。統計的同等性検定なし | performance、calls、tokens、runtime | §4–5、Tables 1–5、Appendix C |

未報告のtrial数、seed、hardwareがある論文について、本書は値を補完していない。特にplatform論文のbenchmark scoreを、そのplatform componentの因果効果として扱わない。

---

## 4. 横断比較

### 4.1 共通architecture軸による比較

| 論文 | 主な管理単位 | 保持するstate | 実行・権限境界 | failure / recovery | 証拠 | 成熟度と主制約 |
|---|---|---|---|---|---|---|
| SWE-agent | 1 coding episode / action | context、file、process、diff | Docker + ACI。security評価なし | invalid edit破棄、budget停止。checkpointなし | ACI ablation | NeurIPS。主にPython修正 |
| AIOS | agent queryを分解したsyscall | context、memory、storage | logical access manager。OS sandboxなし | context switch。node crash復旧なし | No-AIOS/FIFO/RR比較 | COLM。単一GPU中心 |
| OpenHands | 1 run / event stream | action、observation、cost、sandbox session | task別Docker。egress/secret保証なし | error観測。durable recoveryなし | 15 benchmarkで統合可能性 | ICLR。architecture ablationなし |
| BrowserGym | browser episode / action | DOM、tab、cookie、chat、backend | Playwright + benchmark backend | action error継続、episode/backend reset | 5,978 episodes | TMLR。live Webは非決定的 |
| Magentic-One | orchestrator round / worker | task ledger、progress ledger、worker context | worker別tool。強いauthorizationなし | stall検知、replan、context reset | orchestrator/worker ablation | Technical Report、未査読 |
| HAL | model × scaffold × benchmark rollout | task、trace、token、cost、answer | local / Docker / Azure VM | timeout、isolated rerun。runtime checkpointなし | 21,730 rollouts | ICLR。評価用で本番runtimeではない |
| ThunderAgent | Agentic Program | KV、phase、placement、tool environment | LLM backend + orchestrator。security非主題 | pause/restore、resource GC | 8〜64 H100、複数agent | ICML 2026。高並列self-host前提 |
| Crab | turn-aligned sandbox version | conversation、filesystem、process | host proxy + eBPF + C/R engine | semantic checkpoint、fault restore | failure injection、最大96 sandbox | preprint。外部副作用は戻せない |
| DeltaBox | search-tree node / DeltaState | filesystem + process atomic pair | Firecracker + custom FS/CRIU | arbitrary rollback、template fallback | MCTS/RL systems eval | preprint。kernel運用が重い |
| NLAH | harness policy / agent call | file-backed state、artifact、handoff | hard mechanismはcode側 | policy上のretry/validation。durabilityなし | 三domain記述比較、module ablation | preprint。token/handoff overhead |

この表の「証拠」はarchitectureが存在すること、性能因果、復旧正しさを区別して読む必要がある。たとえばOpenHandsは統合可能性を示すが、event streamが性能を改善したことはablationしていない。Crabは限定条件で復旧正しさを直接測っているが、外部SaaSの副作用までは復旧しない。

### 4.2 共通して現れる境界

10本を統合すると、agent systemを次の四つに分ける必要がある。

\`\`\`text
Model
  推論を行う。権限や正しさを最終決定しない。

Harness
  context、workflow、tool use、state、retry、stopを組み立てる。

Environment / Runtime
  actionを実行し、resource、isolation、checkpointを管理する。

Evaluator
  agentと独立にpostconditionを確認する。
\`\`\`

この分離が重要な理由:

- SWE-agent: interfaceだけで結果が変わる。
- HAL: modelとscaffoldを混ぜると評価対象が不明になる。
- OpenHands/BrowserGym: runtime adapterで複数agentを同じ環境へ載せられる。
- Crab/DeltaBox: conversation stateとOS stateは別物である。
- NLAH: harness policyとdeterministic mechanismは別物である。

### 4.3 実行stateは一種類ではない

| State | 例 | 正本 | rollback可能性 |
|---|---|---|---|
| Conversational | message、plan、ledger | event/log store | 高い |
| Harness | step、retry、budget、approval | orchestrator state | 高い |
| Artifact | patch、report、dataset | artifact store | version次第 |
| Filesystem | installed package、file mutation | sandbox snapshot | snapshot次第 |
| Process | server、memory、open FD | process/VM checkpoint | substrate次第 |
| External | email、payment、SaaS record | external system | 多くは不可 |

**重要な判断:** 「resumeできる」と言う前に、どのstate classを復元するのかを明記しなければならない。

### 4.4 replay level

| Level | 保証 |
|---|---|
| R0 | logを表示できる |
| R1 | model responseをrecord/replayできる |
| R2 | conversation + artifactを復元できる |
| R3 | filesystem + processを復元できる |
| R4 | idempotency keyで外部操作を安全に再照会できる |
| R5 | 外部世界を含む完全再現。通常は不可能 |

OpenHandsのevent streamやBrowserGymのtraceはR0/R1に有用だが、それだけでR3にはならない。CrabとDeltaBoxはR3を扱う。

### 4.5 workflow controlの選び方

| workload | 推奨control | 理由 |
|---|---|---|
| 明確な変換・検証 | fixed DAG | 最小費用、再現しやすい |
| coding/debugging | bounded action-observation loop | environment feedbackが必要 |
| Web UI | Gym-style loop + backend validator | 部分観測、stateful |
| 複数専門tool | central orchestrator + ledger | handoffとprogress管理 |
| 高並列serving | workflow-aware scheduler | KV/tool lifecycleを共有 |
| search/RL | branchable sandbox + checkpoint tree | 再実行費を削減 |

### 4.6 multi-agentの位置づけ

Magentic-Oneはmulti-agent設計の有力例だが、基盤の既定値にはしない。

multi-agentへ昇格する条件:

1. tool authorityを役割ごとに分離できる。
2. subtaskをartifact contractで受け渡せる。
3. 並列化またはcontext isolationの利益がある。
4. single-agentと同一総予算で改善する。
5. verifierをworkerと独立にできる。

一つでも満たさない場合、single-agentまたはfixed DAGを使う。

---

## 5. 証拠から設計要件へのトレーサビリティ

| 要件 | 根拠 | 強度 | 期待効果 | 反証条件 |
|---|---|---|---|---|
| bounded observation | SWE-agent、BrowserGym | E2 | context削減、誤操作低減 | task成功率が悪化 |
| transactional action | SWE-agent | E2 | failed editの連鎖防止 | multi-file変更を阻害 |
| agent/runtime/evaluator分離 | OpenHands、BrowserGym、HAL | E2 | 比較・移植・監査 | adapter overheadが支配 |
| workflow-level scheduler | ThunderAgent。AIOSはsyscall scheduling | E2 | 待機、KV、tool資源改善 | 低並列で利益なし |
| phase-aware state | ThunderAgent、Magentic-One | E2 | stallとresource状態を区別 | phase推定が不正確 |
| full traceとprompt context分離 | SWE-agent、HAL | E2 | auditを保ちcontext削減 | 要約で重要情報喪失 |
| OS state checkpoint | Crab、DeltaBox | E2 | crash/branch時の再実行削減 | workloadが短い |
| semantic checkpoint selection | Crab | E2 | checkpoint I/O削減 | side effect検知漏れ |
| delta rollback | DeltaBox | E2 | tree search高速化 | 運用複雑性が利益超過 |
| declarative harness policy | NLAH | E2 | review、version、ablation | token/handoff overhead |
| immutable RunSpec | HAL、BrowserGymから外挿 | E3/P | 再現性 | 記録漏れ |
| capability-based tool auth | 実務原則 | P | 権限縮小 | なし。実装品質が論点 |
| T2/T3 human approval | 実務原則 | P | irreversible事故低減 | UX負荷が過大 |

本書の実装仕様ではtool riskを\`T0〜T3\`、replay保証を\`R0〜R5\`として分離する。承認対象はtool risk \`T2/T3\`である。

\`P\`に分類した実務原則は、主要10論文の実験結果ではなく、次の標準・security guidanceを補助根拠とする。

- [NIST SP 800-190: Application Container Security Guide](https://csrc.nist.gov/pubs/sp/800/190/final)
- [Open Container Initiative Runtime Specification](https://github.com/opencontainers/runtime-spec)
- [SLSA: Supply-chain Levels for Software Artifacts](https://slsa.dev/spec/v1.1/)
- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)

これらはtool authorityやsandbox hardeningの設計根拠であり、特定LLM agent architectureの性能改善を証明するものではない。

---

## 6. 推奨する実行基盤の詳細設計

## 6.1 Specification plane

### RunSpec

RunSpecは実行前の意図を固定する。実績値はRunRecordへ分ける。

\`\`\`yaml
apiVersion: agent.platform/v1
kind: RunSpec
metadata:
  tenantId: tenant-123
  requestId: req-uuid
  idempotencyKey: task-456-v2
  parentRunId: null
spec:
  task:
    taskId: issue-789
    revision: "2026-07-23"
    objective: "..."
    inputArtifactDigest: sha256:...
    outputSchemaRef: artifact://schemas/result-v3.json
    successCriteria:
      - type: test_suite
        ref: verifier://coding/v4

  harness:
    policyRef: harness://coding/bounded-loop-v6
    policyDigest: sha256:...
    maxSteps: 40
    maxRepairs: 2
    maxInfraRetries: 2
    maxToolRetries: 2
    maxCheckpointRetries: 2
    maxVerificationRetries: 2

  model:
    routePolicy: static-cascade-v2
    allowedRevisions:
      - provider: provider-a
        model: model-x
        revision: "2026-06-15"

  environment:
    backend: microvm
    imageDigest: sha256:...
    dependencyLockDigest: sha256:...
    cpu: 8
    memoryMiB: 16384
    diskMiB: 40960
    networkPolicy: allowlist
    egressDomains: ["api.github.com"]

  tools:
    allow:
      - name: file.read
        version: "2.0"
        schemaDigest: sha256:...
      - name: shell.exec
        version: "3.1"
        schemaDigest: sha256:...

  budget:
    maxCostUsd: 10
    maxTokens: 500000
    maxToolCalls: 120
    maxWallSeconds: 3600
    verificationReservePercent: 20

  approval:
    policyRef: policy://standard-r2

  evaluation:
    graderVersion: coding-v4
    seed: 42
    repetitions: 3

  retention:
    eventDays: 365
    contentCapture: redacted
\`\`\`

必須digest:

- task revision
- prompt/harness policy
- tool schema
- environment image
- dependency lock
- model revision
- grader

## 6.2 Control plane

### Durable Orchestrator

責務:

- run state machine
- stage/step execution
- budget reservation
- retry policy
- approval wait
- checkpoint coordination
- cancellation
- verifier invocation
- terminal state確定

orchestratorは直接shellやbusiness APIを実行しない。すべてtool gatewayへ送る。

### Run state machine

\`\`\`mermaid
stateDiagram-v2
    [*] --> QUEUED
    QUEUED --> PROVISIONING
    PROVISIONING --> RUNNING
    PROVISIONING --> FAILED_INFRA
    PROVISIONING --> CANCELLED
    RUNNING --> WAITING_TOOL
    WAITING_TOOL --> RUNNING
    WAITING_TOOL --> FAILED
    WAITING_TOOL --> UNKNOWN_EXTERNAL_EFFECT
    WAITING_TOOL --> CANCELLED
    RUNNING --> WAITING_APPROVAL
    WAITING_APPROVAL --> RUNNING
    WAITING_APPROVAL --> APPROVAL_EXPIRED
    WAITING_APPROVAL --> CANCELLED
    RUNNING --> CHECKPOINTING
    CHECKPOINTING --> RUNNING
    CHECKPOINTING --> FAILED_INFRA
    CHECKPOINTING --> CANCELLED
    RUNNING --> VERIFYING
    VERIFYING --> SUCCEEDED
    VERIFYING --> REPAIRING
    VERIFYING --> FAILED_INFRA
    VERIFYING --> FAILED
    REPAIRING --> RUNNING
    REPAIRING --> BUDGET_EXHAUSTED
    REPAIRING --> FAILED
    REPAIRING --> CANCELLED
    RUNNING --> BUDGET_EXHAUSTED
    RUNNING --> POLICY_DENIED
    RUNNING --> FAILED
    RUNNING --> CANCELLED
    RUNNING --> UNKNOWN_EXTERNAL_EFFECT
\`\`\`

\`SUCCEEDED\`、\`FAILED\`、\`FAILED_INFRA\`、\`BUDGET_EXHAUSTED\`、\`POLICY_DENIED\`、\`APPROVAL_EXPIRED\`、\`CANCELLED\`、\`UNKNOWN_EXTERNAL_EFFECT\`を終端stateとし、変更しない。再実行は新しい\`run_id\`と\`parent_run_id\`を作る。retry上限はRunSpecの\`maxInfraRetries\`、\`maxToolRetries\`、\`maxCheckpointRetries\`、\`maxVerificationRetries\`でrun開始前に固定する。

| 発生箇所 | timeout / failure時の遷移 |
|---|---|
| \`PROVISIONING\` | retry可能なら新\`attempt_id\`で再provision。\`maxInfraRetries\`後は\`FAILED_INFRA\` |
| \`WAITING_TOOL\` | effectなしが確定すれば\`maxToolRetries\`までretry。照会不能またはeffect不明なら必ず\`UNKNOWN_EXTERNAL_EFFECT\` |
| \`WAITING_APPROVAL\` |期限切れで\`APPROVAL_EXPIRED\`。引数変更時は再承認 |
| \`CHECKPOINTING\` | 古いcheckpointを保持して\`maxCheckpointRetries\`までretry。上限後\`FAILED_INFRA\` |
| \`VERIFYING\` | grader infra失敗は\`maxVerificationRetries\`までretryして上限後\`FAILED_INFRA\`。functional failureは\`REPAIRING\` |
| 任意の非終端state | cancel後に未確定tool effectがなければ\`CANCELLED\`。照会不能またはeffect不明なら\`UNKNOWN_EXTERNAL_EFFECT\` |

状態更新とevent appendは同じtransaction、またはtransactional outboxで原子的に扱う。workerはleaseと単調増加するfencing tokenを持ち、期限切れworkerが古いcommandをcommitできないようにする。retryは同じstepを上書きせず、新しい\`attempt_id\`を作る。toolがtimeoutした場合、\`idempotency\`が\`required\`または\`supported\`なら同じ\`idempotency_key\`でstatusを照会する。\`none\`、status APIなし、または照会失敗なら再送せず\`UNKNOWN_EXTERNAL_EFFECT\`で安全停止する。

### Workflow-level Scheduler

最低限、次のmetadataを持つ。

\`\`\`text
run_id
workflow_id
phase = reasoning | acting | waiting | verifying | terminated
context_tokens
model_backend
sandbox_id
tool_resources
deadline
priority
budget_remaining
checkpoint_state
\`\`\`

self-hosted modelで高並列ならThunderAgent型のKV-aware schedulingを使う。外部API中心なら、rate limit、cost、deadline、provider healthを主にscheduleする。

## 6.3 Execution plane

### Model Gateway

- provider別API差をnormalizationする。
- request/response usageを測る。
- model revisionを記録する。
- retryは同一revisionを優先する。
- data residencyとtraining-use policyを強制する。
- credentialをagentへ渡さない。

### Typed Tool Gateway

tool risk classはreplay levelの\`R0〜R5\`と混同しないよう、\`T0〜T3\`とする。

| Tool risk | 例 | 既定動作 |
|---|---|---|
| T0 | public read-only search | policy内なら自動 |
| T1 | sandbox内file編集、下書き | reversible guard付き自動 |
| T2 | 外部送信、PR作成、業務record更新 | exact argumentsへの明示承認 |
| T3 | 支払、削除、本番変更、権限付与 | 二者承認または禁止 |

\`\`\`ts
interface ToolContract<Input, Output> {
  name: string
  version: string
  inputSchema: JSONSchema<Input>
  outputSchema: JSONSchema<Output>
  sideEffect: "none" | "reversible" | "irreversible"
  idempotency: "required" | "supported" | "none"
  riskClass: "T0" | "T1" | "T2" | "T3"
  timeoutMs: number
  maxOutputBytes: number
  requiredCapabilities: string[]
}
\`\`\`

call envelope:

\`\`\`json
{
  "call_id": "uuid",
  "idempotency_key": "uuid",
  "deadline": "RFC3339",
  "tool": "enterprise.ticket.update",
  "version": "2.1",
  "input_digest": "sha256:...",
  "expected_effect": {
    "resource": "ticket/123",
    "operation": "set_status"
  },
  "arguments": {}
}
\`\`\`

tool resultにはeffect receipt、changed resource ID、typed error、retryability、rollback tokenを含める。

### ACI標準

- file/search/browser observationへ上限を持たせる。
- 大出力はartifact storeへ置き、summary + handleを返す。
- empty successを明示する。
- observation内referenceはscopeを明記する。
- parse error、tool error、policy denialを別codeにする。
- syntax/schema/dry-run等の安価なguardはaction直後に実行する。
- destructive actionはprepare → approve → execute → verifyで処理する。

## 6.4 Sandbox

### 最低要件

- taskまたはattempt単位の短命container/microVM
- non-privileged、rootless
- read-only base image
- CPU、memory、PID、disk、wall-clock limit
- network default-deny
- metadata service、private network、host socketへの到達禁止
- short-lived capability credential
- agent workspaceとverifier workspaceの分離
- process supervisor
- environment image digest

### containerとmicroVMの選択

| 条件 | container | microVM |
|---|---|---|
| trusted internal code | 適する | 過剰な場合あり |
| third-party repository | hardening必須 | 推奨 |
| arbitrary package/install | risk高 | 推奨 |
| GUI/browser | 可能 | 強い隔離が必要なら推奨 |
| 高密度・短task | 有利 | cold start確認 |
| strong tenant isolation | 不十分な場合 | 有利 |

microVM採用は研究の自動結論ではなくthreat modelによる実務判断である。

## 6.5 State and evidence plane

### Event schema

\`\`\`json
{
  "event_id": "uuid",
  "event_type": "tool.call.completed",
  "schema_version": "1.0",
  "occurred_at": "RFC3339Nano",
  "recorded_at": "RFC3339Nano",
  "tenant_id": "tenant-123",
  "run_id": "run-uuid",
  "attempt_id": "attempt-uuid",
  "step_id": "step-17",
  "sequence": 42,
  "trace_id": "trace",
  "actor": {
    "type": "agent",
    "id": "coder",
    "version": "sha256:..."
  },
  "causation_id": "event-41",
  "classification": "confidential",
  "payload": {},
  "payload_digest": "sha256:...",
  "redaction_policy": "pii-v3"
}
\`\`\`

必須event:

- \`run.created|started|paused|completed|failed\`
- \`model.requested|completed|failed\`
- \`tool.proposed|approved|started|completed|failed\`
- \`policy.evaluated|denied\`
- \`budget.reserved|consumed|exhausted\`
- \`sandbox.created|terminated|violation\`
- \`checkpoint.requested|completed|restored\`
- \`artifact.created|verified\`
- \`verification.started|result\`
- \`agent.delegated|handoff.completed\`
- \`human.approval.requested|granted|denied\`

event deliveryはat-least-once、consumerは\`event_id\`で冪等化する。大容量contentはeventへ埋めずartifact URIとdigestを記録する。

### Contextとmemory

\`\`\`text
Raw event log      完全な正本。通常promptへ直接入れない。
Working context    現runのplan、未解決、直近observation。
Artifact index     file、test、screenshot、reportへのhandle。
Semantic memory    出典・scope・expiry付きの検証済み事実。
Procedural memory  version付きの承認済みharness/playbook。
\`\`\`

memory writeは\`proposed → validated → accepted\`。自己反省文を事実として直接永続化しない。

## 6.6 Checkpoint and recovery

### 復旧方針

| failure | 動作 |
|---|---|
| model 429/5xx | bounded retry + jitter |
| tool timeout、effect不明 | status照会。盲目的再実行禁止 |
| orchestrator crash | event + checkpointから再開 |
| sandbox crash | R3 checkpointから復元、なければ新attempt |
| budget不足 | 新step停止、可能ならverify、partial artifact返却 |
| policy denial | fail closed |
| process leak | supervisor kill、resource reclaim |
| external action後切断 | \`UNKNOWN_EXTERNAL_EFFECT\`、receipt確認、人へescalate |
| repeated no-progress | stall counter、replanまたは停止 |

### 導入段階

- 通常task: conversation + artifact checkpoint。
- 長時間terminal task: Crab型semantic OS checkpoint。
- tree search / RL: DeltaBox型high-frequency delta checkpoint。
- external business action: snapshotではなくidempotency、read-back、saga、compensation。

## 6.7 Evaluation plane

評価対象を次のtupleにする。

\`\`\`text
EvaluationUnit =
  task_revision
  × model_revision
  × harness_version
  × environment_digest
  × tool_schema_version
  × grader_version
  × seed
\`\`\`

### 4層評価

1. component: tool selection、schema、router、retrieval
2. trajectory: loop、retry、recovery、policy
3. end-to-end: final state、cost、latency
4. adversarial/operational: injection、outage、timeout、secret、concurrency

### verifier順序

1. syntax/schema
2. policy/security
3. deterministic functional test
4. state/read-back
5. evidence consistency
6. semantic judge
7. human review

LLM judgeを使う場合、人間とのagreement、position bias、model-family bias、revisionを保存する。

---

## 7. 用途別decision matrix

| 領域 | control | environment | verifier | checkpoint | 特記事項 |
|---|---|---|---|---|---|
| Coding | bounded loop / fixed DAG | repo container/microVM | hidden tests、lint、typecheck | FS+process | transactional edit |
| Web | Gym-style loop | browser + resettable backend | backend state、receipt | session snapshot | DOM/AXTree/image選択 |
| Research | staged DAG + bounded search | network sandbox | citation entailment、coverage | artifact中心 | source provenance |
| Enterprise API | fixed workflow優先 | typed connector | read-back、business invariant | saga log | T2/T3 approval |
| ML/R&D | long-running loop | GPU sandbox | score-vs-time、best artifact | process+GPU metadata | zombie/VRAM supervisor |
| Tree search/RL | branch scheduler | rollbackable microVM | node reward + final test | Delta checkpoint tree | P3機能 |
| Multi-agent | central ledger | tool-scoped workers | independent verifier | artifact handoff | 同一予算baseline必須 |

---

## 8. KPI、SLO、導入gate

以下の値は論文の普遍値ではなく、設計初期値である。

### 8.1 Platform SLO

| 指標 | 初期目標 |
|---|---:|
| trace event欠損 | 0 |
| T2/T3未承認副作用 | 0 |
| cross-tenant data leak | 0 |
| hard budget超過 | 上限比1%未満 |
| cancel反映 p95 | 5秒以内 |
| container cold start p95 | 5秒以内 |
| microVM cold start p95 | 15秒以内 |
| tool gateway overhead p95 | 100 ms以内 |
| retryable infra failure自動復旧 | 99%以上 |
| grader oracle pass | 100% |
| grader no-op rejection | 100% |

### 8.2 Product KPI

- verified task success
- cost per verified success
- time per verified success
- first-pass verification rate
- pass^k / all-k reliability
- forbidden side-effect rate
- silent failure rate
- human minutes per task
- best score reached time
- tool invalid argument rate
- no-progress turn ratio
- recovery success rate
- model × harness interaction effect

「agentが完了と言った率」は主要KPIにしない。

### 8.3 導入gate

#### Gate 0: Read-only internal

- RunSpec、event、tool schemaがversion固定される。
- trace欠損0。
- deterministic verifierがある。
- secret leakage test 0件。
- manual baselineとpaired comparisonできる。

#### Gate 1: Workspace write

- reversible actionだけ。
- regression suiteを通過。
- idempotent retryを検証。
- sandbox escape/egress testを通過。
- cost per verified successを報告。

#### Gate 2: External write

- tool risk class T2/T3のexact argument-bound approval。
- effect receiptとread-back。
- ambiguous timeout手順を演習。
- forbidden side effect 0。
- canary tenantとkill switch。

#### Gate 3: Long-running / recovery

- fault injectionでrecovery correctness 99%以上。
- process、filesystem、conversationの復旧範囲を明記。
- checkpoint overheadを測定。
- external effectはR4/R5として分離。

#### Gate 4: Dynamic multi-agent / tree search

- 同一予算single-agent比で統計的に有意な改善。
- p95 cost/latency ceiling内。
- recursive spawn上限。
- agent別tool scope。
- branch stateのatomicity検証。

---

## 9. 整備ロードマップ

### Phase A: 測れる一実行

実装:

- RunSpec / RunRecord
- run state machine
- event / artifact store
- model/tool gateway
- task sandbox
- deterministic verifier
- token、cost、latency

exit:

- 代表task 50件を各3回実行し、environment起因の結果不一致率1%以下。
- trace event欠損0、RunSpec digest欠損0。
- oracle solution pass 100%、no-op rejection 100%。
- model、harness、environment、graderを一要因ずつ変えた結果を別runとして識別できる。
- infra、agent、grader failureの分類不能率1%以下。

### Phase B: 安全なaction loop

実装:

- bounded ACI
- structured error
- transactional edit
- policy/approval
- process supervisor
- best artifact retention

exit:

- 代表task 100件以上のpaired evaluationで、invalid tool call率をbaseline比30%以上低減。
- verified successの差の95% bootstrap CI下限が-2 percentage points以上。
- 注入したretryable tool failureの90%以上で、重複副作用なく継続または安全停止。
- adversarial/policy suite 500件以上でforbidden side effect 0。
- p95 costとlatencyが事前ceiling内。超過時はPhase A構成へrollback。

### Phase C: 大規模評価と長時間run

実装:

- HAL型parallel evaluation
- workload-level scheduler
- checkpoint/recovery
- trajectory analyzer
- stall detection

exit:

- 最低100回のprocess/sandbox fault injectionでrecovery correctness 99%以上。
- checkpoint有効時のp95 end-to-end overhead 5%以下、または再実行削減額がoverheadを上回る。
- 同一task setのparallel evaluation makespanをserial推定比80%以上短縮。
- 各model × harness構成についてaccuracy、cost、token、wall-clockの95% CIとPareto frontierを出せる。
- recovery失敗率またはunknown external effect率が1%を超えたらcheckpoint機能を無効化。

### Phase D: 高度な最適化

実装:

- ThunderAgent型program-aware scheduling
- semantic checkpoint
- delta rollback
- declarative harness policy
- limited multi-agent

exit:

- 代表task 200件以上のpaired evaluationで、対象bottleneck metricを20%以上改善し、95% CIが0を跨がない。
- cost per verified successを10%以上悪化させない。
- multi-agentは同一総予算single-agentよりverified successを5 percentage points以上改善するか、wall-clockを30%以上短縮する。
- delta rollbackは通常checkpoint比でbranch setup p95を50%以上短縮する。
- 上記を満たさないmoduleは削除し、Phase C構成へrollbackする。

---

## 10. Build vs Buy

### 自社で保持すべきcontrol point

- RunSpec schema
- harness policy
- tool authority model
- approval semantics
- domain verifier
- evaluation dataset
- event canonical schema
- cost/quality decision rule

これらをvendor固有formatへ閉じ込めると、agentの権限、品質、費用を自社で説明できなくなる。

### 購入・managed serviceを検討できる部分

- model gateway
- container/microVM capacity
- browser pool
- trace storage
- generic observability
- checkpoint substrate

### Vendor失格条件

- event/artifactを完全exportできない。
- model、tool、image、grader versionを固定できない。
- agentへ長期credentialを渡す。
- network policyを設定できない。
- hidden evaluatorをagentから分離できない。
- external writeをexact argumentsへbindingして承認できない。
- vendor trainingへのdata利用を拒否できない。

---

## 11. 未解決事項と追加実験

### 11.1 最新preprintの再現性

Crab、DeltaBox、NLAHはarchitectureへの直接性が高いが未査読であり、ThunderAgentはICML 2026採択済みでも独立追試は未蓄積である。自社prototypeで次を確認する。

- workloadが論文条件と一致するか。
- baseline実装が公平か。
- hardware、model、sandboxの差で効果が維持されるか。
- code公開版が論文結果を再現するか。

### 11.2 Scheduler

AIOSとThunderAgentは異なるscaleを扱う。まず以下をprofileする。

- model queue time
- KV hit rate
- reprefill tokens
- tool wait ratio
- environment setup time
- leaked disk/port/process

bottleneckがなければprogram-aware schedulerを作らない。

### 11.3 Checkpoint

短いtaskではcheckpointの複雑性が利益を上回る。task duration、state mutation density、failure rate、branch factorから導入判断する。

\`\`\`text
Expected saved replay cost
>
checkpoint overhead + storage + operational complexity
\`\`\`

### 11.4 Natural-language harness

NLAHはreviewabilityを高める一方、model callとhandoff overheadがある。policyのうち次を自然言語へ置く。

- stage
- role
- evidence discipline
- retry strategy
- stop condition

次はcode/policy engineへ残す。

- permission
- budget
- schema
- idempotency
- sandbox
- destructive action

### 11.5 評価の汚染

- public benchmarkだけでrelease判断しない。
- task timestampとmodel cutoffを保存する。
- private / rolling tasksを持つ。
- network accessを記録する。
- agentがbenchmark名やgold artifactを検索したtraceを検知する。

---

## 12. 最終提言

### 12.1 一文での回答

エージェント開発環境には、**versioned RunSpecを入口とし、durable orchestratorがworkflow単位でmodel・tool・sandboxを制御し、action/observationをbounded ACIで交換し、conversation・artifact・OS stateを分離してcheckpointし、独立verifierが最終状態を評価する基盤**を整備すべきである。

### 12.2 最重要の設計判断

1. **modelではなくrunを管理単位にする。**
2. **agent policyとexecution mechanismを分離する。**
3. **conversationとenvironment stateを混同しない。**
4. **toolはfunction listではなくauthority boundaryとして設計する。**
5. **成功はagentの発言ではなくpostconditionで決める。**
6. **model、harness、environment、graderを独立にversion・比較する。**
7. **multi-agent、memory、tree searchは計測後に追加する。**

### 12.3 現時点の推奨構成

\`\`\`text
MVP
  single agent or fixed DAG
  + typed tool gateway
  + isolated sandbox
  + append-only events
  + independent verifier
  + hard budget

Scale-up
  + workflow-level scheduler
  + parallel evaluation
  + semantic checkpoint/recovery
  + trajectory analyzer

Specialized
  + delta rollback for search/RL
  + declarative harness policy
  + bounded multi-agent delegation
\`\`\`

研究全体が示すのは、agentの能力はmodel単独では決まらないということだけではない。より具体的には、**interface、scheduler、sandbox lifecycle、state semantics、verification、evaluation isolationの設計が、成功率、throughput、復旧可能性、費用をそれぞれ別の経路で決める**。

したがって、万能frameworkを一つ選ぶことより、これらの境界を自社のcanonical contractとして保持することが重要である。

---

## 付録A: 検索・screening記録

### A.1 検索記録

| 項目 | 内容 |
|---|---|
| 実施日 | 2026-07-23 UTC |
| 検索先 | arXiv、OpenReview、ICLR/ICML/NeurIPS/COLM/TMLR proceedings、Semantic Scholar、OpenAlex、公式repository |
| 検索語群1 | \`"LLM agent runtime" architecture scheduler\` |
| 検索語群2 | \`"agent operating system" LLM context tool manager\` |
| 検索語群3 | \`"agent harness" execution environment architecture\` |
| 検索語群4 | \`"agent sandbox" checkpoint restore rollback\` |
| 検索語群5 | \`"agent evaluation infrastructure" VM harness scaffold\` |
| 検索語群6 | \`"program-aware agent serving" KV tool environment\` |
| 重複排除 | arXiv、会議版、technical reportが同一内容なら一研究として扱う |
| 期間外例外 | architecture中心性3、後続利用または査読実績が強い基準論文 |

### A.2 採点尺度

各候補のscoreは\`R/A/E/N/I/P/G\`の順で0〜3。

- \`R\`: 調査質問とのrelevance
- \`A\`: architecture centrality
- \`E\`: evidence strength
- \`N\`: recency
- \`I\`: impact
- \`P\`: reproducibility
- \`G\`: generalizability

scoreは本調査のscreening judgmentであり、論文品質の普遍的順位ではない。\`主\`は主要10本、\`補\`は補助証拠、\`除\`は対象外。

### A.3 全38候補

| # | 候補 | 初版 | 判定 | R/A/E/N/I/P/G | 主な理由 |
|---:|---|---:|:---:|:---:|---|
| 1 | [AIOS](https://arxiv.org/abs/2403.16971) | 2024-03 | 主 | 3/3/3/1/2/3/2 | kernel、scheduler、context switchを直接評価 |
| 2 | [SWE-agent](https://arxiv.org/abs/2405.15793) | 2024-05 | 主 | 3/3/3/1/3/3/2 | ACI architectureとablation |
| 3 | [OpenHands](https://arxiv.org/abs/2407.16741) | 2024-07 | 主 | 3/3/2/2/3/3/3 | event/runtime/sandbox/eval統合 |
| 4 | [ToolSandbox](https://arxiv.org/abs/2408.04682) | 2024-08 | 補 | 2/2/3/2/2/3/2 | stateful tool評価。runtime提案が主ではない |
| 5 | [CORE-Bench](https://arxiv.org/abs/2409.11363) | 2024-09 | 補 | 2/1/3/2/2/3/2 | reproducibility benchmark中心 |
| 6 | [MLE-bench](https://arxiv.org/abs/2410.07095) | 2024-10 | 補 | 2/1/3/2/3/3/2 | scaffold差は重要だがarchitecture非中心 |
| 7 | [RE-Bench](https://arxiv.org/abs/2411.15114) | 2024-11 | 補 | 2/1/3/2/2/3/2 | 長時間agent評価中心 |
| 8 | [BrowserGym](https://arxiv.org/abs/2412.05467) | 2024-12 | 主 | 3/3/2/2/2/3/2 | environment/task/agent protocol |
| 9 | [TheAgentCompany](https://arxiv.org/abs/2412.14161) | 2024-12 | 補 | 2/2/2/2/2/3/2 | enterprise環境は有用、基盤研究ではない |
| 10 | [AFlow](https://arxiv.org/abs/2410.10762) | 2024-10 | 補 | 2/2/3/2/2/3/2 | offline workflow optimizer |
| 11 | [A-MEM](https://arxiv.org/abs/2502.12110) | 2025-02 | 補 | 1/1/2/2/2/3/1 | memory moduleに限定 |
| 12 | [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657) | 2025-03 | 補 | 2/1/3/2/2/3/2 | failure taxonomyでありruntime提案でない |
| 13 | [Memory OS of AI Agent](https://arxiv.org/abs/2506.06326) | 2025-06 | 補 | 2/2/2/2/1/3/1 | memory OS。全実行基盤ではない |
| 14 | [τ²-Bench](https://arxiv.org/abs/2506.07982) | 2025-06 | 補 | 2/1/2/2/1/3/2 | dual-control benchmark |
| 15 | [Scaling Test-time Compute for LLM Agents](https://arxiv.org/abs/2506.12928) | 2025-06 | 補 | 2/1/2/2/1/2/2 | search policyでsubstrate非中心 |
| 16 | [Agent Lightning](https://arxiv.org/abs/2508.03680) | 2025-08 | 補 | 2/2/2/3/2/3/2 | training/agent分離。運用runtimeとは異なる |
| 17 | [AgentScope 1.0](https://arxiv.org/abs/2508.16279) | 2025-08 | 補 | 3/3/2/3/2/3/2 | architecture直接、主要10本とのlayer重複 |
| 18 | [Holistic Agent Leaderboard](https://arxiv.org/abs/2510.11977) | 2025-10 | 主 | 3/3/3/3/2/3/3 | 大規模評価harness |
| 19 | [Continuum](https://arxiv.org/abs/2511.02230) | 2025-11 | 補 | 2/3/2/3/1/2/2 | KV TTL scheduler。ThunderAgentと比較用 |
| 20 | [Astraea](https://arxiv.org/abs/2512.14142) | 2025-12 | 補 | 2/3/2/3/1/2/2 | state-aware scheduling。独立追試前 |
| 21 | [CONCUR](https://arxiv.org/abs/2601.22705) | 2026-01 | 補 | 2/3/2/3/1/2/2 | agent concurrency systems。主要枠制約 |
| 22 | [ThunderAgent](https://arxiv.org/abs/2602.13692) | 2026-02 | 主 | 3/3/3/3/2/3/2 | workflow-level serving、ICML 2026 |
| 23 | [Quine](https://arxiv.org/abs/2603.18030) | 2026-03 | 補 | 2/3/1/3/1/3/1 | POSIX process abstraction、評価が弱い |
| 24 | [Natural-Language Agent Harnesses](https://arxiv.org/abs/2603.25723) | 2026-03 | 主 | 3/3/2/3/1/3/2 | harness policyを直接研究 |
| 25 | [Springdrift](https://arxiv.org/abs/2604.04660) | 2026-04 | 補 | 2/3/1/3/1/3/1 | persistent runtime、単一system実証中心 |
| 26 | [Crab](https://arxiv.org/abs/2604.28138) | 2026-04 | 主 | 3/3/3/3/1/2/2 | semantic checkpointとfault injection |
| 27 | [Architectural Design Decisions in AI Agent Harnesses](https://arxiv.org/abs/2604.18071) | 2026-04 | 補 | 2/2/2/3/1/2/2 | OSS観察研究、実行architecture提案でない |
| 28 | [Harness-Bench](https://arxiv.org/abs/2605.27922) | 2026-05 | 補 | 2/2/2/3/1/3/2 | harness比較benchmark |
| 29 | [Magentic-One](https://arxiv.org/abs/2411.04468) | 2024-11 | 主 | 3/3/2/2/2/3/2 | ledger、stall recovery、worker ablation |
| 30 | [SAGA](https://arxiv.org/abs/2605.00528) | 2026-05 | 補 | 2/3/2/3/1/2/2 | workflow-atomic inference scheduler |
| 31 | [DeltaBox](https://arxiv.org/abs/2605.22781) | 2026-05 | 主 | 3/3/3/3/1/2/1 | millisecond sandbox rollback |
| 32 | [Agent libOS](https://arxiv.org/abs/2606.03895) | 2026-06 | 補 | 3/3/1/3/1/3/2 | capability runtime、性能実証が未成熟 |
| 33 | [Orla](https://arxiv.org/abs/2603.13605) | 2026-03 | 補 | 2/3/2/3/1/2/2 | multi-agent serving、主要枠制約 |
| 34 | [Agent Operating Systems](https://arxiv.org/abs/2606.01508) | 2026-06 | 除 | 1/2/0/3/1/0/1 | 実装・実験なし |
| 35 | Agent Harness for LLM Agents: A Survey | 2026-04 | 除 | 1/1/1/3/1/1/2 | surveyであり一次研究でない |
| 36 | [Model Context Protocol Architecture](https://modelcontextprotocol.io/specification/2025-06-18/architecture) | 2025-06 | 除 | 2/3/0/2/3/3/3 | 重要仕様だが論文でない |
| 37 | [τ-bench](https://arxiv.org/abs/2406.12045) | 2024-06 | 補 | 2/1/3/1/3/3/2 | stateful reliability評価、architecture非中心 |
| 38 | [OSWorld](https://arxiv.org/abs/2404.07972) | 2024-04 | 補 | 2/2/3/1/3/3/2 | VM評価環境、agent runtime非中心 |

最終選定は単純な合計score順ではない。まず\`R=3\`かつ\`A=3\`を原則gateとし、次に次のarchitecture layerを重複なく覆う集合を選んだ。

1. ACI
2. agent OS / syscall scheduling
3. general runtime / sandbox integration
4. browser environment protocol
5. multi-agent orchestration
6. evaluation infrastructure
7. program-aware serving
8. fault-recovery checkpoint
9. high-frequency rollback substrate
10. harness policy representation

同じlayerに複数候補がある場合、\`E\`、査読状況、\`I\`、\`P\`の順で優先し、2025後半以降の新問題を一つも含めない構成は避けた。この規則により、主要判定は本文の10本と一致する。

### A.4 選定感度

査読済み研究だけに限定すると、Crab、DeltaBox、NLAHを主要10本から外し、ToolSandbox、Terminal-Bench 2.0、AgentScopeまたはAutoGen COLM 2024を入れる構成になる。しかしその場合、2026年に顕在化したcheckpoint/rollbackとharness policyの研究を捉えられない。

本書は「確立した設計だけ」ではなく「今後の実行基盤投資を判断する」目的のため、査読済みanchorと未査読frontierを明示的に混在させた。未査読研究は、そのまま採用する結論ではなく、prototypeで検証する候補として扱う。

## 付録B: 引用指標とrecord重複

### B.1 同一索引での比較

OpenAlexのarXiv DOI recordを同一条件で取得した値。取得日2026-07-23 UTC。会議版と統合されていない場合があるため、影響度の下限的な参考値であり、単純な論文順位には使わない。

| 論文 | OpenAlex cited_by_count | record |
|---|---:|---|
| SWE-agent arXiv版 | 28 | [W4399114781](https://openalex.org/W4399114781) |
| AIOS arXiv版 | 8 | [W4393247776](https://openalex.org/W4393247776) |
| OpenHands arXiv版 | 11 | [W4403885061](https://openalex.org/W4403885061) |
| BrowserGym arXiv版 | 4 | [W4405252842](https://openalex.org/W4405252842) |
| Magentic-One arXiv版 | 14 | [W4404396586](https://openalex.org/W4404396586) |

### B.2 索引差の例

Semantic Scholarでは取得時に、SWE-agent会議版117、OpenHandsの統合record約833、BrowserGym約134、Magentic-One 158と表示された。OpenAlexのarXiv recordとの差は、会議版統合、引用索引範囲、更新時刻による。

- SWE-agent Semantic Scholar conference record: [e941e021…](https://www.semanticscholar.org/paper/e941e021319a72b7fcc26e1b9230fdfe1c0fe380)
- OpenHands Semantic Scholar record: [1d07e5b6…](https://www.semanticscholar.org/paper/1d07e5b6f978cf69c0186f3d5f434fa92d471e46)
- BrowserGym Semantic Scholar record: [cdee27ca…](https://www.semanticscholar.org/paper/cdee27ca18f11adae733aa9baf1b1377b864cfa1)
- Magentic-One Semantic Scholar record: [36e87fcc…](https://www.semanticscholar.org/paper/36e87fcc7289e03f5a306e4bb95830e45b82ccd3)

SWE-agentはNeurIPS版を書誌上の正本とし、arXiv版と会議版の件数を合算しない。2026年frontier論文は引用がほぼ蓄積していないため、査読状況、architecture直接性、実験規模、code公開を選定根拠にした。

## 参考文献

1. Yang, J. et al. “SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering.” NeurIPS 2024. [原典](https://arxiv.org/abs/2405.15793)
2. Mei, K. et al. “AIOS: LLM Agent Operating System.” COLM 2025. [原典](https://arxiv.org/abs/2403.16971)
3. Wang, X. et al. “OpenHands: An Open Platform for AI Software Developers as Generalist Agents.” ICLR 2025. [原典](https://arxiv.org/abs/2407.16741)
4. Le Sellier de Chezelles, T. et al. “The BrowserGym Ecosystem for Web Agent Research.” TMLR 2025. [原典](https://arxiv.org/abs/2412.05467)
5. Fourney, A. et al. “Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks.” MSR-TR-2024-47. [原典](https://arxiv.org/abs/2411.04468)
6. Kapoor, S. et al. “Holistic Agent Leaderboard: The Missing Infrastructure for AI Agent Evaluation.” ICLR 2026. [原典](https://arxiv.org/abs/2510.11977)
7. Kang, H. et al. “ThunderAgent: A Fast, Simple, and Program-Aware Agentic Inference System.” ICML 2026. [原典](https://arxiv.org/abs/2602.13692)
8. Wu, T. et al. “Crab: A Semantics-Aware Checkpoint/Restore Runtime for Agent Sandboxes.” arXiv, 2026. [原典](https://arxiv.org/abs/2604.28138)
9. Dong, Y. et al. “DeltaBox: Scaling Stateful AI Agents with Millisecond-Level Sandbox Checkpoint/Rollback.” arXiv, 2026. [原典](https://arxiv.org/abs/2605.22781)
10. Pan, L. et al. “Natural-Language Agent Harnesses.” arXiv, 2026. [原典](https://arxiv.org/abs/2603.25723)

### 補助参照

- Xia, C. S. et al. “Agentless: Demystifying LLM-Based Software Engineering Agents.” FSE 2025. [原典](https://arxiv.org/abs/2407.01489)
- Zhang, J. et al. “AFlow: Automating Agentic Workflow Generation.” ICLR 2025. [原典](https://arxiv.org/abs/2410.10762)
- Chan, J. S. et al. “MLE-bench.” ICLR 2025. [原典](https://arxiv.org/abs/2410.07095)
- Wijk, H. et al. “RE-Bench.” ICML 2025. [原典](https://arxiv.org/abs/2411.15114)
- Lu, J. et al. “ToolSandbox.” NAACL 2025. [原典](https://arxiv.org/abs/2408.04682)
- Merrill, M. A. et al. “Terminal-Bench.” ICLR 2026. [原典](https://arxiv.org/abs/2601.11868)
- Chen, K. et al. “AgentCompass.” arXiv, 2026. [原典](https://arxiv.org/abs/2607.13705)
`,t=`# Research

deep research など、**リポジトリ実装とは独立した調査レポート**を置く場所。

| 置き場 | 役割 |
|--------|------|
| \`YYYY-MM-DD-<slug>.md\` | 統合レポート（1 依頼 = 1 ファイル） |

- 作成手順: \`.cursor/skills/deep-research-report-ja/SKILL.md\`
- 閲覧: \`apps/report-viewer\`（ポータルでは Research 枠）
- **置かないもの**: アプリ要件・ドメイン制約・インシデント教訓 → それらは \`knowledge/\`
`;function n(e){let t=e.replaceAll(`\\`,`/`),n=t.lastIndexOf(`/research/`);return n===-1?null:t.slice(n+10)}function r(e){return e.replace(/\.md$/i,``)}function i(e,t){let n=e.split(/\r?\n/);for(let e of n){let t=/^(#{1,6})\s+(.+?)\s*$/.exec(e);if(t)return t[2].replace(/\s+#+\s*$/,``).trim()}return(t.split(`/`).pop()??t).replace(/[-_]/g,` `)}function a(e,t=160){let n=e.split(/\r?\n/),r=[],i=!1;for(let e of n){let n=e.trim();if(n.startsWith("```")){i=!i;continue}if(!i){if(!n){if(r.length)break;continue}if(!(n.startsWith(`#`)||n.startsWith(`|`)||n.startsWith(`-`)||n.startsWith(`*`)||n.startsWith(`>`)||n===`---`||n===`***`)&&(r.push(n.replace(/[*_`\[\]]/g,``)),r.join(` `).length>=t))break}}let a=r.join(` `).replace(/\s+/g,` `).trim();return a?a.length<=t?a:`${a.slice(0,t-1).trimEnd()}…`:``}function o(e,t){let n=/\|\s*調査日\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|/.exec(e);if(n)return n[1];let r=/(?:調査日|日付|date)\s*[:：]\s*(\d{4}-\d{2}-\d{2})/i.exec(e);return r?r[1]:/(\d{4}-\d{2}-\d{2})/.exec(t)?.[1]??``}function s(e){let t=[];for(let[s,c]of Object.entries(e)){let e=n(s);if(!e||!e.endsWith(`.md`)||e.toLowerCase()===`readme.md`)continue;let l=r(e);t.push({id:l,path:e,title:i(c,l),summary:a(c),date:o(c,e),markdown:c})}return t.sort((e,t)=>e.date===t.date?e.id.localeCompare(t.id):t.date.localeCompare(e.date))}function c(e,t){let n=t.trim().toLowerCase();return n?e.filter(e=>`${e.title}\n${e.summary}\n${e.path}\n${e.id}`.toLowerCase().includes(n)):[...e]}function l(e,t){return e.find(e=>e.id===t)}var u=s(Object.assign({"../../../../research/2026-07-23-llm-agent-execution-harness.md":e,"../../../../research/README.md":t}));function d(e){let t=(e.startsWith(`#`)?e.slice(1):e).replace(/^\/+/,``);if(!t)return{view:`list`,query:``};let[n,r=``]=t.split(`?`),i=new URLSearchParams(r);if(n===``||n===`list`)return{view:`list`,query:i.get(`q`)??``};if(n.startsWith(`r/`)){let e=decodeURIComponent(n.slice(2));if(e)return{view:`report`,id:e}}return{view:`list`,query:``}}function ee(e){if(e.view===`report`)return`#/r/${encodeURIComponent(e.id)}`;let t=new URLSearchParams;e.query&&t.set(`q`,e.query);let n=t.toString();return n?`#/list?${n}`:`#/list`}function f(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}function te(e){let t=e.reports.map(e=>`
        <a class="report-card" href="${ee({view:`report`,id:e.id})}">
          <div class="report-card__meta">
            <span class="tag">research</span>
            ${e.date?`<time datetime="${f(e.date)}">${f(e.date)}</time>`:``}
          </div>
          <h2 class="report-card__title">${f(e.title)}</h2>
          <p class="report-card__summary">${f(e.summary||`（要約なし）`)}</p>
          <p class="report-card__path"><code>${f(e.path)}</code></p>
        </a>`).join(``);return`
    <section class="list">
      <div class="toolbar">
        <label class="search">
          <span class="sr-only">検索</span>
          <input
            id="report-search"
            type="search"
            placeholder="タイトル・本文要約・パスで検索"
            value="${f(e.query)}"
          />
        </label>
      </div>
      <p class="list-count">${e.reports.length} / ${e.totalCount} 件</p>
      <div class="report-grid">
        ${t||`<p class="empty">該当するレポートがありません。</p>`}
      </div>
    </section>
  `}function ne(e,t){let n=e.trim().toLowerCase().replace(/[^\w\u00C0-\u024F\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF\s-]/g,``).replace(/\s+/g,`-`).replace(/-+/g,`-`).replace(/^-|-$/g,``)||`section`,r=(t.get(n)??0)+1;return t.set(n,r),r===1?n:`${n}-${r}`}function p(e){let t=[],n=new Map,r=!1;for(let i of e.split(/\r?\n/)){let e=i.trimEnd();if(e.trimStart().startsWith("```")){r=!r;continue}if(r)continue;let a=/^(#{1,3})\s+(.+?)\s*$/.exec(e);if(!a)continue;let o=a[1].length,s=a[2].replace(/\s+#+\s*$/,``).trim(),c=ne(s,n);t.push({id:c,text:s,level:o})}return t}function re(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function ie(e){if(Array.isArray(e))return e}function m(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t!==0)for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function h(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function g(e,t){return ie(e)||m(e,t)||_(e,t)||h()}function _(e,t){if(e){if(typeof e==`string`)return re(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?re(e,t):void 0}}var ae=Object.entries,oe=Object.setPrototypeOf,se=Object.isFrozen,ce=Object.getPrototypeOf,le=Object.getOwnPropertyDescriptor,v=Object.freeze,y=Object.seal,ue=Object.create,b=typeof Reflect<`u`&&Reflect,de=b.apply,fe=b.construct;v||=function(e){return e},y||=function(e){return e},de||=function(e,t){var n=[...arguments].slice(2);return e.apply(t,n)},fe||=function(e){return new e(...[...arguments].slice(1))};var pe=w(Array.prototype.forEach),me=w(Array.prototype.lastIndexOf),he=w(Array.prototype.pop),ge=w(Array.prototype.push),_e=w(Array.prototype.splice),x=Array.isArray,ve=w(String.prototype.toLowerCase),ye=w(String.prototype.toString),be=w(String.prototype.match),xe=w(String.prototype.replace),Se=w(String.prototype.indexOf),Ce=w(String.prototype.trim),we=w(Number.prototype.toString),Te=w(Boolean.prototype.toString),Ee=typeof BigInt>`u`?null:w(BigInt.prototype.toString),De=typeof Symbol>`u`?null:w(Symbol.prototype.toString),S=w(Object.prototype.hasOwnProperty),Oe=w(Object.prototype.toString),C=w(RegExp.prototype.test),ke=T(TypeError);function w(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);var n=[...arguments].slice(1);return de(e,t,n)}}function T(e){return function(){return fe(e,[...arguments])}}function E(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ve;if(oe&&oe(e,null),!x(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i==`string`){let e=n(i);e!==i&&(se(t)||(t[r]=e),i=e)}e[i]=!0}return e}function Ae(e){for(let t=0;t<e.length;t++)S(e,t)||(e[t]=null);return e}function D(e){let t=ue(null);for(let r of ae(e)){var n=g(r,2);let i=n[0],a=n[1];S(e,i)&&(x(a)?t[i]=Ae(a):a&&typeof a==`object`&&a.constructor===Object?t[i]=D(a):t[i]=a)}return t}function je(e){switch(typeof e){case`string`:return e;case`number`:return we(e);case`boolean`:return Te(e);case`bigint`:return Ee?Ee(e):`0`;case`symbol`:return De?De(e):`Symbol()`;case`undefined`:return Oe(e);case`function`:case`object`:{if(e===null)return Oe(e);let t=e,n=O(t,`toString`);if(typeof n==`function`){let e=n(t);return typeof e==`string`?e:Oe(e)}return Oe(e)}default:return Oe(e)}}function O(e,t){for(;e!==null;){let n=le(e,t);if(n){if(n.get)return w(n.get);if(typeof n.value==`function`)return w(n.value)}e=ce(e)}function n(){return null}return n}function Me(e){try{return C(e,``),!0}catch{return!1}}var Ne=v(`a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr`.split(`.`)),Pe=v(`svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern`.split(`.`)),Fe=v([`feBlend`,`feColorMatrix`,`feComponentTransfer`,`feComposite`,`feConvolveMatrix`,`feDiffuseLighting`,`feDisplacementMap`,`feDistantLight`,`feDropShadow`,`feFlood`,`feFuncA`,`feFuncB`,`feFuncG`,`feFuncR`,`feGaussianBlur`,`feImage`,`feMerge`,`feMergeNode`,`feMorphology`,`feOffset`,`fePointLight`,`feSpecularLighting`,`feSpotLight`,`feTile`,`feTurbulence`]),Ie=v([`animate`,`color-profile`,`cursor`,`discard`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`foreignobject`,`hatch`,`hatchpath`,`mesh`,`meshgradient`,`meshpatch`,`meshrow`,`missing-glyph`,`script`,`set`,`solidcolor`,`unknown`,`use`]),Le=v(`math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts`.split(`.`)),Re=v([`maction`,`maligngroup`,`malignmark`,`mlongdiv`,`mscarries`,`mscarry`,`msgroup`,`mstack`,`msline`,`msrow`,`semantics`,`annotation`,`annotation-xml`,`mprescripts`,`none`]),ze=v([`#text`]),Be=v(`accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns`.split(`.`)),Ve=v(`accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan`.split(`.`)),He=v(`accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns`.split(`.`)),Ue=v([`xlink:href`,`xml:id`,`xlink:title`,`xml:space`,`xmlns:xlink`]),We=y(/{{[\w\W]*|^[\w\W]*}}/g),Ge=y(/<%[\w\W]*|^[\w\W]*%>/g),Ke=y(/\${[\w\W]*/g),qe=y(/^data-[\-\w.\u00B7-\uFFFF]+$/),Je=y(/^aria-[\-\w]+$/),Ye=y(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Xe=y(/^(?:\w+script|data):/i),Ze=y(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Qe=y(/^html$/i),$e=y(/^[a-z][.\w]*(-[.\w]+)+$/i),et=y(/<[/\w!]/g),tt=y(/<[/\w]/g),nt=y(/<\/no(script|embed|frames)/i),rt=y(/\/>/i),k={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},it=function(){return typeof window>`u`?null:window},at=function(e,t){if(typeof e!=`object`||typeof e.createPolicy!=`function`)return null;let n=null,r=`data-tt-policy-suffix`;t&&t.hasAttribute(r)&&(n=t.getAttribute(r));let i=`dompurify`+(n?`#`+n:``);try{return e.createPolicy(i,{createHTML(e){return e},createScriptURL(e){return e}})}catch{return console.warn(`TrustedTypes policy `+i+` could not be created.`),null}},ot=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},A=function(e,t,n,r){return S(e,t)&&x(e[t])?E(r.base?D(r.base):{},e[t],r.transform):n};function st(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:it(),t=e=>st(e);if(t.version=`3.4.12`,t.removed=[],!e||!e.document||e.document.nodeType!==k.document||!e.Element)return t.isSupported=!1,t;let n=e.document,r=n,i=r.currentScript;e.DocumentFragment;let a=e.HTMLTemplateElement,o=e.Node,s=e.Element,c=e.NodeFilter;e.NamedNodeMap===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;let l=e.DOMParser,u=e.trustedTypes,d=s.prototype,ee=O(d,`cloneNode`),f=O(d,`remove`),te=O(d,`nextSibling`),ne=O(d,`childNodes`),p=O(d,`parentNode`),re=O(d,`shadowRoot`),ie=O(d,`attributes`),m=o&&o.prototype?O(o.prototype,`nodeType`):null,h=o&&o.prototype?O(o.prototype,`nodeName`):null;if(typeof a==`function`){let e=n.createElement(`template`);e.content&&e.content.ownerDocument&&(n=e.content.ownerDocument)}let g,_=``,oe,se=!1,ce=0,le=function(){if(ce>0)throw ke(`A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.`)},b=function(e){le(),ce++;try{return g.createHTML(e)}finally{ce--}},de=function(e){le(),ce++;try{return g.createScriptURL(e)}finally{ce--}},fe=function(){return se||=(oe=at(u,i),!0),oe},we=n,Te=we.implementation,Ee=we.createNodeIterator,De=we.createDocumentFragment,Oe=we.getElementsByTagName,w=r.importNode,T=ot();t.isSupported=typeof ae==`function`&&typeof p==`function`&&Te&&Te.createHTMLDocument!==void 0;let Ae=We,ct=Ge,lt=Ke,ut=qe,dt=Je,ft=Xe,j=Ze,M=$e,pt=Ye,N=null,mt=E({},[...Ne,...Pe,...Fe,...Le,...ze]),P=null,ht=E({},[...Be,...Ve,...He,...Ue]),F=Object.seal(ue(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),gt=null,_t=null,I=Object.seal(ue(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),vt=!0,yt=!0,bt=!1,xt=!0,L=!1,R=!0,St=!1,Ct=!1,wt=null,Tt=null,Et=!1,Dt=!1,Ot=!1,kt=!1,At=!0,jt=!1,Mt=`user-content-`,Nt=!0,Pt=!1,z={},B=null,V=E({},`annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp`.split(`.`)),Ft=null,It=E({},[`audio`,`video`,`img`,`source`,`image`,`track`]),Lt=null,Rt=E({},[`alt`,`class`,`for`,`id`,`label`,`name`,`pattern`,`placeholder`,`role`,`summary`,`title`,`value`,`style`,`xmlns`]),zt=`http://www.w3.org/1998/Math/MathML`,Bt=`http://www.w3.org/2000/svg`,H=`http://www.w3.org/1999/xhtml`,U=H,Vt=!1,Ht=null,Ut=E({},[zt,Bt,H],ye),Wt=v([`mi`,`mo`,`mn`,`ms`,`mtext`]),Gt=E({},Wt),Kt=v([`annotation-xml`]),qt=E({},Kt),Jt=E({},[`title`,`style`,`font`,`a`,`script`]),Yt=null,Xt=[`application/xhtml+xml`,`text/html`],W=null,Zt=null,Qt=n.createElement(`form`),$t=function(e){return e instanceof RegExp||e instanceof Function},en=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(Zt&&Zt===e)return;(!e||typeof e!=`object`)&&(e={}),e=D(e),Yt=Xt.indexOf(e.PARSER_MEDIA_TYPE)===-1?`text/html`:e.PARSER_MEDIA_TYPE,W=Yt===`application/xhtml+xml`?ye:ve,N=A(e,`ALLOWED_TAGS`,mt,{transform:W}),P=A(e,`ALLOWED_ATTR`,ht,{transform:W}),Ht=A(e,`ALLOWED_NAMESPACES`,Ut,{transform:ye}),Lt=A(e,`ADD_URI_SAFE_ATTR`,Rt,{transform:W,base:Rt}),Ft=A(e,`ADD_DATA_URI_TAGS`,It,{transform:W,base:It}),B=A(e,`FORBID_CONTENTS`,V,{transform:W}),gt=A(e,`FORBID_TAGS`,D({}),{transform:W}),_t=A(e,`FORBID_ATTR`,D({}),{transform:W}),z=S(e,`USE_PROFILES`)?e.USE_PROFILES&&typeof e.USE_PROFILES==`object`?D(e.USE_PROFILES):e.USE_PROFILES:!1,vt=e.ALLOW_ARIA_ATTR!==!1,yt=e.ALLOW_DATA_ATTR!==!1,bt=e.ALLOW_UNKNOWN_PROTOCOLS||!1,xt=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,L=e.SAFE_FOR_TEMPLATES||!1,R=e.SAFE_FOR_XML!==!1,St=e.WHOLE_DOCUMENT||!1,Dt=e.RETURN_DOM||!1,Ot=e.RETURN_DOM_FRAGMENT||!1,kt=e.RETURN_TRUSTED_TYPE||!1,Et=e.FORCE_BODY||!1,At=e.SANITIZE_DOM!==!1,jt=e.SANITIZE_NAMED_PROPS||!1,Nt=e.KEEP_CONTENT!==!1,Pt=e.IN_PLACE||!1,pt=Me(e.ALLOWED_URI_REGEXP)?e.ALLOWED_URI_REGEXP:Ye,U=typeof e.NAMESPACE==`string`?e.NAMESPACE:H,Gt=S(e,`MATHML_TEXT_INTEGRATION_POINTS`)&&e.MATHML_TEXT_INTEGRATION_POINTS&&typeof e.MATHML_TEXT_INTEGRATION_POINTS==`object`?D(e.MATHML_TEXT_INTEGRATION_POINTS):E({},Wt),qt=S(e,`HTML_INTEGRATION_POINTS`)&&e.HTML_INTEGRATION_POINTS&&typeof e.HTML_INTEGRATION_POINTS==`object`?D(e.HTML_INTEGRATION_POINTS):E({},Kt);let t=S(e,`CUSTOM_ELEMENT_HANDLING`)&&e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING==`object`?D(e.CUSTOM_ELEMENT_HANDLING):ue(null);if(F=ue(null),S(t,`tagNameCheck`)&&$t(t.tagNameCheck)&&(F.tagNameCheck=t.tagNameCheck),S(t,`attributeNameCheck`)&&$t(t.attributeNameCheck)&&(F.attributeNameCheck=t.attributeNameCheck),S(t,`allowCustomizedBuiltInElements`)&&typeof t.allowCustomizedBuiltInElements==`boolean`&&(F.allowCustomizedBuiltInElements=t.allowCustomizedBuiltInElements),y(F),L&&(yt=!1),Ot&&(Dt=!0),z&&(N=E({},ze),P=ue(null),z.html===!0&&(E(N,Ne),E(P,Be)),z.svg===!0&&(E(N,Pe),E(P,Ve),E(P,Ue)),z.svgFilters===!0&&(E(N,Fe),E(P,Ve),E(P,Ue)),z.mathMl===!0&&(E(N,Le),E(P,He),E(P,Ue))),I.tagCheck=null,I.attributeCheck=null,S(e,`ADD_TAGS`)&&(typeof e.ADD_TAGS==`function`?I.tagCheck=e.ADD_TAGS:x(e.ADD_TAGS)&&(N===mt&&(N=D(N)),E(N,e.ADD_TAGS,W))),S(e,`ADD_ATTR`)&&(typeof e.ADD_ATTR==`function`?I.attributeCheck=e.ADD_ATTR:x(e.ADD_ATTR)&&(P===ht&&(P=D(P)),E(P,e.ADD_ATTR,W))),S(e,`ADD_URI_SAFE_ATTR`)&&x(e.ADD_URI_SAFE_ATTR)&&E(Lt,e.ADD_URI_SAFE_ATTR,W),S(e,`FORBID_CONTENTS`)&&x(e.FORBID_CONTENTS)&&(B===V&&(B=D(B)),E(B,e.FORBID_CONTENTS,W)),S(e,`ADD_FORBID_CONTENTS`)&&x(e.ADD_FORBID_CONTENTS)&&(B===V&&(B=D(B)),E(B,e.ADD_FORBID_CONTENTS,W)),Nt&&(N[`#text`]=!0),St&&E(N,[`html`,`head`,`body`]),N.table&&(E(N,[`tbody`]),delete gt.tbody),e.TRUSTED_TYPES_POLICY){if(typeof e.TRUSTED_TYPES_POLICY.createHTML!=`function`)throw ke(`TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.`);if(typeof e.TRUSTED_TYPES_POLICY.createScriptURL!=`function`)throw ke(`TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.`);let t=g;g=e.TRUSTED_TYPES_POLICY;try{_=b(``)}catch(e){throw g=t,e}}else e.TRUSTED_TYPES_POLICY===null?(g=void 0,_=``):(g===void 0&&(g=fe()),g&&typeof _==`string`&&(_=b(``)));v&&v(e),Zt=e},tn=E({},[...Pe,...Fe,...Ie]),nn=E({},[...Le,...Re]),rn=function(e,t,n){return t.namespaceURI===H?e===`svg`:t.namespaceURI===zt?e===`svg`&&(n===`annotation-xml`||Gt[n]):!!tn[e]},an=function(e,t,n){return t.namespaceURI===H?e===`math`:t.namespaceURI===Bt?e===`math`&&qt[n]:!!nn[e]},on=function(e,t,n){return t.namespaceURI===Bt&&!qt[n]||t.namespaceURI===zt&&!Gt[n]?!1:!nn[e]&&(Jt[e]||!tn[e])},sn=function(e){let t=p(e);(!t||!t.tagName)&&(t={namespaceURI:U,tagName:`template`});let n=ve(e.tagName),r=ve(t.tagName);return Ht[e.namespaceURI]?e.namespaceURI===Bt?rn(n,t,r):e.namespaceURI===zt?an(n,t,r):e.namespaceURI===H?on(n,t,r):!!(Yt===`application/xhtml+xml`&&Ht[e.namespaceURI]):!1},G=function(e){ge(t.removed,{element:e});try{p(e).removeChild(e)}catch{if(f(e),!p(e))throw ke(`a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place`)}},K=function(e){ln(e);let t=ne(e);if(t){let e=[];pe(t,t=>{ge(e,t)}),pe(e,e=>{try{f(e)}catch{}})}let n=ie(e);if(n)for(let t=n.length-1;t>=0;--t){let r=n[t],i=r&&r.name;if(typeof i==`string`)try{e.removeAttribute(i)}catch{}}},q=function(e,n){try{ge(t.removed,{attribute:n.getAttributeNode(e),from:n})}catch{ge(t.removed,{attribute:null,from:n})}if(n.removeAttribute(e),e===`is`)if(Dt||Ot)try{G(n)}catch{}else try{n.setAttribute(e,``)}catch{}},cn=function(e){let t=ie(e);if(t)for(let n=t.length-1;n>=0;--n){let r=t[n],i=r&&r.name;if(!(typeof i!=`string`||P[W(i)]))try{e.removeAttribute(i)}catch{}}},ln=function(e){let t=[e];for(;t.length>0;){let e=t.pop();(m?m(e):e.nodeType)===k.element&&cn(e);let n=ne(e);if(n)for(let e=n.length-1;e>=0;--e)t.push(n[e])}},J=function(e){if(!R)return;let t=[e];for(;t.length>0;){let e=t.pop(),n=m?m(e):e.nodeType;if(n===k.processingInstruction||n===k.comment&&C(tt,e.data)){try{f(e)}catch{}continue}if(n===k.element){let t=e,n=W(h?h(e):e.nodeName);try{t.hasAttribute&&t.hasAttribute(`patchsrc`)&&t.removeAttribute(`patchsrc`),t.hasAttribute&&t.hasAttribute(`for`)&&n!==`label`&&n!==`output`&&t.removeAttribute(`for`)}catch{}}let r=ne(e);if(r)for(let e=r.length-1;e>=0;--e)t.push(r[e])}},un=function(e){let t=null,r=null;if(Et)e=`<remove></remove>`+e;else{let t=be(e,/^[\r\n\t ]+/);r=t&&t[0]}Yt===`application/xhtml+xml`&&U===H&&(e=`<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>`+e+`</body></html>`);let i=g?b(e):e;if(U===H)try{t=new l().parseFromString(i,Yt)}catch{}if(!t||!t.documentElement){t=Te.createDocument(U,`template`,null);try{t.documentElement.innerHTML=Vt?_:i}catch{}}let a=t.body||t.documentElement;return e&&r&&a.insertBefore(n.createTextNode(r),a.childNodes[0]||null),U===H?Oe.call(t,St?`html`:`body`)[0]:St?t.documentElement:a},dn=function(e){return Ee.call(e.ownerDocument||e,e,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},Y=function(e){return e=xe(e,Ae,` `),e=xe(e,ct,` `),e=xe(e,lt,` `),e},fn=function(e){e.normalize();let t=Ee.call(e.ownerDocument||e,e,c.SHOW_TEXT|c.SHOW_COMMENT|c.SHOW_CDATA_SECTION|c.SHOW_PROCESSING_INSTRUCTION,null),n=t.nextNode();for(;n;)n.data=Y(n.data),n=t.nextNode();let r=e.querySelectorAll?.call(e,`template`);r&&pe(r,e=>{mn(e.content)&&fn(e.content)})},pn=function(e){let t=h?h(e):null;return typeof t!=`string`||W(t)!==`form`?!1:typeof e.nodeName!=`string`||typeof e.textContent!=`string`||typeof e.removeChild!=`function`||e.attributes!==ie(e)||typeof e.removeAttribute!=`function`||typeof e.setAttribute!=`function`||typeof e.namespaceURI!=`string`||typeof e.insertBefore!=`function`||typeof e.hasChildNodes!=`function`||e.nodeType!==m(e)||e.childNodes!==ne(e)},mn=function(e){if(!m||typeof e!=`object`||!e)return!1;try{return m(e)===k.documentFragment}catch{return!1}},hn=function(e){if(!m||typeof e!=`object`||!e)return!1;try{return typeof m(e)==`number`}catch{return!1}};function X(e,n,r){e.length!==0&&pe(e,e=>{e.call(t,n,r,Zt)})}let gn=function(e,t){return!!(R&&e.hasChildNodes()&&!hn(e.firstElementChild)&&C(et,e.textContent)&&C(et,e.innerHTML)||R&&e.namespaceURI===H&&t===`style`&&hn(e.firstElementChild)||e.nodeType===k.processingInstruction||R&&e.nodeType===k.comment&&C(tt,e.data))},Z=function(e,t){if(!gt[t]&&yn(t)&&(F.tagNameCheck instanceof RegExp&&C(F.tagNameCheck,t)||F.tagNameCheck instanceof Function&&F.tagNameCheck(t)))return!1;if(Nt&&!B[t]){let t=p(e),n=ne(e);if(n&&t){let r=n.length;for(let i=r-1;i>=0;--i){let r=Pt?n[i]:ee(n[i],!0);t.insertBefore(r,te(e))}}}return G(e),!0},_n=function(e,n){if(X(T.beforeSanitizeElements,e,null),e!==n&&p(e)===null)return!0;if(pn(e))return G(e),!0;let r=W(h?h(e):e.nodeName);if(X(T.uponSanitizeElement,e,{tagName:r,allowedTags:N}),e!==n&&p(e)===null)return!0;if(gn(e,r))return G(e),!0;if(gt[r]||!(I.tagCheck instanceof Function&&I.tagCheck(r))&&!N[r]){let t=Z(e,r);return t===!1&&X(T.afterSanitizeElements,e,null),t}if((m?m(e):e.nodeType)===k.element&&!sn(e)||(r===`noscript`||r===`noembed`||r===`noframes`)&&C(nt,e.innerHTML))return G(e),!0;if(L&&e.nodeType===k.text){let n=Y(e.textContent);e.textContent!==n&&(ge(t.removed,{element:e.cloneNode()}),e.textContent=n)}return X(T.afterSanitizeElements,e,null),!1},vn=function(e,t,r){if(_t[t]||R&&t===`patchsrc`||R&&t===`for`&&e!==`label`&&e!==`output`||At&&(t===`id`||t===`name`)&&(r in n||r in Qt))return!1;let i=P[t]||I.attributeCheck instanceof Function&&I.attributeCheck(t,e);if(!(yt&&C(ut,t))&&!(vt&&C(dt,t))){if(!i){if(!(yn(e)&&(F.tagNameCheck instanceof RegExp&&C(F.tagNameCheck,e)||F.tagNameCheck instanceof Function&&F.tagNameCheck(e))&&(F.attributeNameCheck instanceof RegExp&&C(F.attributeNameCheck,t)||F.attributeNameCheck instanceof Function&&F.attributeNameCheck(t,e))||t===`is`&&F.allowCustomizedBuiltInElements&&(F.tagNameCheck instanceof RegExp&&C(F.tagNameCheck,r)||F.tagNameCheck instanceof Function&&F.tagNameCheck(r))))return!1}else if(!Lt[t]&&!C(pt,xe(r,j,``))&&!((t===`src`||t===`xlink:href`||t===`href`)&&e!==`script`&&Se(r,`data:`)===0&&Ft[e])&&!(bt&&!C(ft,xe(r,j,``)))&&r)return!1}return!0},Q=E({},[`annotation-xml`,`color-profile`,`font-face`,`font-face-format`,`font-face-name`,`font-face-src`,`font-face-uri`,`missing-glyph`]),yn=function(e){return!Q[ve(e)]&&C(M,e)},bn=function(e,t,n,r){if(g&&typeof u==`object`&&typeof u.getAttributeType==`function`&&!n)switch(u.getAttributeType(e,t)){case`TrustedHTML`:return b(r);case`TrustedScriptURL`:return de(r)}return r},xn=function(e,n,r,i){try{r?e.setAttributeNS(r,n,i):e.setAttribute(n,i),pn(e)?G(e):he(t.removed)}catch{q(n,e)}},$=function(e){X(T.beforeSanitizeAttributes,e,null);let t=e.attributes;if(!t||pn(e))return;let n={attrName:``,attrValue:``,keepAttr:!0,allowedAttributes:P,forceKeepAttr:void 0},r=t.length,i=W(e.nodeName);for(;r--;){let a=t[r],o=a.name,s=a.namespaceURI,c=a.value,l=W(o),u=c,d=o===`value`?u:Ce(u);if(n.attrName=l,n.attrValue=d,n.keepAttr=!0,n.forceKeepAttr=void 0,X(T.uponSanitizeAttribute,e,n),d=n.attrValue,jt&&(l===`id`||l===`name`)&&Se(d,Mt)!==0&&(q(o,e),d=Mt+d),R&&C(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,d)){q(o,e);continue}if(l===`attributename`&&be(d,`href`)){q(o,e);continue}if(!n.forceKeepAttr){if(!n.keepAttr){q(o,e);continue}if(!xt&&C(rt,d)){q(o,e);continue}if(L&&(d=Y(d)),!vn(i,l,d)){q(o,e);continue}d=bn(i,l,s,d),d!==u&&xn(e,o,s,d)}}X(T.afterSanitizeAttributes,e,null)},Sn=function(e){let t=null,n=dn(e);for(X(T.beforeSanitizeShadowDOM,e,null);t=n.nextNode();)if(X(T.uponSanitizeShadowNode,t,null),_n(t,e),$(t),mn(t.content)&&Sn(t.content),(m?m(t):t.nodeType)===k.element){let e=re(t);mn(e)&&(Cn(e),Sn(e))}X(T.afterSanitizeShadowDOM,e,null)},Cn=function(e){let t=[{node:e,shadow:null}];for(;t.length>0;){let e=t.pop();if(e.shadow){Sn(e.shadow);continue}let n=e.node,r=(m?m(n):n.nodeType)===k.element,i=ne(n);if(i)for(let e=i.length-1;e>=0;--e)t.push({node:i[e],shadow:null});if(r){let e=h?h(n):null;if(typeof e==`string`&&W(e)===`template`){let e=n.content;mn(e)&&t.push({node:e,shadow:null})}}if(r){let e=re(n);mn(e)&&t.push({node:null,shadow:e},{node:e,shadow:null})}}};return t.sanitize=function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=null,a=null,o=null,s=null;if(Vt=!e,Vt&&(e=`<!-->`),typeof e!=`string`&&!hn(e)&&(e=je(e),typeof e!=`string`))throw ke(`dirty is not a string, aborting`);if(!t.isSupported)return e;Ct?(N=wt,P=Tt):en(n),(T.uponSanitizeElement.length>0||T.uponSanitizeAttribute.length>0)&&(N=D(N)),T.uponSanitizeAttribute.length>0&&(P=D(P)),t.removed=[];let c=Pt&&typeof e!=`string`&&hn(e);if(c){J(e);let t=h?h(e):e.nodeName;if(typeof t==`string`){let n=W(t);if(!N[n]||gt[n])throw K(e),ke(`root node is forbidden and cannot be sanitized in-place`)}if(pn(e))throw K(e),ke(`root node is clobbered and cannot be sanitized in-place`);try{Cn(e)}catch(t){throw K(e),t}}else if(hn(e))i=un(`<!---->`),a=i.ownerDocument.importNode(e,!0),a.nodeType===k.element&&a.nodeName===`BODY`||a.nodeName===`HTML`?i=a:i.appendChild(a),Cn(a);else{if(!Dt&&!L&&!St&&e.indexOf(`<`)===-1)return g&&kt?b(e):e;if(i=un(e),!i)return Dt?null:kt?_:``}i&&Et&&G(i.firstChild);let l=c?e:i,u=dn(l);try{for(;o=u.nextNode();)_n(o,l),$(o),mn(o.content)&&Sn(o.content)}catch(n){throw c&&(K(e),pe(t.removed,e=>{e.element&&ln(e.element)})),n}if(c)return pe(t.removed,e=>{e.element&&ln(e.element)}),L&&fn(e),e;if(Dt){if(L&&fn(i),Ot)for(s=De.call(i.ownerDocument);i.firstChild;)s.appendChild(i.firstChild);else s=i;return(P.shadowroot||P.shadowrootmode)&&(s=w.call(r,s,!0)),s}let d=St?i.outerHTML:i.innerHTML;return St&&N[`!doctype`]&&i.ownerDocument&&i.ownerDocument.doctype&&i.ownerDocument.doctype.name&&C(Qe,i.ownerDocument.doctype.name)&&(d=`<!DOCTYPE `+i.ownerDocument.doctype.name+`>
`+d),L&&(d=Y(d)),g&&kt?b(d):d},t.setConfig=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};en(e),Ct=!0,wt=N,Tt=P},t.clearConfig=function(){Zt=null,Ct=!1,wt=null,Tt=null,g=oe,_=``},t.isValidAttribute=function(e,t,n){Zt||en({});let r=W(e),i=W(t);return vn(r,i,n)},t.addHook=function(e,t){typeof t==`function`&&S(T,e)&&ge(T[e],t)},t.removeHook=function(e,t){if(S(T,e)){if(t!==void 0){let n=me(T[e],t);return n===-1?void 0:_e(T[e],n,1)[0]}return he(T[e])}},t.removeHooks=function(e){S(T,e)&&(T[e]=[])},t.removeAllHooks=function(){T=ot()},t}var ct=st();function lt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ut=lt();function dt(e){ut=e}var ft={exec:()=>null};function j(e){let t=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),i=t[r];return i||(i=e(r),t[r]=i),i}}function M(e,t=``){let n=typeof e==`string`?e:e.source,r={replace:(e,t)=>{let i=typeof t==`string`?t:t.source;return i=i.replace(N.caret,`$1`),n=n.replace(e,i),r},getRegex:()=>new RegExp(n,t)};return r}var pt=((e=``)=>{try{return!!RegExp(`(?<=1)(?<!1)`+e)}catch{return!1}})(),N={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:j(e=>RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:j(e=>RegExp(`^ {0,${e}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),fencesBeginRegex:j(e=>RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),headingBeginRegex:j(e=>RegExp(`^ {0,${e}}#`)),htmlBeginRegex:j(e=>RegExp(`^ {0,${e}}<(?:[a-z].*>|!--)`,`i`)),blockquoteBeginRegex:j(e=>RegExp(`^ {0,${e}}>`))},mt=/^(?:[ \t]*(?:\n|$))+/,P=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ht=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,F=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,gt=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,_t=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,I=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,vt=M(I).replace(/bull/g,_t).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,``).getRegex(),yt=M(I).replace(/bull/g,_t).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),bt=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,xt=/^[^\n]+/,L=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,R=M(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace(`label`,L).replace(`title`,/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),St=M(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,_t).getRegex(),Ct=`address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul`,wt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Tt=M(`^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))`,`i`).replace(`comment`,wt).replace(`tag`,Ct).replace(`attribute`,/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Et=e=>M(bt).replace(`hr`,F).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace(`list`,e).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,Ct).getRegex(),Dt=Et(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),Ot=Et(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),kt={blockquote:M(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace(`paragraph`,Ot).getRegex(),code:P,def:R,fences:ht,heading:gt,hr:F,html:Tt,lheading:vt,list:St,newline:mt,paragraph:Dt,table:ft,text:xt},At=M(`^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)`).replace(`hr`,F).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`blockquote`,` {0,3}>`).replace(`code`,`(?: {4}| {0,3}	)[^\\n]`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)])[ \\t]`).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,Ct).getRegex(),jt={...kt,lheading:yt,table:At,paragraph:M(bt).replace(`hr`,F).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`table`,At).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]`).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,Ct).getRegex()},Mt={...kt,html:M(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace(`comment`,wt).replace(/tag/g,`(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b`).getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ft,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:M(bt).replace(`hr`,F).replace(`heading`,` *#{1,6} *[^
]`).replace(`lheading`,vt).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`|fences`,``).replace(`|list`,``).replace(`|html`,``).replace(`|tag`,``).getRegex()},Nt=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Pt=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,z=/^( {2,}|\\)\n(?!\s*$)/,B=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,V=/[\p{P}\p{S}]/u,Ft=/[\s\p{P}\p{S}]/u,It=/[^\s\p{P}\p{S}]/u,Lt=M(/^((?![*_])punctSpace)/,`u`).replace(/punctSpace/g,Ft).getRegex(),Rt=/(?!~)[\p{P}\p{S}]/u,zt=/(?!~)[\s\p{P}\p{S}]/u,Bt=/(?:[^\s\p{P}\p{S}]|~)/u,H=M(/link|precode-code|html/,`g`).replace(`link`,/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace(`precode-`,pt?"(?<!`)()":"(^^|[^`])").replace(`code`,/(?<b>`+)[^`]+\k<b>(?!`)/).replace(`html`,/<(?! )[^<>]*?>/).getRegex(),U=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Vt=M(U,`u`).replace(/punct/g,V).getRegex(),Ht=M(U,`u`).replace(/punct/g,Rt).getRegex(),Ut=`^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)`,Wt=M(Ut,`gu`).replace(/notPunctSpace/g,It).replace(/punctSpace/g,Ft).replace(/punct/g,V).getRegex(),Gt=M(Ut,`gu`).replace(/notPunctSpace/g,Bt).replace(/punctSpace/g,zt).replace(/punct/g,Rt).getRegex(),Kt=M(`^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)`,`gu`).replace(/notPunctSpace/g,It).replace(/punctSpace/g,Ft).replace(/punct/g,V).getRegex(),qt=M(/^~~?(?:((?!~)punct)|[^\s~])/,`u`).replace(/punct/g,V).getRegex(),Jt=M(`^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)`,`gu`).replace(/notPunctSpace/g,It).replace(/punctSpace/g,Ft).replace(/punct/g,V).getRegex(),Yt=M(/\\(punct)/,`gu`).replace(/punct/g,V).getRegex(),Xt=M(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace(`scheme`,/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace(`email`,/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),W=M(wt).replace(`(?:-->|$)`,`-->`).getRegex(),Zt=M(`^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>`).replace(`comment`,W).replace(`attribute`,/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Qt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,$t=M(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace(`label`,Qt).replace(`href`,/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace(`title`,/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),en=M(/^!?\[(label)\]\[(ref)\]/).replace(`label`,Qt).replace(`ref`,L).getRegex(),tn=M(/^!?\[(ref)\](?:\[\])?/).replace(`ref`,L).getRegex(),nn=M(`reflink|nolink(?!\\()`,`g`).replace(`reflink`,en).replace(`nolink`,tn).getRegex(),rn=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,an={_backpedal:ft,anyPunctuation:Yt,autolink:Xt,blockSkip:H,br:z,code:Pt,del:ft,delLDelim:ft,delRDelim:ft,emStrongLDelim:Vt,emStrongRDelimAst:Wt,emStrongRDelimUnd:Kt,escape:Nt,link:$t,nolink:tn,punctuation:Lt,reflink:en,reflinkSearch:nn,tag:Zt,text:B,url:ft},on={...an,link:M(/^!?\[(label)\]\((.*?)\)/).replace(`label`,Qt).getRegex(),reflink:M(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace(`label`,Qt).getRegex()},sn={...an,emStrongRDelimAst:Gt,emStrongLDelim:Ht,delLDelim:qt,delRDelim:Jt,url:M(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace(`protocol`,rn).replace(`email`,/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:M(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace(`protocol`,rn).getRegex()},G={...sn,br:M(z).replace(`{2,}`,`*`).getRegex(),text:M(sn.text).replace(`\\b_`,`\\b_| {2,}\\n`).replace(/\{2,\}/g,`*`).getRegex()},K={normal:kt,gfm:jt,pedantic:Mt},q={normal:an,gfm:sn,breaks:G,pedantic:on},cn={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`},ln=e=>cn[e];function J(e,t){if(t){if(N.escapeTest.test(e))return e.replace(N.escapeReplace,ln)}else if(N.escapeTestNoEncode.test(e))return e.replace(N.escapeReplaceNoEncode,ln);return e}function un(e){try{e=encodeURI(e).replace(N.percentDecode,`%`)}catch{return null}return e}function dn(e,t){let n=e.replace(N.findPipe,(e,t,n)=>{let r=!1,i=t;for(;--i>=0&&n[i]===`\\`;)r=!r;return r?`|`:` |`}).split(N.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push(``);for(;r<n.length;r++)n[r]=n[r].trim().replace(N.slashPipe,`|`);return n}function Y(e,t,n){let r=e.length;if(r===0)return``;let i=0;for(;i<r;){let a=e.charAt(r-i-1);if(a===t&&!n)i++;else if(a!==t&&n)i++;else break}return e.slice(0,r-i)}function fn(e){let t=e.split(`
`),n=t.length-1;for(;n>=0&&N.blankLine.test(t[n]);)n--;return t.length-n<=2?e:t.slice(0,n+1).join(`
`)}function pn(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]===`\\`)r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function mn(e,t=0){let n=t,r=``;for(let t of e)if(t===`	`){let e=4-n%4;r+=` `.repeat(e),n+=e}else r+=t,n++;return r}function hn(e,t,n,r,i){let a=t.href,o=t.title||null,s=e[1].replace(i.other.outputLinkReplace,`$1`);r.state.inLink=!0;let c={type:e[0].charAt(0)===`!`?`image`:`link`,raw:n,href:a,title:o,text:s,tokens:r.inlineTokens(s)};return r.state.inLink=!1,c}function X(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(e=>{let t=e.match(n.other.beginningSpace);if(t===null)return e;let[r]=t;return r.length>=i.length?e.slice(i.length):e}).join(`
`)}var gn=class{options;rules;lexer;constructor(e){this.options=e||ut}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:`space`,raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let e=this.options.pedantic?t[0]:fn(t[0]);return{type:`code`,raw:e,codeBlockStyle:`indented`,text:e.replace(this.rules.other.codeRemoveIndent,``)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let e=t[0],n=X(e,t[3]||``,this.rules);return{type:`code`,raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,`$1`):t[2],text:n}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(this.rules.other.endingHash.test(e)){let t=Y(e,`#`);(this.options.pedantic||!t||this.rules.other.endingSpaceChar.test(t))&&(e=t.trim())}return{type:`heading`,raw:Y(t[0],`
`),depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:`hr`,raw:Y(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let e=Y(t[0],`
`).split(`
`),n=``,r=``,i=[];for(;e.length>0;){let t=!1,a=[],o;for(o=0;o<e.length;o++)if(this.rules.other.blockquoteStart.test(e[o]))a.push(e[o]),t=!0;else if(!t)a.push(e[o]);else break;e=e.slice(o);let s=a.join(`
`),c=s.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,``);n=n?`${n}
${s}`:s,r=r?`${r}
${c}`:c;let l=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=l,e.length===0)break;let u=i.at(-1);if(u?.type===`code`)break;if(u?.type===`blockquote`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.blockquote(a);i[i.length-1]=o,n=n.substring(0,n.length-t.raw.length)+o.raw,r=r.substring(0,r.length-t.text.length)+o.text;break}else if(u?.type===`list`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.list(a);i[i.length-1]=o,n=n.substring(0,n.length-u.raw.length)+o.raw,r=r.substring(0,r.length-t.raw.length)+o.raw,e=a.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:`blockquote`,raw:n,tokens:i,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:`list`,raw:``,ordered:r,start:r?+n.slice(0,-1):``,loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:`[*+-]`);let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let n=!1,r=``,s=``;if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;r=t[0],e=e.substring(r.length);let c=mn(t[2].split(`
`,1)[0],t[1].length),l=e.split(`
`,1)[0],u=!c.trim(),d=0;if(this.options.pedantic?(d=2,s=c.trimStart()):u?d=t[1].length+1:(d=c.search(this.rules.other.nonSpaceChar),d=d>4?1:d,s=c.slice(d),d+=t[1].length),u&&this.rules.other.blankLine.test(l)&&(r+=l+`
`,e=e.substring(l.length+1),n=!0),!n){let t=this.rules.other.nextBulletRegex(d),n=this.rules.other.hrRegex(d),i=this.rules.other.fencesBeginRegex(d),a=this.rules.other.headingBeginRegex(d),o=this.rules.other.htmlBeginRegex(d),ee=this.rules.other.blockquoteBeginRegex(d);for(;e;){let f=e.split(`
`,1)[0],te;if(l=f,this.options.pedantic?(l=l.replace(this.rules.other.listReplaceNesting,`  `),te=l):te=l.replace(this.rules.other.tabCharGlobal,`    `),i.test(l)||a.test(l)||o.test(l)||ee.test(l)||t.test(l)||n.test(l))break;if(te.search(this.rules.other.nonSpaceChar)>=d||!l.trim())s+=`
`+te.slice(d);else{if(u||c.replace(this.rules.other.tabCharGlobal,`    `).search(this.rules.other.nonSpaceChar)>=4||i.test(c)||a.test(c)||n.test(c))break;s+=`
`+l}u=!l.trim(),r+=f+`
`,e=e.substring(f.length+1),c=te.slice(d)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(r)&&(o=!0)),i.items.push({type:`list_item`,raw:r,task:!!this.options.gfm&&this.rules.other.listIsTask.test(s),loose:!1,text:s,tokens:[]}),i.raw+=r}let s=i.items.at(-1);if(s)s.raw=s.raw.trimEnd(),s.text=s.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let e of i.items){this.lexer.state.top=!1,e.tokens=this.lexer.blockTokens(e.text,[]);let t=e.tokens[0];if(e.task&&(t?.type===`text`||t?.type===`paragraph`)){e.text=e.text.replace(this.rules.other.listReplaceTask,``),t.raw=t.raw.replace(this.rules.other.listReplaceTask,``),t.text=t.text.replace(this.rules.other.listReplaceTask,``);for(let e=this.lexer.inlineQueue.length-1;e>=0;e--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)){this.lexer.inlineQueue[e].src=this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask,``);break}let n=this.rules.other.listTaskCheckbox.exec(e.raw);if(n){let t={type:`checkbox`,raw:n[0]+` `,checked:n[0]!==`[ ]`};e.checked=t.checked,i.loose?e.tokens[0]&&[`paragraph`,`text`].includes(e.tokens[0].type)&&`tokens`in e.tokens[0]&&e.tokens[0].tokens?(e.tokens[0].raw=t.raw+e.tokens[0].raw,e.tokens[0].text=t.raw+e.tokens[0].text,e.tokens[0].tokens.unshift(t)):e.tokens.unshift({type:`paragraph`,raw:t.raw,text:t.raw,tokens:[t]}):e.tokens.unshift(t)}}else e.task&&=!1;if(!i.loose){let t=e.tokens.filter(e=>e.type===`space`);i.loose=t.length>0&&t.some(e=>this.rules.other.anyLine.test(e.raw))}}if(i.loose)for(let e of i.items){e.loose=!0;for(let t of e.tokens)t.type===`text`&&(t.type=`paragraph`)}return i}}html(e){let t=this.rules.block.html.exec(e);if(t){let e=fn(t[0]);return{type:`html`,block:!0,raw:e,pre:t[1]===`pre`||t[1]===`script`||t[1]===`style`,text:e}}}def(e){let t=this.rules.block.def.exec(e);if(t){let e=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal,` `),n=t[2]?t[2].replace(this.rules.other.hrefBrackets,`$1`).replace(this.rules.inline.anyPunctuation,`$1`):``,r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,`$1`):t[3];return{type:`def`,tag:e,raw:Y(t[0],`
`),href:n,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=dn(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,``).split(`|`),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,``).split(`
`):[],a={type:`table`,raw:Y(t[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let e of r)this.rules.other.tableAlignRight.test(e)?a.align.push(`right`):this.rules.other.tableAlignCenter.test(e)?a.align.push(`center`):this.rules.other.tableAlignLeft.test(e)?a.align.push(`left`):a.align.push(null);for(let e=0;e<n.length;e++)a.header.push({text:n[e],tokens:this.lexer.inline(n[e]),header:!0,align:a.align[e]});for(let e of i)a.rows.push(dn(e,a.header.length).map((e,t)=>({text:e,tokens:this.lexer.inline(e),header:!1,align:a.align[t]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let e=t[1].trim();return{type:`heading`,raw:Y(t[0],`
`),depth:t[2].charAt(0)===`=`?1:2,text:e,tokens:this.lexer.inline(e)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let e=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:`paragraph`,raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:`text`,raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:`escape`,raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:`html`,raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let e=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(e)){if(!this.rules.other.endAngleBracket.test(e))return;let t=Y(e.slice(0,-1),`\\`);if((e.length-t.length)%2==0)return}else{let e=pn(t[2],`()`);if(e===-2)return;if(e>-1){let n=(t[0].indexOf(`!`)===0?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,n).trim(),t[3]=``}}let n=t[2],r=``;if(this.options.pedantic){let e=this.rules.other.pedanticHrefTitle.exec(n);e&&(n=e[1],r=e[3])}else r=t[3]?t[3].slice(1,-1):``;return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(n=this.options.pedantic&&!this.rules.other.endAngleBracket.test(e)?n.slice(1):n.slice(1,-1)),hn(t,{href:n&&n.replace(this.rules.inline.anyPunctuation,`$1`),title:r&&r.replace(this.rules.inline.anyPunctuation,`$1`)},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let e=t[(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal,` `).toLowerCase()];if(!e){let e=n[0].charAt(0);return{type:`text`,raw:e,text:e}}return hn(n,e,n[0],this.lexer,this.rules)}}emStrong(e,t,n=``){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let n=[...r[0]].length-1,i,a,o=n,s=0,c=r[0][0]===`*`?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+n);(r=c.exec(t))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(a=[...i].length,r[3]||r[4]){o+=a;continue}else if((r[5]||r[6])&&n%3&&!((n+a)%3)){s+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+s);let t=[...r[0]][0].length,c=e.slice(0,n+r.index+t+a);if(Math.min(n,a)%2){let e=c.slice(1,-1);return{type:`em`,raw:c,text:e,tokens:this.lexer.inlineTokens(e)}}let l=c.slice(2,-2);return{type:`strong`,raw:c,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(this.rules.other.newLineCharGlobal,` `),n=this.rules.other.nonSpaceChar.test(e),r=this.rules.other.startingSpaceChar.test(e)&&this.rules.other.endingSpaceChar.test(e);return n&&r&&(e=e.substring(1,e.length-1)),{type:`codespan`,raw:t[0],text:e}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:`br`,raw:t[0]}}del(e,t,n=``){let r=this.rules.inline.delLDelim.exec(e);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let n=[...r[0]].length-1,i,a,o=n,s=this.rules.inline.delRDelim;for(s.lastIndex=0,t=t.slice(-1*e.length+n);(r=s.exec(t))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i||(a=[...i].length,a!==n))continue;if(r[3]||r[4]){o+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o);let t=[...r[0]][0].length,s=e.slice(0,n+r.index+t+a),c=s.slice(n,-n);return{type:`del`,raw:s,text:c,tokens:this.lexer.inlineTokens(c)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let e,n;return t[2]===`@`?(e=t[1],n=`mailto:`+e):(e=t[1],n=e),{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let e,n;if(t[2]===`@`)e=t[0],n=`mailto:`+e;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??``;while(r!==t[0]);e=t[0],n=t[1]===`www.`?`http://`+t[0]:t[0]}return{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let e=this.lexer.state.inRawBlock;return{type:`text`,raw:t[0],text:t[0],escaped:e}}}},Z=class e{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ut,this.options.tokenizer=this.options.tokenizer||new gn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:N,block:K.normal,inline:q.normal};this.options.pedantic?(t.block=K.pedantic,t.inline=q.pedantic):this.options.gfm&&(t.block=K.gfm,this.options.breaks?t.inline=q.breaks:t.inline=q.gfm),this.tokenizer.rules=t}static get rules(){return{block:K,inline:q}}static lex(t,n){return new e(n).lex(t)}static lexInline(t,n){return new e(n).inlineTokens(t)}lex(e){e=e.replace(N.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){let t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(N.tabCharGlobal,`    `).replace(N.spaceLine,``));let r=1/0;for(;e;){if(e.length<r)r=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let i;if(this.options.extensions?.block?.some(n=>(i=n.call({lexer:this},e,t))?(e=e.substring(i.raw.length),t.push(i),!0):!1))continue;if(i=this.tokenizer.space(e)){e=e.substring(i.raw.length);let n=t.at(-1);i.raw.length===1&&n!==void 0?n.raw+=`
`:t.push(i);continue}if(i=this.tokenizer.code(e)){e=e.substring(i.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+i.raw,n.text+=`
`+i.text,this.inlineQueue.at(-1).src=n.text):t.push(i);continue}if(i=this.tokenizer.fences(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.heading(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.hr(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.blockquote(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.list(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.html(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.def(e)){e=e.substring(i.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+i.raw,n.text+=`
`+i.raw,this.inlineQueue.at(-1).src=n.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},t.push(i));continue}if(i=this.tokenizer.table(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.lheading(e)){e=e.substring(i.raw.length),t.push(i);continue}let a=e;if(this.options.extensions?.startBlock){let t=1/0,n=e.slice(1),r;this.options.extensions.startBlock.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(a=e.substring(0,t+1))}if(this.state.top&&(i=this.tokenizer.paragraph(a))){let r=t.at(-1);n&&r?.type===`paragraph`?(r.raw+=(r.raw.endsWith(`
`)?``:`
`)+i.raw,r.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=r.text):t.push(i),n=a.length!==e.length,e=e.substring(i.raw.length);continue}if(i=this.tokenizer.text(e)){e=e.substring(i.raw.length);let n=t.at(-1);n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+i.raw,n.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=n.text):t.push(i);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){this.tokenizer.lexer=this;let n=e;if(this.tokens.links){let e=Object.keys(this.tokens.links);e.length>0&&(n=n.replace(this.tokenizer.rules.inline.reflinkSearch,t=>e.includes(t.slice(t.lastIndexOf(`[`)+1,-1))?`[`+`a`.repeat(t.length-2)+`]`:t))}n=n.replace(this.tokenizer.rules.inline.anyPunctuation,`++`),n=n.replace(this.tokenizer.rules.inline.blockSkip,(e,t,n)=>{let r=n?n.length:0;return e.slice(0,r)+`[`+`a`.repeat(e.length-r-2)+`]`}),n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let r=!1,i=``,a=1/0;for(;e;){if(e.length<a)a=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}r||(i=``),r=!1;let o;if(this.options.extensions?.inline?.some(n=>(o=n.call({lexer:this},e,t))?(e=e.substring(o.raw.length),t.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let n=t.at(-1);o.type===`text`&&n?.type===`text`?(n.raw+=o.raw,n.text+=o.text):t.push(o);continue}if(o=this.tokenizer.emStrong(e,n,i)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.del(e,n,i)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),t.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),t.push(o);continue}let s=e;if(this.options.extensions?.startInline){let t=1/0,n=e.slice(1),r;this.options.extensions.startInline.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(s=e.substring(0,t+1))}if(o=this.tokenizer.inlineText(s)){e=e.substring(o.raw.length),o.raw.slice(-1)!==`_`&&(i=o.raw.slice(-1)),r=!0;let n=t.at(-1);n?.type===`text`?(n.raw+=o.raw,n.text+=o.text):t.push(o);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return t}infiniteLoopError(e){let t=`Infinite loop on byte: `+e;if(this.options.silent)console.error(t);else throw Error(t)}},_n=class{options;parser;constructor(e){this.options=e||ut}space(e){return``}code({text:e,lang:t,escaped:n}){let r=(t||``).match(N.notSpaceStart)?.[0],i=e.replace(N.endingNewline,``)+`
`;return r?`<pre><code class="language-`+J(r)+`">`+(n?i:J(i,!0))+`</code></pre>
`:`<pre><code>`+(n?i:J(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return``}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,r=``;for(let t=0;t<e.items.length;t++){let n=e.items[t];r+=this.listitem(n)}let i=t?`ol`:`ul`,a=t&&n!==1?` start="`+n+`"`:``;return`<`+i+a+`>
`+r+`</`+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return`<input `+(e?`checked="" `:``)+`disabled="" type="checkbox"> `}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t=``,n=``;for(let t=0;t<e.header.length;t++)n+=this.tablecell(e.header[t]);t+=this.tablerow({text:n});let r=``;for(let t=0;t<e.rows.length;t++){let i=e.rows[t];n=``;for(let e=0;e<i.length;e++)n+=this.tablecell(i[e]);r+=this.tablerow({text:n})}return r&&=`<tbody>${r}</tbody>`,`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?`th`:`td`;return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${J(e,!0)}</code>`}br(e){return`<br>`}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let r=this.parser.parseInline(n),i=un(e);if(i===null)return r;e=i;let a=`<a href="`+e+`"`;return t&&(a+=` title="`+J(t)+`"`),a+=`>`+r+`</a>`,a}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=un(e);if(i===null)return J(n);e=i;let a=`<img src="${e}" alt="${J(n)}"`;return t&&(a+=` title="${J(t)}"`),a+=`>`,a}text(e){return`tokens`in e&&e.tokens?this.parser.parseInline(e.tokens):`escaped`in e&&e.escaped?e.text:J(e.text)}},vn=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return``+e}image({text:e}){return``+e}br(){return``}checkbox({raw:e}){return e}},Q=class e{options;renderer;textRenderer;constructor(e){this.options=e||ut,this.options.renderer=this.options.renderer||new _n,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new vn}static parse(t,n){return new e(n).parse(t)}static parseInline(t,n){return new e(n).parseInline(t)}parse(e){this.renderer.parser=this;let t=``;for(let n=0;n<e.length;n++){let r=e[n];if(this.options.extensions?.renderers?.[r.type]){let e=r,n=this.options.extensions.renderers[e.type].call({parser:this},e);if(n!==!1||![`space`,`hr`,`heading`,`code`,`table`,`blockquote`,`list`,`html`,`def`,`paragraph`,`text`].includes(e.type)){t+=n||``;continue}}let i=r;switch(i.type){case`space`:t+=this.renderer.space(i);break;case`hr`:t+=this.renderer.hr(i);break;case`heading`:t+=this.renderer.heading(i);break;case`code`:t+=this.renderer.code(i);break;case`table`:t+=this.renderer.table(i);break;case`blockquote`:t+=this.renderer.blockquote(i);break;case`list`:t+=this.renderer.list(i);break;case`checkbox`:t+=this.renderer.checkbox(i);break;case`html`:t+=this.renderer.html(i);break;case`def`:t+=this.renderer.def(i);break;case`paragraph`:t+=this.renderer.paragraph(i);break;case`text`:t+=this.renderer.text(i);break;default:{let e=`Token with "`+i.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return t}parseInline(e,t=this.renderer){this.renderer.parser=this;let n=``;for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let e=this.options.extensions.renderers[i.type].call({parser:this},i);if(e!==!1||![`escape`,`html`,`link`,`image`,`strong`,`em`,`codespan`,`br`,`del`,`text`].includes(i.type)){n+=e||``;continue}}let a=i;switch(a.type){case`escape`:n+=t.text(a);break;case`html`:n+=t.html(a);break;case`link`:n+=t.link(a);break;case`image`:n+=t.image(a);break;case`checkbox`:n+=t.checkbox(a);break;case`strong`:n+=t.strong(a);break;case`em`:n+=t.em(a);break;case`codespan`:n+=t.codespan(a);break;case`br`:n+=t.br(a);break;case`del`:n+=t.del(a);break;case`text`:n+=t.text(a);break;default:{let e=`Token with "`+a.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return n}},yn=class{options;block;constructor(e){this.options=e||ut}static passThroughHooks=new Set([`preprocess`,`postprocess`,`processAllTokens`,`emStrongMask`]);static passThroughHooksRespectAsync=new Set([`preprocess`,`postprocess`,`processAllTokens`]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?Z.lex:Z.lexInline}provideParser(e=this.block){return e?Q.parse:Q.parseInline}},bn=class{defaults=lt();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Q;Renderer=_n;TextRenderer=vn;Lexer=Z;Tokenizer=gn;Hooks=yn;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case`table`:{let e=r;for(let r of e.header)n=n.concat(this.walkTokens(r.tokens,t));for(let r of e.rows)for(let e of r)n=n.concat(this.walkTokens(e.tokens,t));break}case`list`:{let e=r;n=n.concat(this.walkTokens(e.items,t));break}default:{let e=r;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach(r=>{let i=e[r].flat(1/0);n=n.concat(this.walkTokens(i,t))}):e.tokens&&(n=n.concat(this.walkTokens(e.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(e=>{let n={...e};if(n.async=this.defaults.async||n.async||!1,e.extensions&&(e.extensions.forEach(e=>{if(!e.name)throw Error(`extension name required`);if(`renderer`in e){let n=t.renderers[e.name];n?t.renderers[e.name]=function(...t){let r=e.renderer.apply(this,t);return r===!1&&(r=n.apply(this,t)),r}:t.renderers[e.name]=e.renderer}if(`tokenizer`in e){if(!e.level||e.level!==`block`&&e.level!==`inline`)throw Error(`extension level must be 'block' or 'inline'`);let n=t[e.level];n?n.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&(e.level===`block`?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:e.level===`inline`&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}`childTokens`in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)}),n.extensions=t),e.renderer){let t=this.defaults.renderer||new _n(this.defaults);for(let n in e.renderer){if(!(n in t))throw Error(`renderer '${n}' does not exist`);if([`options`,`parser`].includes(n))continue;let r=n,i=e.renderer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n||``}}n.renderer=t}if(e.tokenizer){let t=this.defaults.tokenizer||new gn(this.defaults);for(let n in e.tokenizer){if(!(n in t))throw Error(`tokenizer '${n}' does not exist`);if([`options`,`rules`,`lexer`].includes(n))continue;let r=n,i=e.tokenizer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.tokenizer=t}if(e.hooks){let t=this.defaults.hooks||new yn;for(let n in e.hooks){if(!(n in t))throw Error(`hook '${n}' does not exist`);if([`options`,`block`].includes(n))continue;let r=n,i=e.hooks[r],a=t[r];yn.passThroughHooks.has(n)?t[r]=e=>{if(this.defaults.async&&yn.passThroughHooksRespectAsync.has(n))return(async()=>{let n=await i.call(t,e);return a.call(t,n)})();let r=i.call(t,e);return a.call(t,r)}:t[r]=(...e)=>{if(this.defaults.async)return(async()=>{let n=await i.apply(t,e);return n===!1&&(n=await a.apply(t,e)),n})();let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.hooks=t}if(e.walkTokens){let t=this.defaults.walkTokens,r=e.walkTokens;n.walkTokens=function(e){let n=[];return n.push(r.call(this,e)),t&&(n=n.concat(t.call(this,e))),n}}this.defaults={...this.defaults,...n}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Z.lex(e,t??this.defaults)}parser(e,t){return Q.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(Error(`marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.`));if(typeof t>`u`||t===null)return a(Error(`marked(): input parameter is undefined or null`));if(typeof t!=`string`)return a(Error(`marked(): input parameter is of type `+Object.prototype.toString.call(t)+`, string expected`));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let n=i.hooks?await i.hooks.preprocess(t):t,r=await(i.hooks?await i.hooks.provideLexer(e):e?Z.lex:Z.lexInline)(n,i),a=i.hooks?await i.hooks.processAllTokens(r):r;i.walkTokens&&await Promise.all(this.walkTokens(a,i.walkTokens));let o=await(i.hooks?await i.hooks.provideParser(e):e?Q.parse:Q.parseInline)(a,i);return i.hooks?await i.hooks.postprocess(o):o})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let n=(i.hooks?i.hooks.provideLexer(e):e?Z.lex:Z.lexInline)(t,i);i.hooks&&(n=i.hooks.processAllTokens(n)),i.walkTokens&&this.walkTokens(n,i.walkTokens);let r=(i.hooks?i.hooks.provideParser(e):e?Q.parse:Q.parseInline)(n,i);return i.hooks&&(r=i.hooks.postprocess(r)),r}catch(e){return a(e)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let e=`<p>An error occurred:</p><pre>`+J(n.message+``,!0)+`</pre>`;return t?Promise.resolve(e):e}if(t)return Promise.reject(n);throw n}}},xn=new bn;function $(e,t){return xn.parse(e,t)}$.options=$.setOptions=function(e){return xn.setOptions(e),$.defaults=xn.defaults,dt($.defaults),$},$.getDefaults=lt,$.defaults=ut,$.use=function(...e){return xn.use(...e),$.defaults=xn.defaults,dt($.defaults),$},$.walkTokens=function(e,t){return xn.walkTokens(e,t)},$.parseInline=xn.parseInline,$.Parser=Q,$.parser=Q.parse,$.Renderer=_n,$.TextRenderer=vn,$.Lexer=Z,$.lexer=Z.lex,$.Tokenizer=gn,$.Hooks=yn,$.parse=$,$.options,$.setOptions,$.use,$.walkTokens,$.parseInline,Q.parse,Z.lex;var Sn=!1;function Cn(){Sn||=(ct.addHook(`uponSanitizeAttribute`,(e,t)=>{t.attrName===`id`&&/^H[1-6]$/.test(e.tagName)&&(t.forceKeepAttr=!0)}),!0)}function wn(e){Cn();let t=new Map,n=new bn;n.use({gfm:!0,breaks:!1,renderer:{heading(e){let n=this.parser.parseInline(e.tokens),r=ne(e.text,t);return`<h${e.depth} id="${r}">${n}</h${e.depth}>\n`}}});let r=n.parse(e,{async:!1});return ct.sanitize(r,{USE_PROFILES:{html:!0},ADD_ATTR:[`target`,`rel`]})}function Tn(e){let t=p(e.markdown),n=wn(e.markdown),r=ee({view:`list`,query:``}),i=e.date?`<time datetime="${f(e.date)}">${f(e.date)}</time>`:``;return`
    <article class="report">
      <aside class="toc" aria-label="目次">
        <a class="back-inline" href="${r}">← 一覧へ</a>
        <p class="toc__label">目次</p>
        <nav class="toc__nav">
          ${En(t)}
        </nav>
      </aside>
      <div class="report__main">
        <header class="report__header">
          <div class="report-card__meta">
            <span class="tag">research</span>
            ${i}
          </div>
          <p class="report-card__path"><code>${f(e.path)}</code></p>
        </header>
        <div class="markdown-body">
          ${n}
        </div>
      </div>
    </article>
  `}function En(e){return e.length?e.map(e=>`<button type="button" class="toc__link toc__link--h${e.level}" data-target="${f(e.id)}">${f(e.text)}</button>`).join(``):`<p class="toc__empty">見出しがありません</p>`}function Dn(e){let t=()=>{let t=d(location.hash);e.innerHTML=On(t),kn(e,t)};window.addEventListener(`hashchange`,t),location.hash?t():location.hash=ee({view:`list`,query:``})}function On(e){return`
    <div class="app-shell">
      <header class="top">
        <a class="back" href="../">← ポータルへ戻る</a>
        <div class="top__titles">
          <h1>Research Report Viewer</h1>
          <p>research/ 配下の調査レポートを Markdown で閲覧します。</p>
        </div>
      </header>
      ${e.view===`list`?te({reports:c(u,e.query),query:e.query,totalCount:u.length}):(()=>{let t=l(u,e.id);return t?Tn(t):`
              <section class="missing">
                <p>レポートが見つかりません: <code>${e.id}</code></p>
                <a href="${ee({view:`list`,query:``})}">一覧へ戻る</a>
              </section>`})()}
    </div>
  `}function kn(e,t){if(t.view===`report`){e.querySelectorAll(`.toc__link[data-target]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.target;n&&e.querySelector(`#${CSS.escape(n)}`)?.scrollIntoView({behavior:`smooth`,block:`start`})})});return}let n=e.querySelector(`#report-search`);n?.addEventListener(`input`,()=>{let t={view:`list`,query:n.value},r=ee(t);if(location.hash!==r){history.replaceState(null,``,r),e.innerHTML=On(t),kn(e,t);let n=e.querySelector(`#report-search`);if(n){n.focus();let e=n.value.length;n.setSelectionRange(e,e)}}})}var An=document.querySelector(`#app`);An&&Dn(An);