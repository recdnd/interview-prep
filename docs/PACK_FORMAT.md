# Pack 資料格式說明（`packs/*.js`）

本專案的 `window.PACK` 由 `script.js` 載入。檔案語法為 **JavaScript**（`window.PACK = { ... }`），概念上可對應到 **JSON**：若你要搬到另一個純 JSON 管線，把物件內容原樣序列化即可，欄位語意以本文件為準。

撰寫或校稿時請依本節約定，避免把「同一則完整答案」拆成多個不完整的 `variant`，並注意 **不同 pack 的用途**（見下「Pack 用途分類」）。

## 頂層欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `name` | string | Pack 識別名，對應檔名（例：`gaishi-special`）。**須在 `script.js` 的 `PACK_ORDER` / `PACK_LABEL` 註冊**後才會出現在切換選單。 |
| `displayName` | string（選填） | 畫面頂部顯示的標籤；未填則用 `name`。部分既有 pack 未設，行為上仍正常。 |
| `questions` | array | 題目列表，順序即 App 中的預設順序（可搭配置頂等功能重排顯示）。 |

## `questions[]` 每一題

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | number | 題目編號（建議穩定、便於你對照稿本）；**UI 不一定依 id 排序**，依陣列順序與置頂狀態。 |
| `title` | string | **僅供你在列表裡區分主題／備註用**，可含中英文關鍵字；面試當下聽眾看到的是條目上的標題與下方內容。若條目屬「插入句／緩衝句」等非整題回答，請在 `title` 就寫清楚用途（見「Pack 用途分類」）。 |
| `emoji` | string（選填） | 若存在，條目前綴顯示該 emoji；否則可能顯示數字標記。 |
| `variants` | array | **必填。** 每個元素為一段可供 App 輪播的內容，型別見下節。**核心約定**在「`variants` 的正確用法」。 |
| `role` | 任意（選填，題目級） | **若未來在「題目」上加入 `role`**，語意為執行腳本／生成流程用，預設不面向閱讀者；不要把它當成自己看稿用的主要標籤。目前多數 pack 未使用此欄位。 |

### `variants` 元素的型別

每個元素可為下列之一：

1. **`string`** — 純文字答案（可用反引號 template literal 換行）。
2. **`{ text: string, audio?: string, role?: string }`** — 與字串等價的呈現文字在 `text`；`audio` 為錄音路徑（見 `jp-interview` / `en-interview`）；**`role` 為 variant 層級、給程式或內部腳本用的標記**（見下「`role`：題目級與 variant 級」）。

`script.js` 會以 `getVariantContent` 讀取字串或 `text`，以 `getVariantAudio` 讀取 `audio`。

## `role`：題目級與 variant 級

| 位置 | 用途（約定） |
|------|----------------|
| **題目上的 `role`**（若日後新增） | 內部流程用，**不**當成對使用者或對稿的主標籤。 |
| **variant 物件上的 `role`** | 現於 `jp-interview.js` 使用（如 `anchor`、`short`、`engineer`…），**同樣是內部分類／腳本用**；**目前 UI 不顯示**（`script.js` 有 `getVariantRole` 定義，畫面未使用）。 |

撰寫稿單時：以 **`title` + `variants[].text`（或字串 variant）** 為你實際可見、可唸的內容；**不要依賴 `role` 當「這一版叫什麼」的主說明**，除非你另外在 `title` 註記。

## `variants` 的正確用法（重要）

**預設規則（整題回答類 pack）**

- **`variants` 裡的每一個元素，都必須是一段「可獨立說完、語意完整」的答案**（或一段完整銜接的口語），不能是「半句、只剩 Why、等上一段補完才算一句話」的碎片。
- **本意**：同一題之下，放**同一立場、同一結論**的**不同說法／不同故事版本／不同語気長短**（效果相近、可任選其一講完），而不是把 **What / Why / Example** 拆成多個 `variant` 輪播。
- **不要**為了「回答結構好看」而把一句完整答案切成多個 variant；若內容本來就該一氣呵成，請**合併在單一 string / template literal** 裡。
- **只有在**真的有「兩套（或以上）平行說法、講哪一套都行」時，才拆成多個 variant。
- **若沒有不同版本**，一題只保留 **一個** variant 即可。

**合法的多 variant「理由」整理**（彼此不互斥，但動機要清楚）

