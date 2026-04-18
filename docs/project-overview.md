# 專案總覽（密集版）

靜態面試稿瀏覽器：以 **題庫 pack** 為中心，在瀏覽器裡切換題組、展開多版本答案，並附 **浮動 helper**（口語結構／接球層等）。無建置步驟、無前端框架，**本機 HTTP** 開啟即可。

---

## 技術棧與執行方式

| 項目 | 說明 |
|------|------|
| 執行環境 | 純 HTML + CSS + 原生 JS |
| 本機伺服器 | `npm start` 或 `npm run localhost`（`python3 -m http.server 8787`） |
| 開啟 URL | `http://127.0.0.1:8787/`（勿用 `file://` 直接開 HTML，動態載入的 `packs/*.js` 易失敗） |
| 題庫檢查 | `npm run check-packs` — 驗證 `pack-registry.js` 與 `packs/*.js` 是否一致 |

---

## 載入順序（主站 `index.html`）

1. `style.css` — 版面、主內容、helper 卡、`?pack=` 等邏輯相關樣式  
2. `pack-menu-kit/pack-menu-kit.css` — pack／題目列表面板與手機抽屜  
3. `packs/pack-registry.js` — `window.PACK_REGISTRY`（選單順序、浮標、顯示名、`standalone`）  
4. `pack-menu-kit/pack-menu-kit.js` — `window.PackMenuKit`（列項目 DOM）  
5. `script.js` — 依 registry 動態插入 `packs/<name>.js`，初始化 UI 與 helper  

`legacy/index.html` 為舊子站入口，結構與資源路徑對齊主站。

---

## 目錄職責（一覽）

| 路徑 | 職責 |
|------|------|
| `index.html` | 主頁 DOM：pack／題目面板、`.wrap` 主內容、QN／CCE／CRE／CBL helper |
| `script.js` | 路由（`?pack=`）、pack 載入、題目渲染、localStorage／sessionStorage、CCE／CBL／CRE／AFF／CHEAT 等邏輯 |
| `style.css` | 全域與 helper 版面；桌面主欄與 pack 欄幾何變數（與右側 helper 對齊） |
| `packs/pack-registry.js` | **唯一選單真相來源**：`order`、`labels`、`displayNames`、`standalone` |
| `packs/*.js` | 各題庫：`window.PACK = { name, displayName?, questions[] }` |
| `pack-menu-kit/` | 選單列 DOM 與 pack／題目面板／手機抽屜樣式 |
| `docs/` | 規格與說明（本檔、pack 格式、helpers、UI 等） |
| `scripts/check-packs.mjs` | Registry 與檔案、`window.PACK` 形狀一致性檢查 |
| `realtime/` | 現場模式用模板、公司 lexicon JSON（給外接 AI／流程參考，非核心 App 依賴） |
| `manuals/` | 面試策略長文（與程式無硬耦合） |
| `legacy/` | 舊版入口與靜態資源對照 |

---

## 資料流（精簡）

```
PACK_REGISTRY.order / standalone
        ↓
script.js 動態 <script src="packs/<key>.js">
        ↓
window.PACK（當前題庫）
        ↓
渲染 #sections（題目／variants）、#pack-panel-list、#question-panel-list
```

新增「會出現在主選單」的 pack：新增 `packs/<name>.js` + 在 registry 註冊 `order`／`labels`／`displayNames`，再跑 `npm run check-packs`。僅 `?pack=` 載入的題庫放在 `standalone`。

---

## 畫面區塊

| 區塊 | 說明 |
|------|------|
| Pack 列表面板 | 桌面右側固定欄；窄螢幕改為右下角抽屜 + 切換鈕 |
| 題目列表面板 | 桌面左側；窄螢幕與 pack 抽屜同邏輯另鈕開啟 |
| `.wrap` | 中央主內容：`#pack-label`、`#sections`（當前 pack 的題與答案） |
| Helper 浮卡 | QN（備忘）、CCE（獨白三段）、CRE（依情境切 CCE／CBL）、CBL（接球四段 + AFF 微肯定） |

helper 行為與按鈕語意：**[helpers-spec.md](./helpers-spec.md)**（合併規格）、**[helpers-user-guide.md](./helpers-user-guide.md)**（好讀版）。

---

## `docs/` 內延伸閱讀（索引）

| 文件 | 用途 |
|------|------|
| [PACK_FORMAT.md](./PACK_FORMAT.md) | `window.PACK` 欄位、`variants` 寫法約定 |
| [hard-work-placeholder-notes.md](./hard-work-placeholder-notes.md) | `hard-work` pack の `[xx]` プレースホルダ規約と Cursor 用短文 |
| [packs-overview.md](./packs-overview.md) | 各 pack 一句話用途＋standalone／未登錄檔案表 |
| [david-pich-routing.md](./david-pich-routing.md) | David Pich 面談整場路由（對齊 `david-pich.js` 題 id） |
| [ruvia-demo-routing.md](./ruvia-demo-routing.md) | Ruvia 約 3 分鐘 demo：trigger、分鐘腳本、結束後接話與 cross-pack |
| [helpers-spec.md](./helpers-spec.md) | CCE／CBL／CRE／AFF 合併規格 |
| [helpers-user-guide.md](./helpers-user-guide.md) | Helper 自然語言說明 |
| [helpers-baka-and-catchball-plan.md](./helpers-baka-and-catchball-plan.md) | 簡化說明與 catch-ball 補句計畫 |
| [cce-spec.md](./cce-spec.md) / [cbl-spec.md](./cbl-spec.md) / [cre-spec.md](./cre-spec.md) | 各引擎細節 |
| [qn-spec.md](./qn-spec.md) | Quick Note |
| [ui-helper-layout.md](./ui-helper-layout.md) | Helper 版面備註 |
| [gyakukyujin-quick-index.md](./gyakukyujin-quick-index.md) | 逆質問 pack 快查 |

---

## 維護時常做三件事

1. 改題或增刪 pack → 跑 **`npm run check-packs`**。  
2. 改 registry 或 pack 檔名 → 同步 **三處** `order`、`labels`、`displayNames`（與檔內 `displayName` 對齊習慣見 PACK_FORMAT）。  
3. 改選單列 UI → 看 **`pack-menu-kit/`** 與 `script.js` 內 `renderPackPanel`／`renderQuestionPanel` 等。

---

## 與本總覽不重複的內容

- **各題庫主題細節** → `packs-overview.md`。  
- **題目 JSON 語意／variant 禁忌** → `PACK_FORMAT.md`。  
- **現場模式與 lexicon 怎麼用** → `realtime/現場模式模板.md`、`realtime/lexicon/README.md`。  
- **公司向長文攻略** → `manuals/`。

本檔以「倉庫地圖 + 資料流 + 該點哪裡改」為主；細節請以上述連結為準。
