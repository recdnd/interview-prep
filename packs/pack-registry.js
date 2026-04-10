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
    "gaishi-special",
    "gaishi-drill",
    "my-model",
    "yt-ai-special",
    "my-model-full"
  ],
  /** 左下角浮動切換鈕短標 */
  labels: {
    "jp-interview": "JI",
    "cs-core": "CS",
    "en-interview": "EI",
    "en-work": "EW",
    "gaishi-special": "GS",
    "gaishi-drill": "GD",
    "my-model": "MM",
    "yt-ai-special": "YT",
    "my-model-full": "MF",
    "jp-interview-legacy": "JL"
  },
  /** 桌面／手機 pack 選單顯示名（人讀） */
  displayNames: {
    "jp-interview": "JP Interview",
    "cs-core": "CS Core",
    "en-interview": "EN Interview",
    "en-work": "EN Work",
    "gaishi-special": "GAISHI DLC",
    "gaishi-drill": "GAISHI DRILL",
    "my-model": "MY MODEL",
    "yt-ai-special": "YT AI Special",
    "my-model-full": "My Model Full",
    "jp-interview-legacy": "JP Interview (Legacy)"
  },
  /**
   * 僅能透過 ?pack= 或 legacy/index.html 載入；不列入 order。
   * 值為 true 表示啟用。
   */
  standalone: {
    "jp-interview-legacy": true
  }
};