| 理由 | 說明 | 倉庫範例 |
|------|------|----------|
| 平行說法／故事 | 同結論、不同敘事或口吻 | `en-interview`、`en-work`、`es-deep-dive` 多數多 variant 題 |
| 語気／策略標（仍須每段完整） | 同題多種「完整版」回答風格 | `jp-interview`（搭配 variant `role`） |
| 時長／詳略層級 | 同一題 **10s／20s／40s…** 等完整版，不是大綱分段 | `cs-core`（正文以 `10s` 等開頭標註時長） |
| 短小工具句 | **非**整題回答，而是可替換的插入語、緩衝、第二句 | `gaishi-special`（`title` 已標明如「時間稼ぎ」「締めの一文」者） |

### 反例

- 三個 variant 分別只有：`"What: …"`、`"Why: …"`、`"Trade-off: …"` → 聽起來像在背大綱，且單獨切出來不算完整回答。應**合併成一段**（必要時在段內用換行分段，仍是一個 variant）。

### 正例

- `variants: [` 一段把立場、理由、取捨講完的日文 `,` `]`  
- 或：`variants: [` 精簡完整版 `,` 口語展開版（兩套都自成回答）`]`

## Pack 用途分類（避免規範「混亂」）

同一套 `variants` 語意規則，依 **pack 設計目的** 略有側重：

| 類型 | 特徵 | 代表 pack |
|------|------|-----------|
| **整題 Q&A** | 每個 variant ≈ 一段可上場說完的答案 | `gaishi-drill`、`es-deep-dive`、`en-interview`（多數） |
| **時長／深度層級** | 多 variant = 同題不同長度的**完整**版本 | `cs-core` |
| **現場模組／插入句** | 多 variant = **短句**皆可；語意是「零件」不是「整題」；**必須靠 `title` 標明** | `gaishi-special`（如第二句、時間稼ぎ、つなぎ） |
| **多語気＋錄音** | variant 物件、`audio`、`role` | `jp-interview` |

若在 **整題 Q&A** pack 裡放入長度極短的 variant，請自問：單獨唸出是否成立？若不成立，應合併或改放到「模組」類 pack 並把好 `title`。

## 撰寫形式

- 檔案為 **JavaScript**，`variants` 內可用 **雙引號字串**或 **反引號 template literal**（多行、換行方便）。
- 陣列最後一項後面**不要**多餘逗號（維持可執行、易 diff）。

## 與 `script.js` 的關係

- 新增檔 `packs/<name>.js` 後，務必在 `PACK_ORDER` 加入 `<name>`，並在 `PACK_LABEL` 設定右下角短標籤（通常 2 字母）。
- `PACK_ORDER` 列舉的每一項，應存在對應 `packs/<name>.js`，否則選單會載入失敗或走 fallback。

---

## 倉庫現況稽核（靜態檢查摘要）

以下為依本文件規則對 `packs/*.js` 做的結構與語意檢查（**不**判斷日文英文好壞，僅判斷是否空內容、型別、與慣例是否衝突）：

| 項目 | 結果 |
|------|------|
| `PACK_ORDER` 與實際檔案 | 七個 pack 均有對應 `.js`，與 `script.js` 一致。 |
| 空 `variants` 或缺 `text` | 未發現。 |
| **`variants` 型別寫在表內卻只有 `string[]`** | 舊版文件易誤導；**已於本版改為「字串或物件」**；`jp-interview` / `en-interview` 依賴物件形式。 |
| **`role` 可見性** | `jp-interview` 大量使用 variant `role`；**UI 不顯示**，與「內部用」敘述一致。 |
| **與「每 variant 須完整」並存** | `gaishi-special` 中多題刻意為**短句／插入**用途（`title` 已標註），屬**文件允許的例外**，**不是**違規，但**不可**與 `gaishi-drill` 等整題 pack 混用同一套期待。 |
| **`cs-core`** | 以 **10s／20s／…** 分層的**完整**回答，**不是** What/Why 分段，符合「多 variant 理由」表。 |

**已知假陽性（自動檢查時）**：英文以 *What interests me…* 開頭的句子，**不是**大綱標題「What:」。

---

## 撰寫／PR 前自查清單

- [ ] 新 pack 已加入 `PACK_ORDER` / `PACK_LABEL`。
- [ ] 每一題至少一個 variant；若為物件則 **`text` 非空**。
- [ ] **整題回答型** pack：任一 variant 單獨唸出是否**無需其他 variant 補完**？
- [ ] 多 variant 是否為 **平行說法 / 時長層級 / 語気完整版 / 已標題註明之插入句** 之一，而非 **What→Why→例** 輪播？
- [ ] 不要把 **`role`** 當主要對稿標籤；可見脈絡以 **`title` + 正文** 為準。
- [ ] 最後一個 variant 後**不加**多餘逗號。

---

如果是多個可以抽的短句，不用variant分割，而是“- ”單個variant裡排列即可。
此文件描述「內容與資料語意」規範；UI 行為以 `script.js` 為準。
