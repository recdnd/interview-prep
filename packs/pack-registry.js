/**
 * Pack 選單與載入邏輯的單一資料來源（主站與 legacy 子站共用）。
 * 變更題庫組合時：只改此檔，並執行 npm run check-packs。
 *
 * displayNames：與各 packs/<name>.js 內 window.PACK.displayName 對齊（無 displayName 的 pack 僅在此維護顯示名）。
 */
window.PACK_REGISTRY = {
  /** 主選單出現順序；每一項必須有對應檔案 packs/<name>.js */
  order: [
    "jp-interview",
    "cs-core",
    "en-interview",
    "en-work",
    "product-engineer-cheatsheet",
    "coding-edge",
    "engineer-favor",
    "loglass",
    "yt-ai-special"
  ],
  /** 左下角浮動切換鈕短標 */
  labels: {
    "jp-interview": "JI",
    "cs-core": "CS",
    "en-interview": "EI",
    "en-work": "EW",
    "product-engineer-cheatsheet": "PE",
    "coding-edge": "CE",
    "engineer-favor": "EF",
    "loglass": "LG",
    "yt-ai-special": "YT",
    "my-model": "MM",
    "my-model-full": "MF",
    "jp-interview-legacy": "JL"
  },
  /** 桌面／手機 pack 選單顯示名（人讀） */
  displayNames: {
    "jp-interview": "JP Interview",
    "cs-core": "CS Core",
    "en-interview": "EN Interview",
    "en-work": "EN Work",
    "product-engineer-cheatsheet": "PRODUCT ENGINEER CHEATSHEET",
    "coding-edge": "CODE EDGE",
    "engineer-favor": "Engineer Favor",
    "loglass": "Loglass",
    "yt-ai-special": "YT AI Special",
    "my-model": "MY MODEL（母本・歸檔）",
    "my-model-full": "My Model Full（母本・歸檔）",
    "jp-interview-legacy": "JP Interview (Legacy)"
  },
  /**
   * 僅能透過 ?pack= 載入；不列入主選單。
   * 用途：舊版錄音、長文母本等；仍可取材，但不參與日常輪播。
   */
  standalone: {
    "jp-interview-legacy": true,
    "my-model": true,
    "my-model-full": true
  }
};
