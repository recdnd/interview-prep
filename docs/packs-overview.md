# Packs 一覽（簡短概述）

題庫清單與載入順序以 `packs/pack-registry.js` 為準；變更後請執行 `npm run check-packs`。下列為各 pack 的用途摘要（一句至兩句），方便選題與維護時對照。

---

## 主選單順序（`order`）

| key | 浮標 | 顯示名 | 概述 |
|-----|------|--------|------|
| `jp-interview` | JI | JP Interview | 日語面試主線：受付・HR 挨拶、自我介紹、留日動機、Spiral／作品站、強み課題、史学與設計、志望等。 |
| `cs-core` | CS | CS Core | 英語精簡三題：Spiral 系統設計、機器人團隊故事、產品導向工程思維。 |
| `en-interview` | EI | EN Interview | 英語常見面試題：自我介紹、為何應徵、難題、自豪專案、強項、技術經驗敘述。 |
| `en-work` | EW | EN Work | 英語職場口語短句：standup、說明 bug、釐清需求、進度回報、求助。 |
| `technical-ball` | TB | technical-ball | 日語技術／カジュアル面談用「接球」長庫：Spiral／Fragment／append-only／DSL、AI 分工、全端、誤解回應、公司動機等。 |
| `shokunin-pack` | SK | shokunin pack | 職人氣質與工作態度短句（中日混標）：日常、小工具、workflow、髒活、日人事向け等。 |
| `full-stack-gab` | FG | Full-Stack Gab | 日英混排全端敘事：30 秒自我紹介、強項、FE／BE／狀態流、要件曖昧、取捨、運用、銜接 coding test、締語。 |
| `david-pich` | DP | david-pich | David Pich 向け 24 題：入り〜締めに加え、協働価値・会議役割・逆質問（Loglass での要否／置き場面）。**路由** [`david-pich-routing.md`](./david-pich-routing.md)。 |
| `booboo` | BB | 🧒booboo | 「合法小孩感」新卒／ジュニア向け：誠實、職種より課題、學習姿態、被問住、珍惜機會、收尾等大量短 variant。 |
| `gyakukyujin` | GK | gyakukyujin | 逆質問與面談推進：期待值、缺口盤問、文化／mentor、follow-up 模擬、沈默控制、相親感短句等高密度腳本。 |
| `ml-research-pack` | MR | ML / Research | 英語：研究→產品、團隊、日語溝通、ML 與產品、系統觀、評估、曖昧耐受、產品工程師方向等精簡 opener／段落。 |
| `security-edge` | SE | 🔒 Security Edge（含 Soft） | **統合**：原 Soft（題名 `〔Soft〕`）在前、原 Edge（`〔Edge〕`）在後；邊界・資產・demo 前設界・救場等。各題 variant 內多 bullet 已依長度**短→長**排序。 |
| `product-engineer-cheatsheet` | PE | PRODUCT ENGINEER（統合：CE＋PE＋EF） | **統合**：`coding-edge`（`〔CODE EDGE〕`）→ 原 PE 小抄（`〔PE〕`）→ `engineer-favor`（`〔Engineer Favor〕`）；短／輕組在前。 |
| `coding-test` | CT | coding-test | 日語（題名部分中英混）：coding test／白板場景—自己定位、I/O・制約整理、tradeoff、scale・別解、情報不足、短句 bullet、收尾與逆質問等。 |
| `coding-test-loglass` | CL | coding-test-loglass（含 lite） | **統合**：原 lite（題名 `〔極短〕`）在前、原標準（`〔標準〕`）在後；Loglass 向け coding test 全組。 |
| `smart-full-lines` | FL | smart full lines（統合） | **統合**：`smart-tone-mini`（`〔句頭工具〕`）→ 完整短句 2 題（產品工程現場／DS→產品工程）→ `worklog-mini-hard`（`〔worklog〕`）→ `hard-work`（`〔hard-work〕`、`[xx]` 模板）。短 bullet 行置前。`[xx]` 規約見 [`hard-work-placeholder-notes.md`](./hard-work-placeholder-notes.md)。 |
| `manner-pack` | MP | manner pack | 日語：句頭／緩衝／接話／確認／修正／轉場／判定／合作／抽象→行動／不足承認／收尾／`[xx]` 小模板；與 `helpers/helper-corpus`、[`manuals/教養書.md`](../manuals/教養書.md) 語感對齊。 |
| `simulation-tech-interview-recent-a` | S1 | 🕹️simulation-tech-interview(recent_A) | 技術面接口語シミュ：0〜5 分 5 問＋プロジェクト概要 8 問＋設計深掘り 11 問＋途中 1 問＋実装・trade-off 11 問＋途中 invariant 1 問＋**プロダクト感・要件整理・業務理解 10 問＋途中価値確認 1 問**＋**働き方・開発の進め方・チーム適性 9 問＋短打価値確認 1 問**＋**Loglass／B2B 文脈 6 問＋短打強み確認 1 問**＋**締め前の確認・逆質問・キャリア・環境・締めの挨拶 3 パターン＋最後に一言 1 問**（**計 75 問**）。各題 **variant1＝短版**、**variant2＝長版**（第 5 問長版に senior 向け追補）。 |
| `simulation-tech-interview-spiral-core` | S2 | 🕹️simulation-tech-interview(Spiral.ooo + core) | 新版 45 分鐘 simulation：明確分層 **`spiral-core-series`（core / research / trace-closure / RECENT_A）** 與 **`spiral.ooo`（playground / interface / fragment editor / workspace）**，含開場→設計深掘→trade-off→demo 切入→DSL 邊界追問→團隊適性→Loglass 連結→收尾逆質問（計 24 題；短長雙 variant）。 |
| `simulation-tech-interview-spiral-core-20q` | S3 | 🕹️simulation-tech-interview(Spiral core 20Q) | 45 分鐘超濃縮高概率問答：主體 20 題（每題 15〜25 秒）＋補強 3 題（不足／見てほしい点／最後一言）。主軸固定 `spiral-core`，並保留 `spiral.ooo` 為 user-facing layer、DSL/core engine 為另一層之邊界。 |
| `loglass` | LG | Loglass（統合：本線＋語彙＋短答＋簡問＋15s） | **統合**順序：`〔15s〕` → `〔簡問〕` → `〔短答〕` → `〔語彙〕` → `〔本線〕`（原主線 Spiral／深掘等）。短／高頻組在前。 |
| `ruvia-development-explain` | RV | ruvia-dev-explain | Ruvia 說明用：本質／動機、knot、與一般筆記差異、workflow、資料結構、spec-first、UI 分離、自造工具、與 Loglass 對齊（題名中文、本文日文）。**約 3 分 on-site demo 講＋做**見 [`ruvia-demo-routing.md`](./ruvia-demo-routing.md)。 |
| `yt-ai-special` | YT | YT AI Special | 中日混排 AI／趨勢雜談：趨勢起手、現場感、指令品質、ドメイン、要件、顧客期待、雜談つなぎ、締め一文等。 |
| `tech-core-pack` | TC | tech core pack | 10 句核心口頭模板：強み定位、backend 角色邊界、Spiral 動機、append-only、RECENT_A、scale 句頭、工作方式、playground/DSL 邊界、非公開代碼守界、Loglass 相性。 |

