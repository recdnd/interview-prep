#!/usr/bin/env node
/**
 * ⚠️ 一次性合併腳本：已執行後會 unlink 舊檔。**勿在未還原 git 時重跑**。
 *
 * 一次性合併多組 pack；短／輕前置：
 * - 多行 bullet 字串：依行長度升冪
 * - variants 為物件陣列：依 text 長度升冪
 * - 合併來源順序見腳本內各區塊（輕／短組先）
 */
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(fileURLToPath(import.meta.url));
const packsDir = join(root, "..", "packs");

function loadPack(name) {
  const path = join(packsDir, `${name}.js`);
  const w = {};
  const fn = new Function("window", readFileSync(path, "utf8"));
  fn(w);
  if (!w.PACK) throw new Error(`No PACK: ${name}`);
  return structuredClone(w.PACK);
}

/** 多行 `- …` bullet 字串：行內由短到長 */
function sortBulletString(s) {
  if (typeof s !== "string") return s;
  const lines = s.split("\n");
  const bullets = lines.map((l) => l.replace(/\r$/, "")).filter((l) => /^-\s/.test(l.trim()));
  if (bullets.length < 2) return s;
  bullets.sort((a, b) => a.trim().length - b.trim().length);
  return bullets.join("\n");
}

function sortVariants(variants) {
  if (!Array.isArray(variants)) return variants;
  const sorted = variants.map((v) => {
    if (typeof v === "string") return sortBulletString(v);
    if (v && typeof v === "object" && typeof v.text === "string") {
      return { ...v, text: sortBulletString(v.text) };
    }
    return v;
  });
  sorted.sort((a, b) => {
    const len = (x) => {
      if (typeof x === "string") return x.length;
      if (x && typeof x.text === "string") return x.text.length;
      return 0;
    };
    return len(a) - len(b);
  });
  return sorted;
}

function normalizeQuestions(questions) {
  return questions.map((q, i) => ({
    ...q,
    id: i + 1,
    variants: sortVariants(q.variants || [])
  }));
}

const SMART_FULL_Q1 = {
  id: 1,
  title: "高級工程師/產品人現場真的會說的完整短句",
  emoji: "🧠",
  variants: [
    `- そうですね。自分の中では、いきなり答えを出すより、先に何が混ざっているかを分ける方が自然です。
- 短く言うと、実装そのものより、その前で問題をどう切るかに重心があります。
- 表面的には機能の話に見えても、実際には認識合わせの問題になっていることは多いと思っています。
- 自分は、整理したら終わりではなくて、その整理を次の確認にどうつなげるかまで見たいタイプです。
- まず小さく成立させて、そこから違和感を拾いながら詰める進め方の方が多いです。
- いったん切り分けて話すと、仕様の問題と運用の問題は別で見た方がいいと思っています。
- 自分が最初に見るのは、何が未確定で、どこから確かめると前に進むかです。
- 会議でも、すぐ結論を出すというより、今どこが論点として混ざっているのかを分ける方が多いです。
- そのままだと少し大きいので、まずチームで扱える単位まで落としたいです。
- 仮説として置くなら、何を見れば残してよくて、何が見えたら捨てるかまで必要だと思っています。
- 自分としては、抽象化すること自体より、抽象化したものを次の一手につなげる方を重く見ています。
- 実装の速度も大事なんですが、そもそも何を作ると前に進むのかの方が先にあると思っています。
- 少なくとも自分は、きれいな整理より、実際に進めやすい整理の方を優先しています。
- 一見すると小さい違いでも、前提がずれると後ろの判断が全部変わるので、そこはかなり気にしています。
- 自分の価値が出しやすいのは、曖昧な状態のものを、そのまま扱わずに切り分けるところだと思っています。
- 結論を急ぐより、先に論点の粒度をそろえた方が、結果的に速いことが多いです。
- どちらかというと、派手に何かを変えるより、混線しているものを解いて進めやすくする方が自然です。
- 仕様を固めるというより、まず何を決めれば次に進めるのかを見に行くことが多いです。
- そこは感覚で決めるというより、少なくともどの情報があれば判断できるかを置いてから考えたいです。
- 自分の中では、良い整理というのは、聞いてきれいなものではなくて、そのあと実際に動けるものです。`
  ]
};

