// pack loader + viewer

const SELECTED_PACK_KEY = "selectedPackKey";
const PACK_PINNED_KEY = "packPinned";

function getPackPinState() {
  try {
    return {
      pinned: localStorage.getItem(PACK_PINNED_KEY) === "1",
      key: localStorage.getItem(SELECTED_PACK_KEY) || ""
    };
  } catch (_) {
    return { pinned: false, key: "" };
  }
}

function setPackPinState(packKey) {
  try {
    if (packKey) {
      localStorage.setItem(SELECTED_PACK_KEY, packKey);
      localStorage.setItem(PACK_PINNED_KEY, "1");
    } else {
      localStorage.setItem(SELECTED_PACK_KEY, "");
      localStorage.setItem(PACK_PINNED_KEY, "0");
    }
  } catch (_) {}
}

/** @typedef {"none"|"pack"|"question"} MobileDrawerType */
const MOBILE_DRAWER_STATE_KEY = "mobileDrawerType";
const PACK_DRAWER_OPEN_KEY = "packDrawerOpen";
const QN_STORAGE_KEY = "pp_quick_note";

function getMobileDrawerState() {
  try {
    const v = sessionStorage.getItem(MOBILE_DRAWER_STATE_KEY);
    if (v === "pack" || v === "question") return v;
    if (sessionStorage.getItem(PACK_DRAWER_OPEN_KEY) === "1") return "pack";
    return "none";
  } catch (_) {
    return "none";
  }
}

function setMobileDrawerState(type) {
  try {
    if (type === "none") {
      sessionStorage.removeItem(MOBILE_DRAWER_STATE_KEY);
      sessionStorage.removeItem(PACK_DRAWER_OPEN_KEY);
    } else {
      sessionStorage.setItem(MOBILE_DRAWER_STATE_KEY, type);
    }
  } catch (_) {}
}

function loadQuickNote() {
  try {
    return localStorage.getItem(QN_STORAGE_KEY) || "";
  } catch (_) {
    return "";
  }
}

function saveQuickNote(value) {
  try {
    localStorage.setItem(QN_STORAGE_KEY, value || "");
  } catch (_) {}
}

function isValidPackPayload(p) {
  return !!(p && Array.isArray(p.questions) && p.questions.length > 0);
}

/** 與 packs/pack-registry.js 內 standalone 對齊 */
function isStandalonePackKey(key) {
  const r = typeof window !== "undefined" && window.PACK_REGISTRY;
  return !!(r && r.standalone && r.standalone[key]);
}

function showPackLoadError(message) {
  const label = document.getElementById("pack-label");
  if (label) label.textContent = "載入失敗";
  const sections = document.getElementById("sections");
  if (!sections) return;
  sections.textContent = "";
  const box = document.createElement("div");
  box.className = "box";
  box.style.margin = "1rem";
  const p1 = document.createElement("p");
  p1.style.color = "#a40000";
  p1.style.marginTop = "0";
  p1.textContent = message || "無法載入題庫。";
  box.appendChild(p1);
  const p2 = document.createElement("p");
  p2.style.fontSize = "0.875rem";
  p2.style.marginBottom = "0";
  p2.textContent =
    "請在專案根目錄啟動本機伺服器後，用 http://127.0.0.1:8787/ 開啟（npm start 或 python3 -m http.server 8787）。不要用檔案總管直接雙擊開 HTML，否則 packs/ 腳本常會載入失敗。";
  box.appendChild(p2);
  sections.appendChild(box);
}

(function () {
  if (!window.PACK_REGISTRY || !Array.isArray(window.PACK_REGISTRY.order) || !window.PACK_REGISTRY.labels) {
    showPackLoadError("缺少 packs/pack-registry.js 或格式不正確。請在 script.js 之前載入該檔。");
    return;
  }
  const reg = window.PACK_REGISTRY;
  const PACK_ORDER = reg.order;
  const PACK_LABEL = reg.labels;
  const LAST_PACK_KEY = "pp_last_pack";

  const params = new URLSearchParams(location.search);
  const urlPack = params.get("pack");

  let savedPinned = false;
  let savedPackKey = "";
  try {
    savedPinned = localStorage.getItem(PACK_PINNED_KEY) === "1";
    savedPackKey = localStorage.getItem(SELECTED_PACK_KEY) || "";
  } catch (_) {}
  if (savedPinned && savedPackKey && !PACK_ORDER.includes(savedPackKey)) {
    setPackPinState(null);
    savedPinned = false;
    savedPackKey = "";
  }

  let currentPack;
  if (typeof window.__INITIAL_PACK__ === "string" && isStandalonePackKey(window.__INITIAL_PACK__)) {
    currentPack = window.__INITIAL_PACK__;
  } else if (urlPack && (PACK_ORDER.includes(urlPack) || isStandalonePackKey(urlPack))) {
    currentPack = urlPack;
  } else if (savedPinned && savedPackKey && PACK_ORDER.includes(savedPackKey)) {
    currentPack = savedPackKey;
  } else {
    currentPack = localStorage.getItem(LAST_PACK_KEY) || "jp-interview";
  }

  if (!PACK_ORDER.includes(currentPack) && !isStandalonePackKey(currentPack)) {
    currentPack = "jp-interview";
  }

  let jpFallbackInjected = false;

  function boot(pack, routeKey) {
    try {
      initApp(pack, routeKey, PACK_ORDER, PACK_LABEL);
    } catch (err) {
      console.error(err);
      showPackLoadError("頁面初始化錯誤：" + (err && err.message ? err.message : String(err)));
    }
  }

  function injectJpFallback() {
    if (jpFallbackInjected) return;
    jpFallbackInjected = true;
    const fallback = document.createElement("script");
    fallback.src = "packs/jp-interview.js";
    fallback.onload = function () {
      if (isValidPackPayload(window.PACK)) {
        try {
          localStorage.setItem(LAST_PACK_KEY, window.PACK.name);
        } catch (_) {}
        boot(window.PACK, "jp-interview");
      } else {
        showPackLoadError("jp-interview 題庫資料不完整或為空。");
      }
    };
    fallback.onerror = function () {
      showPackLoadError("無法載入 packs/jp-interview.js。請確認在專案根目錄啟動 HTTP 伺服器後再開啟。");
    };
    document.head.appendChild(fallback);
  }

  const script = document.createElement("script");
  script.src = "packs/" + currentPack + ".js";
  script.onload = function () {
    if (isValidPackPayload(window.PACK)) {
      if (!isStandalonePackKey(currentPack)) {
        try {
          localStorage.setItem(LAST_PACK_KEY, window.PACK.name);
        } catch (_) {}
      }
      boot(window.PACK, currentPack);
      return;
    }
    if (currentPack === "jp-interview") {
      showPackLoadError("jp-interview 沒有有效的題目資料（questions）。");
      return;
    }
    if (isStandalonePackKey(currentPack)) {
      showPackLoadError("無法載入 " + currentPack + " 題庫資料。");
      return;
    }
    injectJpFallback();
  };
  script.onerror = function () {
    if (isStandalonePackKey(currentPack)) {
      showPackLoadError("無法載入 packs/" + currentPack + ".js。請確認本機 HTTP 伺服器與檔案路徑。");
      return;
    }
    if (currentPack === "jp-interview") {
      showPackLoadError("無法載入 packs/jp-interview.js。請用本機伺服器開啟專案根目錄，勿使用 file://。");
      return;
    }
    injectJpFallback();
  };
  document.head.appendChild(script);
})();