---

## 僅 `?pack=` 載入（`standalone`）

| key | 浮標 | 顯示名 | 概述 |
|-----|------|--------|------|
| `jp-interview-legacy` | JL | JP Interview (Legacy) | 舊版 jp-interview 題組（含曾有錄音之題）；供 legacy 子站，精簡自我紹紹・Spiral・逆質問・協調・困難問題・英語等。 |
| `my-model` | MM | MY MODEL（母本・歸檔） | 世界觀母本精簡版：Spiral 是什麼、履歴／append-only、system fit、UX、説明可能性、強み課題、史学、将来役割。 |
| `my-model-full` | MF | My Model Full（母本・歸檔） | 母本長答：Spiral／Core 差異、非技術者向け説明、DSL、設計の迷い、プロダクト志向、強み弱み、史学からの経路等。 |

---

## 未列入 registry 選單之檔案（`check-packs` 略過登記）

| 檔案 | `name` | 概述 |
|------|--------|------|
| `fillings.js` | fillings | 短「補足段落」模組：軽展開、作ってみた経験、技術／UX／トレードオフ視点の接話用 FILL。 |
| `episodes.js` | episodes | 故事母本：Scratch RPG、VT CS、ロボットチーム、史学理由、Spiral きっかけ等長篇エピソード。 |

---

## 維護備註

- 新增會出現在選單的 pack：在 `pack-registry.js` 的 `order`、`labels`、`displayNames` 註冊，並於 `packs/<name>.js` 維持 `name`／`displayName` 與 registry 一致。  
- 本文件為人工摘要，題目增刪後若與概述明顯不符，請隨 diff 小幅更新本頁對應列即可。  
- 大規模合併還原請用 git；**勿重跑** `scripts/merge-packs-run.mjs`（會 `unlink` 已刪除的來源檔）。合併產物為 `JSON.stringify` 格式，`check-packs` 已支援 `"name"`／`"displayName"` 鍵解析。