const SMART_FULL_Q2 = {
  id: 2,
  title: "DS→產品工程・曖昧業務要件・逆求人面談專用完整短句",
  emoji: "📊",
  variants: [
    `- 自分が気になっているのは、分析の精度そのものより、曖昧な業務課題をどこまで実装可能な単位に落とせるかです。
- 外から見るとDSとソフトウェアの橋渡しに見えるんですが、実際にはもっと要件整理の比重が大きいのかなと思っています。
- ☆モデルの話というより、その前で何を問題として切るかの方が、結果に効くことは多いと思っています。
- ☆自分としては、分析と実装の間にある曖昧さをどう扱うかに一番関心があります。
- 仕様を受け取って作るというより、そもそも何を仕様として固定するべきかを見る方が自然です。
- 業務側の言葉をそのまま実装に落とすのではなくて、まずどこが未定義かを分ける必要があると思っています。
- たぶん一番大きいのは、正しい解を出すことより、先に扱える問いに変えることだと思っています。
- DS寄りの視点が活きるのは、数字を見ること自体というより、何を見れば判断が進むかを設計できるところかなと思っています。
- 実際の現場だと、技術の難しさより、論点が混ざったまま進んでしまうことの方が重い場面も多い気がしています。
- 自分は、曖昧な状態のものをそのまま受け取るより、まずチームで扱える単位に切る方に価値が出しやすいです。
- 逆に言うと、きれいな分析結果があっても、次の意思決定につながらないなら十分ではないと思っています。
- 実装の速度も重要なんですが、何を先に確かめると前に進むのかが見えていないと、結果的に遠回りになることが多いです。
- ☆自分の中では、良い要件整理というのは、漏れなく書けていることより、次の一手が決まることです。
- もしDSからプロダクト側に重心を移すなら、スキルが増えるというより、責任の持ち方が変わる感覚なのかなと思っています。
- 自分としては、問題設定と要件整理と小さい検証が、実はかなり一続きのものとして見えています。
- ☆一見すると実装課題に見えても、実際には誰も同じ前提を持てていないだけ、ということはかなりあると思っています。
- 少なくとも自分は、正しそうな整理より、チームで共有して動かせる整理の方を重く見ています。
- この手の仕事は、賢い答えを一回で出すことより、判断の材料を揃えながら前に進めることの方が大事だと思っています。
- 自分が価値を出しやすいのは、曖昧な業務文脈を、仮説と確認ポイントに分けていくところだと思っています。
- ☆なので、自分が見たいのは、分析が強い人がいるかどうかより、曖昧な課題をちゃんと扱える現場かどうかです。`
  ]
};

function writePackFile(baseName, pack) {
  const body = JSON.stringify(pack, null, 2);
  writeFileSync(join(packsDir, `${baseName}.js`), `window.PACK = ${body};\n`, "utf8");
}

// --- 1) security-edge：soft 題組在前 ---
{
  const soft = loadPack("security-edge-soft");
  const hard = loadPack("security-edge");
  const questions = normalizeQuestions([
    ...soft.questions.map((q) => ({ ...q, title: `〔Soft〕${q.title}` })),
    ...hard.questions.map((q) => ({ ...q, title: `〔Edge〕${q.title}` }))
  ]);
  writePackFile("security-edge", {
    name: "security-edge",
    displayName: "🔒 Security Edge（含 Soft）",
    questions
  });
  unlinkSync(join(packsDir, "security-edge-soft.js"));
}

