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
| `david-pich` | DP | david-pich | 針對 David Pich 式面談：對手像、Loglass／Ruvia 敘事、demo 追問、輕誇句包、closing、同輩語感等。 |
| `booboo` | BB | 🧒booboo | 「合法小孩感」新卒／ジュニア向け：誠實、職種より課題、學習姿態、被問住、珍惜機會、收尾等大量短 variant。 |
| `gyakukyujin` | GK | gyakukyujin | 逆質問與面談推進：期待值、缺口盤問、文化／mentor、follow-up 模擬、沈默控制、相親感短句等高密度腳本。 |
| `ml-research-pack` | MR | ML / Research | 英語：研究→產品、團隊、日語溝通、ML 與產品、系統觀、評估、曖昧耐受、產品工程師方向等精簡 opener／段落。 |
| `security-edge` | SE | 🔒 Security Edge | 邊界與資產保護（偏直接）：核心碼不公開、被追問、demo 前設界、救場、引導回優勢、萬用一句等。 |
| `security-edge-soft` | SS | 🔒 Security Edge Soft | 同上主題的**更柔和**日語版：省略詳情、設計のみ、公開範囲、デモ先手、面試官向け境界等。 |
| `product-engineer-cheatsheet` | PE | PRODUCT ENGINEER CHEATSHEET | 日語：實務／協調性不安、個人 vs 團隊開發、意見衝突、設計與實作平衡、新卒「癖」、成長與強み一句等短答小抄。 |
| `coding-edge` | CE | CODE EDGE | 日語精簡 10 題：選考の受ける姿勢、競技でない旨、実装は普段から、スタイル・主軸・強みへ戻す、形式希望、一言、継続学習。 |
| `coding-test` | CT | coding-test | 日語（題名部分中英混）：coding test／白板場景—自己定位、I/O・制約整理、tradeoff、scale・別解、情報不足、短句 bullet、收尾與逆質問等。 |
| `coding-test-loglass` | CL | coding-test-loglass | Loglass 向け coding test：前提整理・tradeoff・SaaS／業務文脈・チーム前提、見極めへの返し、短句工具（含實務接続一句）。 |
| `coding-test-loglass-lite` | C2 | coding-test-loglass-lite | 同上主題の極短版（12 題）：面談前サッと掃る用。 |
| `engineer-favor` | EF | Engineer Favor | 日語：強み主軸句、Spiral 設計說明、追問（トレードオフ／チーム）、**偏工程師好感**的實裝感、逆質問與承接、面談後半總括。 |
| `loglass` | LG | Loglass | Loglass 專用：5 分 intro＋Spiral、技術深掘（event DAG、RWX、AI 分離）、志望、職種・標準化逆質問、Spiral 後接公司問等多 variant。 |
| `yt-ai-special` | YT | YT AI Special | 中日混排 AI／趨勢雜談：趨勢起手、現場感、指令品質、ドメイン、要件、顧客期待、雜談つなぎ、締め一文等。 |

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
