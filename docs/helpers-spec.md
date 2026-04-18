# 面談小工具合併規格（CBL / CCE / CRE）

本文件為 **Catch Ball Layer（CBL）**、**AFF（Micro Affirmation Layer）**、**Conversation Continuation Engine（CCE）**、**Conversation Relay Engine（CRE）** 的精簡合併說明，供維護文案與行為時對照。細部敘述亦可參考 `cbl-spec.md`、`cce-spec.md`、`cre-spec.md`。

**給使用者的自然語言完整說明**（何時用、按鈕、與 Packs 分工）：見 **`helpers-user-guide.md`**。

---

## 總覽與分工

| 工具 | 用途 | 典型輸出 |
|------|------|----------|
| **Packs** | 結構化完整答案 | 題組內文 |
| **Episodes** | 故事／例子 | 範例敘述 |
| **CCE** | 獨白式接話：開頭、中段、收尾 | `[起手]` `[中段]` `[収束]` |
| **AFF** | 微肯定（觀察到的點：流／構／現／明） | `[微肯定]` |
| **CBL** | 雙向對話：接球、AFF、輕反問、延伸 | `[接球]` `[微肯定]` `[軽い反問]` `[つなぎ]` |
| **CRE** | 單一入口：依模式混用 CCE 或 CBL | 見下文 |

四者**都不產出完整技術解答**，只提供短句、降低卡詞與認知負擔。

---

## AFF（Micro Affirmation Layer）

- **目的**：降壓、好聊感；用**觀察到的具體點**（流れ／構造／現実／明瞭さ）微肯定，**不**以空泛誇獎結尾。
- **池**：`AFF.process` / `AFF.structure` / `AFF.reality` / `AFF.clarity`（語料於 `helpers/helper-corpus.js` 之 `HELPER_CORPUS.aff`；`script.js` 負責抽選與 UI）。
- **使用規則**：語意上應接 **`CBL.expand`**（つなぎ），勿單句 AFF 就結束；避免連發多句 AFF。
- **CBL 頂部按鈕**：`A`＝依當前題目標題自動推斷池；`流` `構` `現` `明`＝手動固定池（手動優先，直到再按 `A`）。

---

## CBL（Catch Ball Layer）

- **目的**：在對方說完後維持對話流動；不接完整答案。
- **四段（建議順序）**：
  1. **接球（ack）**：簡短接住對方觀點  
  2. **微肯定（aff）**：AFF，偏結構／流程／現實／清晰  
  3. **輕反問（ask）**：溫和追問，讓對方多說一點（可視情境略過）  
  4. **つなぎ（expand）**：接回自己的經驗或專案（例：「自分でも似たような問題を…」）

**不適用**：直接答技術題、取代 packs、當作結論。

**呈現**：`textContent`，禁止 `innerHTML`。

---

## CCE（Conversation Continuation Engine）

- **目的**：高壓下快速組出「一句開頭 → 一句中段 → 一句收尾」的說話節奏。
- **三段**：`[起手]` `[中段]` `[収束]`；中段依模式從 `CHEAT.mid` 的 **general / ux / system** 擇一池抽句。
- **模式**：
  - **general**：通用接續  
  - **ux**：偏 UX、互動、可理解性  
  - **system**：偏架構、狀態／歷史、取捨、可說明性  
- **模式切換**：手動 `G` / `UX` / `SYS`，或依當前題目標題自動推斷（`A`）；手動優先於自動直到使用者再改。

與 packs 分工：世界觀／故事在 packs；**CCE 只管接話骨架**。

---

## CRE（Conversation Relay Engine）

- **目的**：零 prompt 的統一入口；依情境選 **speak** 或 **relay**。
- **speak 模式**：輸出與 **CCE 相同**（起手／中段／收束），中段池依題目推斷 `speakSubtype`（general / ux / system），底層使用 **`CHEAT`**。
- **relay 模式**：輸出與 **CBL 相同**（接球／微肯定／輕反問／つなぎ），底層使用 **`CBL`** 與 **`AFF`**（relay 時 AFF 池依題目自動推斷，無獨立按鈕）。
- **auto 模式**：依當前題目標題推斷用 speak 或 relay（例如偏逆質問、討論、開放對話 → relay；其餘多為 speak）。

**重點**：修改 **CBL** 或 **AFF** 會連帶影響 **CRE 的 relay**；修改 **CHEAT** 會連帶影響 **CCE** 與 **CRE 的 speak**。

---

## 語料與邏輯位置

| 項目 | 說明 |
|------|------|
| **`helpers/helper-corpus.js`** | `window.HELPER_CORPUS`：`cheat`（CCE／CRE-speak）、`cbl`、`aff`。須在 `script.js` **之前**載入。 |
| **`script.js`** | 讀取 `HELPER_CORPUS` 為 `CHEAT` / `CBL` / `AFF`；`pick`、`buildHelperBlock`、模式推斷、渲染與事件綁定。 |

| 資料結構（語料鍵） | 說明 |
|--------------------|------|
| `HELPER_CORPUS.cheat`（執行時別名 `CHEAT`） | CCE 與 CRE-speak 的 `start`、`mid.{general,ux,system}`、`end` |
| `HELPER_CORPUS.aff`（`AFF`） | `process` / `structure` / `reality` / `clarity`；CBL 與 CRE-relay 的 `[微肯定]` |
| `HELPER_CORPUS.cbl`（`CBL`） | `ack`、`ask`、`expand`（接球／反問／つなぎ） |
| CCE UI | `cce-*` 元素、`inferCCEModeFromQuestionTitle`、`renderCceBlocks` 等 |
| CBL UI | `cbl-*` 含 `cbl-modes`（AFF 池）、`inferAffPoolKey`、`generateCBL`、`renderCBLBlocks` |
| CRE UI | `cre-*` 元素、`inferCREMode`、`inferSpeakSubtype`、`renderCREBlocks`；relay 分支內對 `CBL.*` 呼叫 `pick` |

修改短句文案時：改 **`helpers/helper-corpus.js`** 對應鍵；避免只改 `script.js` 卻以為 CRE 已更新。

---

## UI 與安全

- 浮動小框、一鍵生成、無需額外 prompt。  
- 內容一律 **`textContent`**。  
- 視覺上 CCE／CBL／CRE 各有區分，但屬同一套輔助層。

---

## 維護檢查清單

- [ ] 新句屬「微肯定、觀察具體點」→ 加 **`AFF` 對應子池**（CRE relay 同步生效）。  
- [ ] 新句屬「對話接球後接到自己」→ 加 **`CBL.expand`**（CRE relay 同步生效）。  
- [ ] 新句屬「獨白中段、不接球」→ 加 **`CHEAT.mid` 適當子池**。  
- [ ] 改完執行前端手動抽幾次 CCE / CBL / CRE（含 auto）確認語感與模式。
