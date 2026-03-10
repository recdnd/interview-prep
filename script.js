const STORAGE_KEY = 'pp-bin-ooo';
const QUESTIONS = [
  {
    id: 1,
    title: "前台で面接受付",
    variants: [
`本日10時から面接の予定があります。
セツシュントウと申します。`,
`本日10時から面接のお約束をしております、
セツシュントウと申します。`
    ]
  },
  {
    id: 2,
    title: "HRと初対面の挨拶",
    variants: [
`はじめまして。
セツシュントウと申します。
本日はお時間いただきありがとうございます。`
    ]
  },
  {
    id: 3,
    title: "自己紹介",
    variants: [
`はじめまして、セツシュントウと申します。
現在、立教大学文学部史学科で地中海制度史を専攻しており、今年卒業予定です。

大学に入る前はアメリカで約6年間、工学系の学校に在籍していました。

普段はバックエンドからフロントエンドまで、
フルスタックでプロダクトを作ることに興味があります。

大学在学中には "Spiral" というシステムを個人で開発しており、
その一部のツールチェーンをオープンソースとして公開しています。

特に、UXとシステム設計の関係や、
ユーザーにとって分かりやすいソフトウェアを作ることに関心があります。

本日はどうぞよろしくお願いいたします。`
    ]
  },
  {
    id: 4,
    title: "なぜ日本で働きたいのか",
    variants: [
`もともとは日本で歴史研究をしたいと思って来日しました。
日本の文化や社会に興味があり、実際に生活する中で、この環境が自分にとても合っていると感じました。

大学生活の中でソフトウェア開発やデザインにも取り組むようになり、
自分のアイデアを形にしていくことがとても面白いと感じています。

将来的には、日本の環境の中でエンジニアとして経験を積みながら、
自分のプロダクトづくりやシステム設計の力を伸ばしていきたいと思っています。`,
`もともとは歴史研究のために来日しましたが、
日本で生活する中で、この社会や働き方が自分にとても合っていると感じました。

大学ではソフトウェア開発にも取り組むようになり、
自分のアイデアをプロダクトとして形にすることに興味を持っています。

これから日本で経験を積みながら、
エンジニアとして自分の能力を試していきたいと考えています。`
    ]
  },
  {
    id: 5,
    title: "Spiralプロジェクトの説明",
    variants: [
`Spiralは、
「機械が出来事の履歴を追跡できるようにするにはどうすればいいか」
というテーマから始めたプロジェクトです。

もともとは歴史研究の文献整理の考え方から着想を得て、
イベントの履歴を構造的に扱う仕組みを作ろうと思いました。

最初はCで小さなDSLのプロトタイプを作り、
その上でいくつかの概念を整理して、
一つの実行モデルとしてまとめています。

現在はその一部を spiral-core という形で
オープンソースとして公開しています。`
    ]
  }
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tplByQ: {}, pinOrder: [], activeQIndex: 0 };
    const s = JSON.parse(raw);
    return {
      tplByQ: typeof s.tplByQ === 'object' ? s.tplByQ : {},
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
  for (var i = 0; i < QUESTIONS.length; i++) {
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

function setTplIndex(qIndex, i) {
  const q = QUESTIONS[qIndex];
  const max = q ? q.variants.length - 1 : 0;
  state.tplByQ[qIndex] = Math.min(Math.max(0, i), max);
  saveState();
}

function togglePin(qIndex) {
  var inPin = state.pinOrder.indexOf(qIndex) >= 0;
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
  var div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function render() {
  const container = document.getElementById('sections');
  const order = buildRenderOrder();
  container.innerHTML = '';
  order.forEach(function (qIndex) {
    const q = QUESTIONS[qIndex];
    const tplIndex = getTplIndex(qIndex);
    const num = qIndex + 1;
    const emoji = num + '\uFE0F\u20E3';
    const section = document.createElement('div');
    section.className = 'section';
    section.dataset.qIndex = String(qIndex);
    var isPinned = state.pinOrder.indexOf(qIndex) >= 0;
    section.innerHTML =
      '<div class="row">' +
        '<span class="title">' + escapeHtml(emoji + ' ' + q.title) + '</span>' +
        '<span class="nav">' +
          '<button type="button" class="pin' + (isPinned ? ' pinned' : '') + '" data-q="' + qIndex + '" aria-label="置頂"><img src="pin32.png" alt=""></button>' +
          '<button type="button" class="prev" data-q="' + qIndex + '" aria-label="上一模板">◀</button>' +
          '<button type="button" class="next" data-q="' + qIndex + '" aria-label="下一模板">▶</button>' +
        '</span>' +
      '</div>' +
      '<div class="box"><div class="content"></div></div>';
    section.querySelector('.content').textContent = q.variants[tplIndex] || '';
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

  var activeEl = container.querySelector('.section[data-q-index="' + state.activeQIndex + '"]');
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

render();