// --- 2) coding-test-loglass：lite 在前 ---
{
  const lite = loadPack("coding-test-loglass-lite");
  const full = loadPack("coding-test-loglass");
  const questions = normalizeQuestions([
    ...lite.questions.map((q) => ({ ...q, title: `〔極短〕${q.title}` })),
    ...full.questions.map((q) => ({ ...q, title: `〔標準〕${q.title}` }))
  ]);
  writePackFile("coding-test-loglass", {
    name: "coding-test-loglass",
    displayName: "coding-test-loglass（含 lite）",
    questions
  });
  unlinkSync(join(packsDir, "coding-test-loglass-lite.js"));
}

// --- 3) loglass：短／高頻 → 簡問 → talk → lexicon → 主線 ---
{
  const order = [
    "loglass-frequent",
    "loglass-simple-questions",
    "loglass-talk-pack",
    "loglass-internal-lexicon",
    "loglass"
  ];
  const labels = {
    "loglass-frequent": "〔15s〕",
    "loglass-simple-questions": "〔簡問〕",
    "loglass-talk-pack": "〔短答〕",
    "loglass-internal-lexicon": "〔語彙〕",
    loglass: "〔本線〕"
  };
  const questions = [];
  for (const name of order) {
    const pack = loadPack(name);
    const prefix = labels[name];
    for (const q of pack.questions || []) {
      questions.push({ ...q, title: `${prefix}${q.title}` });
    }
  }
  writePackFile("loglass", {
    name: "loglass",
    displayName: "Loglass（統合：本線＋語彙＋短答＋簡問＋15s）",
    questions: normalizeQuestions(questions)
  });
  for (const name of order.slice(0, -1)) {
    unlinkSync(join(packsDir, `${name}.js`));
  }
}

// --- 4) smart-full-lines：句頭短包 → 完整短句 → worklog → hard-work ---
{
  const tone = loadPack("smart-tone-mini");
  const worklog = loadPack("worklog-mini-hard");
  const hw = loadPack("hard-work");
  const toneQs = tone.questions.map((q) => ({ ...q, title: `〔句頭工具〕${q.title}` }));
  const wlQs = worklog.questions.map((q) => ({ ...q, title: `〔worklog〕${q.title}` }));
  const hwQs = hw.questions.map((q) => ({ ...q, title: `〔hard-work〕${q.title}` }));
  const merged = normalizeQuestions([
    ...toneQs,
    SMART_FULL_Q1,
    SMART_FULL_Q2,
    ...wlQs,
    ...hwQs
  ]);
  writePackFile("smart-full-lines", {
    name: "smart-full-lines",
    displayName: "smart full lines（統合）",
    questions: merged
  });
  unlinkSync(join(packsDir, "smart-tone-mini.js"));
  unlinkSync(join(packsDir, "worklog-mini-hard.js"));
  unlinkSync(join(packsDir, "hard-work.js"));
}

// --- 5) product-engineer-cheatsheet：coding-edge → PE → engineer-favor ---
{
  const ce = loadPack("coding-edge");
  const pe = loadPack("product-engineer-cheatsheet");
  const ef = loadPack("engineer-favor");
  const questions = normalizeQuestions([
    ...ce.questions.map((q) => ({ ...q, title: `〔CODE EDGE〕${q.title}` })),
    ...pe.questions.map((q) => ({ ...q, title: `〔PE〕${q.title}` })),
    ...ef.questions.map((q) => ({ ...q, title: `〔Engineer Favor〕${q.title}` }))
  ]);
  writePackFile("product-engineer-cheatsheet", {
    name: "product-engineer-cheatsheet",
    displayName: "PRODUCT ENGINEER（統合：CE＋PE＋EF）",
    questions
  });
  unlinkSync(join(packsDir, "coding-edge.js"));
  unlinkSync(join(packsDir, "engineer-favor.js"));
}

console.log("merge-packs-run: OK");
