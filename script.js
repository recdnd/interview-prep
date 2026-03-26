// pack loader + viewer

(function () {
  const PACK_ORDER = ["jp-interview", "cs-core", "en-interview", "en-work"];
  const PACK_LABEL = {
    "jp-interview": "JI",
    "cs-core": "CS",
    "en-interview": "EI",
    "en-work": "EW"
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
    if (v && typeof v === 'object' && v.role) return String(v.role);
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

  function renderAudioButton(src, sectionEl) {
    const btn = document.createElement('div');
    btn.className = 'audio-btn';
    btn.textContent = '🔊';
    btn.setAttribute('aria-label', '播放語音');
    const audio = new Audio(src);
    function clearState() {
      sectionEl.classList.remove('audio-playing');
      btn.classList.remove('is-playing');
    }
    btn.onclick = function () {
      audio.currentTime = 0;
      sectionEl.classList.add('audio-playing');
      btn.classList.add('is-playing');
      audio.play();
    };
    audio.addEventListener('ended', clearState);
    audio.addEventListener('pause', clearState);
    return btn;
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
      const variantRole = getVariantRole(q, tplIndex);
      const titleLine =
        escapeHtml(mark + ' ' + q.title) +
        (variantRole ? ' <span class="variant-role">' + escapeHtml(variantRole) + '</span>' : '');
      section.innerHTML =
        '<div class="row">' +
          '<span class="title">' + titleLine + '</span>' +
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
        box.appendChild(renderAudioButton(variantAudio, section));
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

  // pack label
  const packLabelEl = document.getElementById('pack-label');
  if (packLabelEl) {
    const raw = PACK.displayName || PACK.name || currentPack;
    packLabelEl.textContent = raw.replace(/-/g, ' ').toUpperCase();
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
