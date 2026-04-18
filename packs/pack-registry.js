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
    "technical-ball",
    "shokunin-pack",
    "full-stack-gab",
    "david-pich",
    "booboo",
    "gyakukyujin",
    "ml-research-pack",
    "security-edge",
    "product-engineer-cheatsheet",
    "coding-test",
    "coding-test-loglass",
    "smart-full-lines",
    "manner-pack",
    "simulation-tech-interview-recent-a",
    "simulation-tech-interview-spiral-core",
    "simulation-tech-interview-spiral-core-20q",
    "loglass",
    "ruvia-development-explain",
    "yt-ai-special",
    "tech-core-pack"
  ],
  /** 左下角浮動切換鈕短標 */
  labels: {
    "jp-interview": "JI",
    "cs-core": "CS",
    "en-interview": "EI",
    "en-work": "EW",
    "technical-ball": "TB",
    "shokunin-pack": "SK",
    "full-stack-gab": "FG",
    "david-pich": "DP",
    "booboo": "BB",
    "gyakukyujin": "GK",
    "ml-research-pack": "MR",
    "security-edge": "SE",
    "product-engineer-cheatsheet": "PE",
    "coding-test": "CT",
    "coding-test-loglass": "CL",
    "smart-full-lines": "FL",
    "manner-pack": "MP",
    "simulation-tech-interview-recent-a": "S1",
    "simulation-tech-interview-spiral-core": "S2",
    "simulation-tech-interview-spiral-core-20q": "S3",
    "loglass": "LG",
    "ruvia-development-explain": "RV",
    "yt-ai-special": "YT",
    "tech-core-pack": "TC",
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
    "technical-ball": "technical-ball",
    "shokunin-pack": "shokunin pack",
    "full-stack-gab": "Full-Stack Gab",
    "david-pich": "david-pich",
    "booboo": "🧒booboo",
    "gyakukyujin": "gyakukyujin",
    "ml-research-pack": "ML / Research",
    "security-edge": "🔒 Security Edge（含 Soft）",
    "product-engineer-cheatsheet": "PRODUCT ENGINEER（統合：CE＋PE＋EF）",
    "coding-test": "coding-test",
    "coding-test-loglass": "coding-test-loglass（含 lite）",
    "smart-full-lines": "smart full lines（統合）",
    "manner-pack": "manner pack",
    "simulation-tech-interview-recent-a": "🕹️simulation-tech-interview(recent_A)",
    "simulation-tech-interview-spiral-core": "🕹️simulation-tech-interview(Spiral.ooo + core)",
    "simulation-tech-interview-spiral-core-20q": "🕹️simulation-tech-interview(Spiral core 20Q)",
    "loglass": "Loglass（統合：本線＋語彙＋短答＋簡問＋15s）",
    "ruvia-development-explain": "ruvia-dev-explain",
    "yt-ai-special": "YT AI Special",
    "tech-core-pack": "tech core pack",
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
