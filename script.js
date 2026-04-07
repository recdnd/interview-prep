// pack loader + viewer

(function () {
  const PACK_ORDER = ["jp-interview", "cs-core", "en-interview", "en-work", "gaishi-special", "gaishi-drill", "es-deep-dive"];
  const PACK_LABEL = {
    "jp-interview": "JI",
    "cs-core": "CS",
    "en-interview": "EI",
    "en-work": "EW",
    "gaishi-special": "GS",
    "gaishi-drill": "GD",
    "es-deep-dive": "ES"
  };
  const LAST_PACK_KEY = "pp_last_pack";

  const params = new URLSearchParams(location.search);
  let currentPack = params.get("pack") || localStorage.getItem(LAST_PACK_KEY) || "jp-interview";

  // make sure unknown pack falls back to default
  if (!PACK_ORDER.includes(currentPack)) currentPack = "jp-interview";

  const script = document.createElement("script");
  script.src = "packs/" + currentPack + ".js";
  script.onload = function () {
    if (window.PACK && window.PACK.questions) {
      localStorage.setItem(LAST_PACK_KEY, window.PACK.name);
      initApp(window.PACK, currentPack, PACK_ORDER, PACK_LABEL);
    }
  };
  script.onerror = function () {
    const fallback = document.createElement("script");
    fallback.src = "packs/jp-interview.js";
    fallback.onload = function () {
      if (window.PACK && window.PACK.questions) {
        localStorage.setItem(LAST_PACK_KEY, window.PACK.name);
        initApp(window.PACK, "jp-interview", PACK_ORDER, PACK_LABEL);
      }
    };
    document.head.appendChild(fallback);
  };
  document.head.appendChild(script);
})();

function initApp(PACK, currentPack, PACK_ORDER, PACK_LABEL) {
  const QUESTIONS = PACK.questions;
  const STORAGE_KEY = "pp_" + PACK.name;

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

  // floating pack switch button
  const packBtn = document.createElement('div');
  packBtn.id = 'pack-switch';
  packBtn.textContent = PACK_LABEL[currentPack] || '🌐';
  document.body.appendChild(packBtn);

  packBtn.addEventListener('click', function () {
    const idx = PACK_ORDER.indexOf(currentPack);
    const nextIndex = (idx + 1) % PACK_ORDER.length;
    const nextPack = PACK_ORDER[nextIndex];
    const url = new URL(window.location.href);
    url.searchParams.set('pack', nextPack);
    window.location.href = url.toString();
  });

  render();
}