function initApp(PACK, currentPack, PACK_ORDER, PACK_LABEL) {
  const QUESTIONS = PACK.questions;
  const STORAGE_KEY = "pp_" + PACK.name;

  let panelSelectedPack = null;
  const pin = getPackPinState();
  if (pin.pinned && pin.key && pin.key === currentPack && PACK_ORDER.includes(pin.key)) {
    panelSelectedPack = pin.key;
  }

  function isMobileViewport() {
    return typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 1023px)").matches;
  }

  function formatPackListLabel(key) {
    const r = typeof window !== "undefined" && window.PACK_REGISTRY;
    if (r && r.displayNames && r.displayNames[key]) {
      return r.displayNames[key];
    }
    return key.replace(/-/g, " ").toUpperCase();
  }

  function setupQuickNote() {
    const input = document.getElementById('qn-input');
    const clearBtn = document.getElementById('qn-clear');
    if (!input) return;

    input.value = loadQuickNote();

    input.addEventListener('input', function () {
      saveQuickNote(input.value);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        input.value = "";
        saveQuickNote("");
        input.focus();
      });
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { tplByQ: {}, pinOrder: [], activeQIndex: 0 };
      const s = JSON.parse(raw);
      return {
        tplByQ: typeof s.tplByQ === "object" ? s.tplByQ : {},
        pinOrder: Array.isArray(s.pinOrder) ? s.pinOrder : [],
        activeQIndex: Math.min(Math.max(0, s.activeQIndex || 0), QUESTIONS.length - 1)
      };
    } catch (_) {
      return { tplByQ: {}, pinOrder: [], activeQIndex: 0 };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tplByQ: state.tplByQ,
        pinOrder: state.pinOrder,
        activeQIndex: state.activeQIndex
      }));
    } catch (_) {}
  }

  let state = loadState();

  function buildRenderOrder() {
    const pinned = state.pinOrder.filter(function (i) { return i >= 0 && i < QUESTIONS.length; });
    const pinnedSet = {};
    pinned.forEach(function (i) { pinnedSet[i] = true; });
    const unpinned = [];
    for (let i = 0; i < QUESTIONS.length; i++) {
      if (!pinnedSet[i]) unpinned.push(i);
    }
    return pinned.concat(unpinned);
  }

  function getTplIndex(qIndex) {
    const q = QUESTIONS[qIndex];
    const max = q ? q.variants.length - 1 : 0;
    const current = state.tplByQ[qIndex];
    return Math.min(Math.max(0, current == null ? 0 : current), max);
  }

  function getVariantContent(q, tplIndex) {
    const v = q && q.variants[tplIndex];
    return typeof v === 'string' ? v : (v && v.text) || '';
  }

  function getVariantAudio(q, tplIndex) {
    const v = q && q.variants[tplIndex];
    return (v && typeof v === 'object' && v.audio) ? v.audio : null;
  }

  function getVariantRole(q, tplIndex) {
    const v = q && q.variants[tplIndex];
    if (typeof v === 'object' && v && v.role) return v.role;
    return null;
  }

  function setTplIndex(qIndex, i) {
    const q = QUESTIONS[qIndex];
    const max = q ? q.variants.length - 1 : 0;
    state.tplByQ[qIndex] = Math.min(Math.max(0, i), max);
    saveState();
  }

  function togglePin(qIndex) {
    const inPin = state.pinOrder.indexOf(qIndex) >= 0;
    if (inPin) {
      state.pinOrder = state.pinOrder.filter(function (j) { return j !== qIndex; });
    } else {
      state.pinOrder = [qIndex].concat(state.pinOrder.filter(function (j) { return j !== qIndex; }));
    }
    saveState();
  }

  let onActiveQuestionChanged = function () {};

  function setActive(qIndex) {
    state.activeQIndex = qIndex;
    saveState();
    onActiveQuestionChanged();
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // —— global audio controller (single element, no per-button Audio instances) ——
  const audioEl = document.createElement('audio');
  audioEl.setAttribute('playsinline', '');
  audioEl.preload = 'auto';
  audioEl.style.display = 'none';
  document.body.appendChild(audioEl);

  /** @type {{ mode: 'none'|'single'|'pack', singleQIndex: number|null, lastPlayback: { qIndex: number, tplIndex: number, src: string }|null }} */
  const ac = {
    mode: 'none',
    singleQIndex: null,
    lastPlayback: null
  };

  let packLoopBtnEl = null;

  function buildPackQueue() {
    const order = buildRenderOrder();
    const queue = [];
    for (let k = 0; k < order.length; k++) {
      const qIndex = order[k];
      const q = QUESTIONS[qIndex];
      if (!q) continue;
      const tplIndex = getTplIndex(qIndex);
      const src = getVariantAudio(q, tplIndex);
      if (src) {
        queue.push({ qIndex: qIndex, tplIndex: tplIndex, src: src });
      }
    }
    return queue;
  }

  function clearPlaybackDom() {
    document.querySelectorAll('.section.audio-playing').forEach(function (el) {
      el.classList.remove('audio-playing');
    });
    document.querySelectorAll('.audio-btn.is-playing').forEach(function (el) {
      el.classList.remove('is-playing');
    });
    document.querySelectorAll('.loop-mini-btn.active').forEach(function (el) {
      el.classList.remove('active');
    });
    const packLoopBtn = document.getElementById('pack-loop-btn');
    if (packLoopBtn) packLoopBtn.classList.remove('active');
  }

  function syncPlaybackDom() {
    clearPlaybackDom();
    if (ac.mode === 'pack' && packLoopBtnEl) {
      packLoopBtnEl.classList.add('active');
    }
    if (ac.mode === 'single' && ac.singleQIndex != null) {
      const sec = document.querySelector('.section[data-q-index="' + ac.singleQIndex + '"]');
      if (sec) {
        const lb = sec.querySelector('.loop-mini-btn.loop-single');
        if (lb) lb.classList.add('active');
      }
    }
    if (!ac.lastPlayback) return;
    const lp = ac.lastPlayback;
    if (audioEl.paused) return;
    const sec = document.querySelector('.section[data-q-index="' + lp.qIndex + '"]');
    if (!sec) return;
    sec.classList.add('audio-playing');
    const playBtn = sec.querySelector('.audio-btn');
    if (playBtn) playBtn.classList.add('is-playing');
  }

  function stopPlayback(resetMode) {
    audioEl.pause();
    audioEl.removeAttribute('src');
    audioEl.load();
    ac.lastPlayback = null;
    if (resetMode) {
      ac.mode = 'none';
      ac.singleQIndex = null;
    }
    clearPlaybackDom();
  }

  function stopPackLoop() {
    if (ac.mode !== 'pack') return;
    stopPlayback(true);
  }

  function stopSingleLoop() {
    if (ac.mode !== 'single') return;
    stopPlayback(true);
  }

  function stopAllLoopsAndOneShot() {
    audioEl.pause();
    audioEl.removeAttribute('src');
    audioEl.load();
    ac.mode = 'none';
    ac.singleQIndex = null;
    ac.lastPlayback = null;
    clearPlaybackDom();
  }

  function onAudioError() {
    stopAllLoopsAndOneShot();
    audioEl.removeAttribute('src');
    audioEl.load();
  }

  function playSrc(src, qIndex, tplIndex) {
    if (!src) return;
    ac.lastPlayback = { qIndex: qIndex, tplIndex: tplIndex, src: src };
    audioEl.src = src;
    audioEl.play().catch(function () {
      onAudioError();
    });
  }

  function playOnce(qIndex, tplIndex, src) {
    stopAllLoopsAndOneShot();
    playSrc(src, qIndex, tplIndex);
    syncPlaybackDom();
  }

  function startSingleLoop(qIndex) {
    const q = QUESTIONS[qIndex];
    if (!q) return;
    const tplIndex = getTplIndex(qIndex);
    const src = getVariantAudio(q, tplIndex);
    if (!src) return;
    stopAllLoopsAndOneShot();
    ac.mode = 'single';
    ac.singleQIndex = qIndex;
    playSrc(src, qIndex, tplIndex);
    syncPlaybackDom();
  }

  function toggleSingleLoop(qIndex) {
    const q = QUESTIONS[qIndex];
    if (!q) return;
    const tplIndex = getTplIndex(qIndex);
    const src = getVariantAudio(q, tplIndex);
    if (!src) return;
    if (ac.mode === 'single' && ac.singleQIndex === qIndex) {
      stopSingleLoop();
      return;
    }
    startSingleLoop(qIndex);
  }

  function startPackLoop() {
    const queue = buildPackQueue();
    if (queue.length === 0) return;
    stopAllLoopsAndOneShot();
    ac.mode = 'pack';
    ac.singleQIndex = null;
    const first = queue[0];
    playSrc(first.src, first.qIndex, first.tplIndex);
    syncPlaybackDom();
  }

  function togglePackLoop() {
    if (ac.mode === 'pack') {
      stopPackLoop();
      return;
    }
    startPackLoop();
  }

  audioEl.addEventListener('ended', function () {
    if (ac.mode === 'single' && ac.singleQIndex != null) {
      const q = QUESTIONS[ac.singleQIndex];
      if (!q) {
        stopSingleLoop();
        return;
      }
      const tplIndex = getTplIndex(ac.singleQIndex);
      const src = getVariantAudio(q, tplIndex);
      if (!src) {
        stopSingleLoop();
        return;
      }
      playSrc(src, ac.singleQIndex, tplIndex);
      syncPlaybackDom();
      return;
    }
    if (ac.mode === 'pack') {
      const queue = buildPackQueue();
      if (queue.length === 0) {
        stopPackLoop();
        return;
      }
      const finished = ac.lastPlayback;
      let nextIdx = 0;
      if (finished) {
        const i = queue.findIndex(function (e) {
          return e.qIndex === finished.qIndex && e.tplIndex === finished.tplIndex && e.src === finished.src;
        });
        if (i >= 0) {
          nextIdx = (i + 1) % queue.length;
        }
      }
      const next = queue[nextIdx];
      playSrc(next.src, next.qIndex, next.tplIndex);
      syncPlaybackDom();
      return;
    }
    ac.lastPlayback = null;
    ac.mode = 'none';
    syncPlaybackDom();
  });

  audioEl.addEventListener('error', function () {
    onAudioError();
  });

  audioEl.addEventListener('play', function () {
    syncPlaybackDom();
  });

  function syncAudioStateAfterRender() {
    if (ac.mode === 'single' && ac.singleQIndex != null) {
      const q = QUESTIONS[ac.singleQIndex];
      if (!q) {
        stopSingleLoop();
        return;
      }
      const tplIndex = getTplIndex(ac.singleQIndex);
      const src = getVariantAudio(q, tplIndex);
      if (!src) {
        stopSingleLoop();
        return;
      }
      if (ac.lastPlayback && ac.lastPlayback.src !== src) {
        playSrc(src, ac.singleQIndex, tplIndex);
      }
    }
    if (ac.mode === 'pack') {
      const queue = buildPackQueue();
      if (queue.length === 0) {
        stopPackLoop();
        return;
      }
      if (ac.lastPlayback) {
        const i = queue.findIndex(function (e) {
          return e.qIndex === ac.lastPlayback.qIndex &&
            e.tplIndex === ac.lastPlayback.tplIndex &&
            e.src === ac.lastPlayback.src;
        });
        if (i < 0) {
          stopPackLoop();
        }
      }
    }
    if (packLoopBtnEl) {
      packLoopBtnEl.disabled = buildPackQueue().length === 0;
    }
    syncPlaybackDom();
  }

  function renderAudioControls(qIndex, tplIndex, src) {
    const wrap = document.createElement('div');
    wrap.className = 'audio-controls';

    const loopBtn = document.createElement('button');
    loopBtn.type = 'button';
    loopBtn.className = 'loop-mini-btn loop-single';
    loopBtn.setAttribute('aria-label', '單曲循環');
    const loopImg = document.createElement('img');
    loopImg.src = 'loop-mini.png';
    loopImg.alt = '';
    loopBtn.appendChild(loopImg);
    loopBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setActive(qIndex);
      toggleSingleLoop(qIndex);
    });

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'audio-btn';
    btn.textContent = '🔊';
    btn.setAttribute('aria-label', '播放語音');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setActive(qIndex);
      playOnce(qIndex, tplIndex, src);
    });

    wrap.appendChild(loopBtn);
    wrap.appendChild(btn);
    return wrap;
  }

  function render() {
    const container = document.getElementById('sections');
    const order = buildRenderOrder();
    container.innerHTML = '';
    order.forEach(function (qIndex) {
      const q = QUESTIONS[qIndex];
      const tplIndex = getTplIndex(qIndex);
      const num = q.id || (qIndex + 1);
      let mark;
      if (q.emoji) {
        mark = q.emoji;
      } else if (num >= 1 && num <= 9) {
        mark = num + '\uFE0F\u20E3';
      } else {
        mark = String(num);
      }
      const section = document.createElement('div');
      section.className = 'section';
      section.dataset.qIndex = String(qIndex);
      const isPinned = state.pinOrder.indexOf(qIndex) >= 0;
      section.innerHTML =
        '<div class="row">' +
          '<span class="title">' + escapeHtml(mark + ' ' + q.title) + '</span>' +
          '<span class="nav">' +
            '<button type="button" class="pin' + (isPinned ? ' pinned' : '') + '" data-q="' + qIndex + '" aria-label="置頂"><img src="pin-mini.png" alt=""></button>' +
            '<button type="button" class="prev" data-q="' + qIndex + '" aria-label="上一模板">◀</button>' +
            '<button type="button" class="next" data-q="' + qIndex + '" aria-label="下一模板">▶</button>' +
          '</span>' +
        '</div>' +
        '<div class="box"><div class="content"></div></div>';
      section.querySelector('.content').textContent = getVariantContent(q, tplIndex);
      const variantAudio = getVariantAudio(q, tplIndex);
      if (variantAudio) {
        const box = section.querySelector('.box');
        box.appendChild(renderAudioControls(qIndex, tplIndex, variantAudio));
      }
      const prevBtn = section.querySelector('.prev');
      const nextBtn = section.querySelector('.next');
      const pinBtn = section.querySelector('.pin');
      prevBtn.disabled = tplIndex <= 0;
      nextBtn.disabled = tplIndex >= q.variants.length - 1;

      function setActiveAnd(fn) {
        setActive(qIndex);
        if (fn) fn();
      }
      section.addEventListener('click', function () { setActive(qIndex); });
      pinBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        setActiveAnd(function () { togglePin(qIndex); render(); });
      });
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        setActiveAnd();
        if (tplIndex > 0) {
          setTplIndex(qIndex, tplIndex - 1);
          render();
        }
      });
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        setActiveAnd();
        if (tplIndex < q.variants.length - 1) {
          setTplIndex(qIndex, tplIndex + 1);
          render();
        }
      });
      container.appendChild(section);
    });

    syncAudioStateAfterRender();
    renderQuestionPanel();
    renderMobileQuestionDrawer();
  }

  /** 將指定題目的 section 頂緣對齊視口上緣（略留 offset）；不 smooth。 */
  function scrollQuestionToViewportTop(qIndex) {
    if (qIndex < 0 || qIndex >= QUESTIONS.length) return;
    requestAnimationFrame(function () {
      const target = document.querySelector('.section[data-q-index="' + qIndex + '"]');
      if (!target) return;
      const topOffset = 8;
      const y = window.scrollY + target.getBoundingClientRect().top - topOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'auto' });
    });
  }

  function jumpToQuestion(qIndex) {
    if (qIndex < 0 || qIndex >= QUESTIONS.length) return;
    setActive(qIndex);
    render();
    scrollQuestionToViewportTop(qIndex);
  }

  function scrollToPrevNext(direction) {
    const container = document.getElementById('sections');
    const activeEl = container.querySelector('.section[data-q-index="' + state.activeQIndex + '"]');
    if (!activeEl) return;
    const target = direction === 'up' ? activeEl.previousElementSibling : activeEl.nextElementSibling;
    if (!target || !target.classList.contains('section')) return;
    const qIndex = parseInt(target.dataset.qIndex, 10);
    state.activeQIndex = qIndex;
    saveState();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('keydown', function (e) {
    if (e.target.closest('button') || e.target.isContentEditable) return;
    switch (e.key) {
      case 'ArrowLeft': {
        const cur = getTplIndex(state.activeQIndex);
        if (cur > 0) {
          setTplIndex(state.activeQIndex, cur - 1);
          render();
          e.preventDefault();
        }
        break;
      }
      case 'ArrowRight': {
        const q = QUESTIONS[state.activeQIndex];
        const cur = getTplIndex(state.activeQIndex);
        if (q && cur < q.variants.length - 1) {
          setTplIndex(state.activeQIndex, cur + 1);
          render();
          e.preventDefault();
        }
        break;
      }
      case 'ArrowUp':
        scrollToPrevNext('up');
        e.preventDefault();
        break;
      case 'ArrowDown':
        scrollToPrevNext('down');
        e.preventDefault();
        break;
    }
  });

  // pack label row + pack loop
  const packLabelEl = document.getElementById('pack-label');
  if (packLabelEl) {
    const raw = PACK.displayName || PACK.name || currentPack;
    packLabelEl.textContent = raw.replace(/-/g, ' ').toUpperCase();

    const packRow = document.createElement('div');
    packRow.className = 'pack-label-row';
    packLabelEl.parentNode.insertBefore(packRow, packLabelEl);
    packRow.appendChild(packLabelEl);

    packLoopBtnEl = document.createElement('button');
    packLoopBtnEl.id = 'pack-loop-btn';
    packLoopBtnEl.type = 'button';
    packLoopBtnEl.className = 'loop-mini-btn loop-pack';
    packLoopBtnEl.setAttribute('aria-label', '全 pack 音頻順序循環');
    const plImg = document.createElement('img');
    plImg.src = 'loop-mini.png';
    plImg.alt = '';
    packLoopBtnEl.appendChild(plImg);
    packLoopBtnEl.addEventListener('click', function () {
      if (buildPackQueue().length === 0) return;
      togglePackLoop();
    });
    packRow.appendChild(packLoopBtnEl);
  }

  function navigateToPack(key) {
    if (!PACK_ORDER.includes(key)) return;
    const url = new URL(window.location.href);
    url.searchParams.set('pack', key);
    window.location.href = url.toString();
  }

  function setPanelRowSelected(key) {
    if (key) {
      panelSelectedPack = key;
      setPackPinState(key);
    } else {
      panelSelectedPack = null;
      setPackPinState(null);
    }
  }

  function renderPackPanel() {
    const listEl = document.getElementById('pack-panel-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    PACK_ORDER.forEach(function (key) {
      const row = document.createElement('div');
      row.className = 'pack-item' + (panelSelectedPack === key ? ' active' : '');
      row.dataset.pack = key;

      const prefix = document.createElement('span');
      prefix.className = 'pack-item-prefix';
      prefix.textContent = '\u27A2';

      const nameEl = document.createElement('span');
      nameEl.className = 'pack-item-name';
      nameEl.textContent = formatPackListLabel(key);

      row.addEventListener('click', function () {
        if (panelSelectedPack === key) {
          setPanelRowSelected(null);
          renderPackPanel();
          return;
        }
        setPanelRowSelected(key);
        renderPackPanel();
        if (key !== currentPack) {
          navigateToPack(key);
        }
      });

      row.appendChild(prefix);
      row.appendChild(nameEl);
      listEl.appendChild(row);
    });
  }

  function closeAllMobileDrawers() {
    const packDrawer = document.getElementById('pack-mobile-drawer');
    const questionDrawer = document.getElementById('question-mobile-drawer');
    const packTg = document.getElementById('pack-drawer-toggle');
    const questionTg = document.getElementById('question-drawer-toggle');
    if (packDrawer) packDrawer.classList.remove('is-open');
    if (questionDrawer) questionDrawer.classList.remove('is-open');
    if (packTg) packTg.setAttribute('aria-expanded', 'false');
    if (questionTg) questionTg.setAttribute('aria-expanded', 'false');
    setMobileDrawerState('none');
  }

  function openMobileDrawer(type) {
    closeAllMobileDrawers();
    if (type === 'pack') {
      const drawer = document.getElementById('pack-mobile-drawer');
      const dt = document.getElementById('pack-drawer-toggle');
      if (drawer) {
        drawer.classList.add('is-open');
        renderMobilePackDrawer();
      }
      if (dt) dt.setAttribute('aria-expanded', 'true');
    } else if (type === 'question') {
      const drawer = document.getElementById('question-mobile-drawer');
      const dt = document.getElementById('question-drawer-toggle');
      if (drawer) {
        drawer.classList.add('is-open');
        renderMobileQuestionDrawer();
      }
      if (dt) dt.setAttribute('aria-expanded', 'true');
    }
    setMobileDrawerState(type);
  }

  function renderQuestionPanel() {
    const listEl = document.getElementById('question-panel-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    QUESTIONS.forEach(function (q, qIndex) {
      const row = document.createElement('div');
      row.className = 'question-item' + (state.activeQIndex === qIndex ? ' active' : '');
      row.dataset.qIndex = String(qIndex);
      const prefix = document.createElement('span');
      prefix.className = 'question-item-prefix';
      prefix.textContent = '\u27A2';
      const nameEl = document.createElement('span');
      nameEl.className = 'question-item-name';
      nameEl.textContent = q.title || '';
      row.addEventListener('click', function () {
        jumpToQuestion(qIndex);
      });
      row.appendChild(prefix);
      row.appendChild(nameEl);
      listEl.appendChild(row);
    });
  }

  function renderMobileQuestionDrawer() {
    const listEl = document.getElementById('question-mobile-drawer-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    QUESTIONS.forEach(function (q, qIndex) {
      const row = document.createElement('div');
      row.className = 'question-item' + (state.activeQIndex === qIndex ? ' active' : '');
      row.dataset.qIndex = String(qIndex);
      const prefix = document.createElement('span');
      prefix.className = 'question-item-prefix';
      prefix.textContent = '\u27A2';
      const nameEl = document.createElement('span');
      nameEl.className = 'question-item-name';
      nameEl.textContent = q.title || '';
      row.addEventListener('click', function () {
        closeAllMobileDrawers();
        jumpToQuestion(qIndex);
      });
      row.appendChild(prefix);
      row.appendChild(nameEl);
      listEl.appendChild(row);
    });
  }

  function renderMobilePackDrawer() {
    const listEl = document.getElementById('pack-mobile-drawer-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    PACK_ORDER.forEach(function (key) {
      const row = document.createElement('div');
      row.className = 'pack-item' + (panelSelectedPack === key ? ' active' : '');
      row.dataset.pack = key;

      const prefix = document.createElement('span');
      prefix.className = 'pack-item-prefix';
      prefix.textContent = '\u27A2';

      const nameEl = document.createElement('span');
      nameEl.className = 'pack-item-name';
      nameEl.textContent = formatPackListLabel(key);

      row.addEventListener('click', function () {
        if (panelSelectedPack === key) {
          setPanelRowSelected(null);
          renderPackPanel();
          renderMobilePackDrawer();
          closeAllMobileDrawers();
          return;
        }
        setPanelRowSelected(key);
        renderPackPanel();
        renderMobilePackDrawer();
        if (key !== currentPack) {
          if (isMobileViewport()) setMobileDrawerState('pack');
          navigateToPack(key);
          return;
        }
        if (isMobileViewport()) closeAllMobileDrawers();
      });

      row.appendChild(prefix);
      row.appendChild(nameEl);
      listEl.appendChild(row);
    });
  }

  const mobileDrawer = document.createElement('div');
  mobileDrawer.id = 'pack-mobile-drawer';
  mobileDrawer.setAttribute('aria-label', 'Pack list');
  const mobileList = document.createElement('div');
  mobileList.id = 'pack-mobile-drawer-list';
  mobileDrawer.appendChild(mobileList);
  document.body.appendChild(mobileDrawer);

  mobileDrawer.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  const questionMobileDrawer = document.createElement('div');
  questionMobileDrawer.id = 'question-mobile-drawer';
  questionMobileDrawer.setAttribute('aria-label', 'Question list');
  const questionMobileList = document.createElement('div');
  questionMobileList.id = 'question-mobile-drawer-list';
  questionMobileDrawer.appendChild(questionMobileList);
  document.body.appendChild(questionMobileDrawer);

  questionMobileDrawer.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  function goToNextPack() {
    setPanelRowSelected(null);
    renderPackPanel();
    renderMobilePackDrawer();
    const idx = PACK_ORDER.indexOf(currentPack);
    const nextIndex = (idx + 1) % PACK_ORDER.length;
    const nextPack = PACK_ORDER[nextIndex];
    const url = new URL(window.location.href);
    url.searchParams.set('pack', nextPack);
    window.location.href = url.toString();
  }

  // floating pack switch button（mobile / desktop 均為單擊切下一個 pack）
  const packBtn = document.createElement('div');
  packBtn.id = 'pack-switch';
  packBtn.textContent = PACK_LABEL[currentPack] || '🌐';
  packBtn.setAttribute('role', 'button');
  packBtn.setAttribute('tabindex', '0');
  document.body.appendChild(packBtn);
  if (isStandalonePackKey(currentPack)) {
    packBtn.style.display = 'none';
  }

  const drawerToggle = document.createElement('button');
  drawerToggle.id = 'pack-drawer-toggle';
  drawerToggle.type = 'button';
  drawerToggle.textContent = '\u25FF';
  drawerToggle.setAttribute('aria-label', 'Pack 列表');
  drawerToggle.setAttribute('aria-expanded', 'false');
  drawerToggle.setAttribute('aria-controls', 'pack-mobile-drawer');
  drawerToggle.setAttribute('aria-haspopup', 'true');
  document.body.appendChild(drawerToggle);

  const questionDrawerToggle = document.createElement('button');
  questionDrawerToggle.id = 'question-drawer-toggle';
  questionDrawerToggle.type = 'button';
  questionDrawerToggle.textContent = '\u2261';
  questionDrawerToggle.setAttribute('aria-label', '題目列表');
  questionDrawerToggle.setAttribute('aria-expanded', 'false');
  questionDrawerToggle.setAttribute('aria-controls', 'question-mobile-drawer');
  questionDrawerToggle.setAttribute('aria-haspopup', 'true');
  document.body.appendChild(questionDrawerToggle);

  // CCE: conversation continuation engine（固定浮層，無 prompt，一鍵續接）
  const cceBox = document.getElementById('cce-box');
  const cceContent = document.getElementById('cce-content');
  const cceGenerateBtn = document.getElementById('cce-generate');
  const cceModeAutoBtn = document.getElementById('cce-mode-auto');
  const cceModeGeneralBtn = document.getElementById('cce-mode-general');
  const cceModeUxBtn = document.getElementById('cce-mode-ux');
  const cceModeSystemBtn = document.getElementById('cce-mode-system');

  const CHEAT = {
    start: [
      'そうですね、少し整理しながらお話しすると…',
      '一言で言うのは難しいんですが…',
      '実際に触ってみると感じるのは…',
      'まだ完全に整理できているわけではないのですが…',
      'いくつか観点があると思っていて…',
      'まず前提として考えているのは…'
    ],
    mid: {
      general: [
        '自分はまず理解しやすさを優先しています。',
        '完全な最適解というより、扱いやすさとのバランスで考えています。',
        'このあたりは実装して初めて見えてくる部分も多くて…',
        '実際の利用シーンを考えると、この選択が自然でした。',
        'どこまで抽象化するかはかなり意識しています。',
        '一見シンプルに見えるんですが、裏側では結構制約があります。'
      ],
      ux: [
        'UXは見た目というより、構造の伝わり方だと考えています。',
        'ユーザーが今何をしているか分かることを重要視しています。',
        '操作できることより、迷わないことのほうが重要だと思っています。',
        '学習コストが低いかどうかはかなり大きな要素です。',
        'インターフェースの反応の一貫性をかなり意識しています。',
        '体験と内部構造がズレすぎないことを重視しています。',
        'ユーザーが受け身になりすぎない設計を意識しています。'
      ],
      system: [
        '設計としては自然な形にフィットすることを優先しています。',
        '状態を保存するより、状態を導出する方向で考えています。',
        'イベント単位で構造を持たせる設計にしています。',
        '責務の切り方はかなり慎重に決めています。',
        '一貫性を保つ代わりに、実装コストはある程度許容しています。',
        '構造的に説明可能であることを重視しています。',
        '内部的には因果関係が追えるようにしています。'
      ]
    },
    end: [
      '現時点ではそのように考えています。',
      'まだ試行中ですが、その方向で整理しています。',
      '完全ではないですが、今はそういう理解です。',
      '今のところはその設計で進めています。',
      '実際にはケースによって変わると思いますが、基本的にはその考えです。',
      'あくまで現時点での整理ですが、そのように捉えています。'
    ]
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function clearChildren(el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  /** partId: logical slice key (e.g. start | mid | end | ack | ask | expand) for data-part + reroll routing */
  function buildHelperBlock(partId, label, value, rerollFn) {
    const block = document.createElement('div');
    block.className = 'helper-block';
    if (partId) block.setAttribute('data-part', partId);

    const labelEl = document.createElement('div');
    labelEl.className = 'helper-block-label';
    labelEl.textContent = label;

    const textEl = document.createElement('div');
    textEl.className = 'helper-block-text';
    textEl.textContent = value;
    textEl.addEventListener('click', function (e) {
      e.stopPropagation();
      textEl.classList.add('is-rerolling');
      const next = rerollFn();
      if (typeof next === 'string') textEl.textContent = next;
      window.setTimeout(function () {
        textEl.classList.remove('is-rerolling');
      }, 200);
    });

    block.appendChild(labelEl);
    block.appendChild(textEl);
    return block;
  }

  function inferCCEModeFromQuestionTitle(title) {
    const t = String(title || '').toLowerCase();
    if (!t) return 'general';
    if (
      t.includes('ux') ||
      t.includes('ユーザー') ||
      t.includes('プロダクト') ||
      t.includes('体験')
    ) return 'ux';
    if (
      t.includes('system') ||
      t.includes('履歴') ||
      t.includes('append-only') ||
      t.includes('設計') ||
      t.includes('説明可能性') ||
      t.includes('構造') ||
      t.includes('state')
    ) return 'system';
    return 'general';
  }

  let cceManualMode = null; // null = auto, otherwise 'general'|'ux'|'system'
  let cceRendered = { mode: 'general', start: '', mid: '', end: '' };

  function getActiveQuestionTitle() {
    const q = QUESTIONS[state.activeQIndex];
    return q && q.title ? q.title : '';
  }

  function resolveCCEMode() {
    if (cceManualMode) return cceManualMode;
    return inferCCEModeFromQuestionTitle(getActiveQuestionTitle());
  }

  function refreshCceModeUI(mode) {
    cceModeAutoBtn.classList.toggle('active', cceManualMode === null);
    cceModeGeneralBtn.classList.toggle('active', mode === 'general');
    cceModeUxBtn.classList.toggle('active', mode === 'ux');
    cceModeSystemBtn.classList.toggle('active', mode === 'system');
  }

  function renderCCEBlocks() {
    clearChildren(cceContent);
    cceContent.appendChild(buildHelperBlock('start', '[起手]', cceRendered.start, function () {
      cceRendered.start = pick(CHEAT.start);
      return cceRendered.start;
    }));
    cceContent.appendChild(buildHelperBlock('mid', '[中段]', cceRendered.mid, function () {
      cceRendered.mid = pick(CHEAT.mid[cceRendered.mode]);
      return cceRendered.mid;
    }));
    cceContent.appendChild(buildHelperBlock('end', '[収束]', cceRendered.end, function () {
      cceRendered.end = pick(CHEAT.end);
      return cceRendered.end;
    }));
  }

  function generateCCE(mode) {
    const useMode = mode || resolveCCEMode();
    cceRendered = {
      mode: useMode,
      start: pick(CHEAT.start),
      mid: pick(CHEAT.mid[useMode]),
      end: pick(CHEAT.end)
    };
    renderCCEBlocks();
    refreshCceModeUI(useMode);
  }

  if (cceBox && cceContent && cceGenerateBtn && cceModeAutoBtn && cceModeGeneralBtn && cceModeUxBtn && cceModeSystemBtn) {
    cceGenerateBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      generateCCE();
    });

    cceModeAutoBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      cceManualMode = null;
      generateCCE();
    });

    cceModeGeneralBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      cceManualMode = 'general';
      generateCCE('general');
    });
    cceModeUxBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      cceManualMode = 'ux';
      generateCCE('ux');
    });
    cceModeSystemBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      cceManualMode = 'system';
      generateCCE('system');
    });

    onActiveQuestionChanged = function () {
      if (cceManualMode === null) {
        generateCCE();
      } else {
        refreshCceModeUI(cceManualMode);
      }
    };

    generateCCE();
  }

  // CBL: catch ball layer（接球 + 輕反問 + つなぎ）
  const cblBox = document.getElementById('cbl-box');
  const cblContent = document.getElementById('cbl-content');
  const cblGenerateBtn = document.getElementById('cbl-generate');

  const CBL = {
    ack: [
      'なるほど、その視点はすごく重要だと思います。',
      '確かに、その考え方はかなり納得感があります。',
      'そこは実際にやってみると差が出る部分ですよね。',
      'その話、すごくリアルだなと感じました。',
      '自分もその点はかなり共感があります。',
      'その前提で考えるのは自然だと思います。',
      'そこは見落としがちですが大事なポイントですよね。',
      'その整理の仕方はすごく分かりやすいです。'
    ],
    ask: [
      'ちなみに、そのあたりは実際にはどのように運用されることが多いのでしょうか。',
      'その点について、現場ではどのような判断が多いのでしょうか。',
      '御社の場合だと、どちらを優先されるケースが多いですか。',
      'その部分で難しくなりやすいポイントはどこにありますか。',
      '逆に、その設計で問題になるケースはありますか。',
      'もう少し具体的な事例があればぜひ伺いたいです。',
      'その判断基準はどのように決められているのでしょうか。',
      '実際にはどの程度まで抽象化されているのでしょうか。'
    ],
    expand: [
      '自分もそのあたりはもう少し理解を深めたいと思っていて…',
      'まだ完全に整理できているわけではないのですが…',
      '実際に触れてみないと分からない部分も多いと感じています。',
      '少し自分の中でも考えながら聞いているのですが…',
      'その点は今ちょうど関心がある部分でもあります。',
      '自分の中でもまだ仮説段階なのですが…',
      'もう少し解像度を上げたいと思っているところです。',
      '今まさにその部分をどう捉えるか考えていました。'
    ]
  };

  let cblRendered = { ack: '', ask: '', expand: '' };

  function renderCBLBlocks() {
    clearChildren(cblContent);
    cblContent.appendChild(buildHelperBlock('ack', '[接球]', cblRendered.ack, function () {
      cblRendered.ack = pick(CBL.ack);
      return cblRendered.ack;
    }));
    cblContent.appendChild(buildHelperBlock('ask', '[軽い反問]', cblRendered.ask, function () {
      cblRendered.ask = pick(CBL.ask);
      return cblRendered.ask;
    }));
    cblContent.appendChild(buildHelperBlock('expand', '[つなぎ]', cblRendered.expand, function () {
      cblRendered.expand = pick(CBL.expand);
      return cblRendered.expand;
    }));
  }

  function generateCBL() {
    cblRendered = {
      ack: pick(CBL.ack),
      ask: pick(CBL.ask),
      expand: pick(CBL.expand)
    };
    renderCBLBlocks();
  }

  if (cblBox && cblContent && cblGenerateBtn) {
    cblGenerateBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      generateCBL();
    });
    generateCBL();
  }

  // CRE: conversation relay engine（CCE + CBL 混合入口）
  const creBox = document.getElementById('cre-box');
  const creContent = document.getElementById('cre-content');
  const creGenerateBtn = document.getElementById('cre-generate');
  const creModeAutoBtn = document.getElementById('cre-mode-auto');
  const creModeSpeakBtn = document.getElementById('cre-mode-speak');
  const creModeRelayBtn = document.getElementById('cre-mode-relay');

  let creMode = 'auto'; // auto | speak | relay
  let creRendered = {
    resolvedMode: 'speak',
    speakSubtype: 'general',
    start: '',
    mid: '',
    end: '',
    ack: '',
    ask: '',
    expand: ''
  };

  function inferSpeakSubtype(title) {
    const t = String(title || '').toLowerCase();
    if (/ux|ユーザー|主体性|プロダクト/.test(t)) return 'ux';
    if (/system|履歴|append|設計|説明可能性|構造|state/.test(t)) return 'system';
    return 'general';
  }

  function inferCREMode(title) {
    const t = String(title || '').toLowerCase();
    if (/逆質問|discussion|company|会社|面談|対話|会話|interviewer/.test(t)) return 'relay';
    return 'speak';
  }

  function renderCREBlocks() {
    clearChildren(creContent);
    if (creRendered.resolvedMode === 'relay') {
      creContent.appendChild(buildHelperBlock('ack', '[接球]', creRendered.ack, function () {
        creRendered.ack = pick(CBL.ack);
        return creRendered.ack;
      }));
      creContent.appendChild(buildHelperBlock('ask', '[軽い反問]', creRendered.ask, function () {
        creRendered.ask = pick(CBL.ask);
        return creRendered.ask;
      }));
      creContent.appendChild(buildHelperBlock('expand', '[つなぎ]', creRendered.expand, function () {
        creRendered.expand = pick(CBL.expand);
        return creRendered.expand;
      }));
      return;
    }
    creContent.appendChild(buildHelperBlock('start', '[起手]', creRendered.start, function () {
      creRendered.start = pick(CHEAT.start);
      return creRendered.start;
    }));
    creContent.appendChild(buildHelperBlock('mid', '[中段]', creRendered.mid, function () {
      creRendered.mid = pick(CHEAT.mid[creRendered.speakSubtype]);
      return creRendered.mid;
    }));
    creContent.appendChild(buildHelperBlock('end', '[収束]', creRendered.end, function () {
      creRendered.end = pick(CHEAT.end);
      return creRendered.end;
    }));
  }

  function refreshCreModeUI() {
    if (!creModeAutoBtn || !creModeSpeakBtn || !creModeRelayBtn) return;
    creModeAutoBtn.classList.toggle('active', creMode === 'auto');
    creModeSpeakBtn.classList.toggle('active', creMode === 'speak');
    creModeRelayBtn.classList.toggle('active', creMode === 'relay');
  }

  function generateCRE() {
    const title = getActiveQuestionTitle();
    const resolvedMode = creMode === 'auto' ? inferCREMode(title) : creMode;
    if (resolvedMode === 'relay') {
      creRendered = {
        resolvedMode: 'relay',
        speakSubtype: 'general',
        start: '',
        mid: '',
        end: '',
        ack: pick(CBL.ack),
        ask: pick(CBL.ask),
        expand: pick(CBL.expand)
      };
    } else {
      const subtype = inferSpeakSubtype(title);
      creRendered = {
        resolvedMode: 'speak',
        speakSubtype: subtype,
        start: pick(CHEAT.start),
        mid: pick(CHEAT.mid[subtype]),
        end: pick(CHEAT.end),
        ack: '',
        ask: '',
        expand: ''
      };
    }
    renderCREBlocks();
    refreshCreModeUI();
  }

  if (creBox && creContent && creGenerateBtn && creModeAutoBtn && creModeSpeakBtn && creModeRelayBtn) {
    creModeAutoBtn.addEventListener('click', function () {
      creMode = 'auto';
      generateCRE();
    });
    creModeSpeakBtn.addEventListener('click', function () {
      creMode = 'speak';
      generateCRE();
    });
    creModeRelayBtn.addEventListener('click', function () {
      creMode = 'relay';
      generateCRE();
    });
    creGenerateBtn.addEventListener('click', function () {
      generateCRE();
    });

    const prevOnActiveQuestionChanged = onActiveQuestionChanged;
    onActiveQuestionChanged = function () {
      if (typeof prevOnActiveQuestionChanged === 'function') prevOnActiveQuestionChanged();
      if (creMode === 'auto') generateCRE();
    };

    generateCRE();
  }

  document.body.addEventListener('click', function (ev) {
    if (!isMobileViewport()) return;
    const packDrawer = document.getElementById('pack-mobile-drawer');
    const qDrawer = document.getElementById('question-mobile-drawer');
    const packOpen = packDrawer && packDrawer.classList.contains('is-open');
    const qOpen = qDrawer && qDrawer.classList.contains('is-open');
    if (!packOpen && !qOpen) return;
    if (packDrawer && packDrawer.contains(ev.target)) return;
    if (qDrawer && qDrawer.contains(ev.target)) return;
    if (drawerToggle.contains(ev.target)) return;
    if (questionDrawerToggle.contains(ev.target)) return;
    closeAllMobileDrawers();
  });

  packBtn.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    packBtn.click();
  });

  packBtn.addEventListener('click', function () {
    goToNextPack();
  });

  drawerToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!isMobileViewport()) return;
    const drawer = document.getElementById('pack-mobile-drawer');
    if (drawer && drawer.classList.contains('is-open')) {
      closeAllMobileDrawers();
      return;
    }
    openMobileDrawer('pack');
  });

  drawerToggle.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    drawerToggle.click();
  });

  questionDrawerToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!isMobileViewport()) return;
    const drawer = document.getElementById('question-mobile-drawer');
    if (drawer && drawer.classList.contains('is-open')) {
      closeAllMobileDrawers();
      return;
    }
    openMobileDrawer('question');
  });

  questionDrawerToggle.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    questionDrawerToggle.click();
  });

  window.addEventListener('resize', function () {
    if (!isMobileViewport()) closeAllMobileDrawers();
  });

  renderPackPanel();
  renderMobilePackDrawer();
  setupQuickNote();
  render();
  scrollQuestionToViewportTop(state.activeQIndex);

  if (isMobileViewport()) {
    const st = getMobileDrawerState();
    if (st === 'pack') {
      openMobileDrawer('pack');
    } else if (st === 'question') {
      openMobileDrawer('question');
    }
  }
}
