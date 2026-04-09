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

const PACK_DRAWER_OPEN_KEY = "packDrawerOpen";

function setDrawerOpenState(isOpen) {
  try {
    sessionStorage.setItem(PACK_DRAWER_OPEN_KEY, isOpen ? "1" : "0");
  } catch (_) {}
}

function getDrawerOpenState() {
  try {
    return sessionStorage.getItem(PACK_DRAWER_OPEN_KEY) === "1";
  } catch (_) {
    return false;
  }
}

function isValidPackPayload(p) {
  return !!(p && Array.isArray(p.questions) && p.questions.length > 0);
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
  const PACK_ORDER = ["jp-interview", "cs-core", "en-interview", "en-work", "gaishi-special", "gaishi-drill", "es-deep-dive", "my-model", "yt-ai-special", "my-model-full"];
  const PACK_LABEL = {
    "jp-interview": "JI",
    "cs-core": "CS",
    "en-interview": "EI",
    "en-work": "EW",
    "gaishi-special": "GS",
    "gaishi-drill": "GD",
    "es-deep-dive": "ES",
    "my-model": "MM",
    "yt-ai-special": "YT",
    "my-model-full": "MF"
  };
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
  if (urlPack && PACK_ORDER.includes(urlPack)) {
    currentPack = urlPack;
  } else if (savedPinned && savedPackKey && PACK_ORDER.includes(savedPackKey)) {
    currentPack = savedPackKey;
  } else {
    currentPack = localStorage.getItem(LAST_PACK_KEY) || "jp-interview";
  }

  if (!PACK_ORDER.includes(currentPack)) currentPack = "jp-interview";

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
      try {
        localStorage.setItem(LAST_PACK_KEY, window.PACK.name);
      } catch (_) {}
      boot(window.PACK, currentPack);
      return;
    }
    if (currentPack === "jp-interview") {
      showPackLoadError("jp-interview 沒有有效的題目資料（questions）。");
      return;
    }
    injectJpFallback();
  };
  script.onerror = function () {
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
    return key.replace(/-/g, " ").toUpperCase();
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

  function setActive(qIndex) {
    state.activeQIndex = qIndex;
    saveState();
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

    const activeEl = container.querySelector('.section[data-q-index="' + state.activeQIndex + '"]');
    if (activeEl) activeEl.scrollIntoView({ behavior: 'auto', block: 'nearest' });

    syncAudioStateAfterRender();
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
      nameEl.textContent = key;

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

  function closeMobileDrawer() {
    const drawer = document.getElementById('pack-mobile-drawer');
    if (drawer) drawer.classList.remove('is-open');
    const dt = document.getElementById('pack-drawer-toggle');
    if (dt) dt.setAttribute('aria-expanded', 'false');
    setDrawerOpenState(false);
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
          closeMobileDrawer();
          return;
        }
        setPanelRowSelected(key);
        renderPackPanel();
        renderMobilePackDrawer();
        if (key !== currentPack) {
          if (isMobileViewport()) setDrawerOpenState(true);
          navigateToPack(key);
          return;
        }
        if (isMobileViewport()) closeMobileDrawer();
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

  function goToNextPack() {
    const drawer = document.getElementById('pack-mobile-drawer');
    const wasOpen = isMobileViewport() && drawer && drawer.classList.contains('is-open');
    setDrawerOpenState(!!wasOpen);

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

  const drawerToggle = document.createElement('button');
  drawerToggle.id = 'pack-drawer-toggle';
  drawerToggle.type = 'button';
  drawerToggle.textContent = '\u25FF';
  drawerToggle.setAttribute('aria-label', 'Pack 列表');
  drawerToggle.setAttribute('aria-expanded', 'false');
  drawerToggle.setAttribute('aria-controls', 'pack-mobile-drawer');
  drawerToggle.setAttribute('aria-haspopup', 'true');
  document.body.appendChild(drawerToggle);

  document.body.addEventListener('click', function (ev) {
    const drawer = document.getElementById('pack-mobile-drawer');
    if (!drawer || !drawer.classList.contains('is-open') || !isMobileViewport()) return;
    if (drawer.contains(ev.target) || drawerToggle.contains(ev.target)) return;
    closeMobileDrawer();
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
    if (!drawer) return;
    drawer.classList.toggle('is-open');
    if (drawer.classList.contains('is-open')) {
      renderMobilePackDrawer();
    }
    const isOpen = drawer.classList.contains('is-open');
    drawerToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    setDrawerOpenState(isOpen);
  });

  drawerToggle.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    drawerToggle.click();
  });

  window.addEventListener('resize', function () {
    if (!isMobileViewport()) closeMobileDrawer();
  });

  renderPackPanel();
  renderMobilePackDrawer();
  render();

  if (isMobileViewport() && getDrawerOpenState()) {
    const drawer = document.getElementById('pack-mobile-drawer');
    const dt = document.getElementById('pack-drawer-toggle');
    if (drawer && dt) {
      drawer.classList.add('is-open');
      dt.setAttribute('aria-expanded', 'true');
      renderMobilePackDrawer();
    }
  }
}
