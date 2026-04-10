#!/usr/bin/env node
/**
 * 與 packs/pack-registry.js 對齊檢查：
 * - order / standalone 所列皆有 packs/<name>.js
 * - 專案內 packs/*.js 若非 fillings/episodes 等工具檔，應在 registry 中登記
 * - 有 displayName 的 pack 須與 registry.displayNames 一致
 *
 * 使用：npm run check-packs
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(root, "..");
const packsDir = join(projectRoot, "packs");
const registryPath = join(packsDir, "pack-registry.js");

function loadRegistry() {
  const src = readFileSync(registryPath, "utf8");
  const w = {};
  const fn = new Function("window", src);
  fn(w);
  if (!w.PACK_REGISTRY) {
    throw new Error("pack-registry.js 未設定 window.PACK_REGISTRY");
  }
  return w.PACK_REGISTRY;
}

function extractPackMeta(filePath) {
  const src = readFileSync(filePath, "utf8");
  const nameM = src.match(/\bname:\s*"([^"]+)"/);
  const dnM = src.match(/\bdisplayName:\s*"([^"]*)"/);
  return {
    name: nameM ? nameM[1] : null,
    displayName: dnM ? dnM[1] : null
  };
}

/** 非主選單、僅供內部／實驗引用之 pack，不強制登入 registry.order */
const SKIP_FILES = new Set(["pack-registry.js", "fillings.js", "episodes.js"]);

function main() {
  const reg = loadRegistry();
  const order = reg.order || [];
  const standalone = reg.standalone || {};
  const labels = reg.labels || {};
  const displayNames = reg.displayNames || {};

  const errors = [];

  const allKeys = new Set([...order, ...Object.keys(standalone).filter((k) => standalone[k])]);

  for (const key of allKeys) {
    const f = join(packsDir, key + ".js");
    if (!existsSync(f)) {
      errors.push(`缺少檔案: packs/${key}.js（registry 列了「${key}」）`);
    }
  }

  for (const key of order) {
    if (standalone[key]) {
      errors.push(`「${key}」同時在 order 與 standalone，應只擇一`);
    }
  }

  const jsFiles = readdirSync(packsDir).filter((n) => n.endsWith(".js") && !SKIP_FILES.has(n));

  for (const file of jsFiles) {
    const base = file.replace(/\.js$/, "");
    const full = join(packsDir, file);
    const meta = extractPackMeta(full);
    if (!meta.name) {
      errors.push(`無法解析 name: packs/${file}`);
      continue;
    }
    if (meta.name !== base) {
      errors.push(`檔名與 window.PACK.name 不符: ${file}（name 為 "${meta.name}"）`);
    }
    if (!allKeys.has(base)) {
      errors.push(
        `packs/${file} 未在 pack-registry 的 order 或 standalone 中登記（若為工具檔請加入 SKIP_FILES）`
      );
    }
    if (meta.displayName != null) {
      if (displayNames[base] !== meta.displayName) {
        errors.push(
          `displayNames 不一致: ${base} — pack 檔為 "${meta.displayName}"，registry 為 "${displayNames[base] || ""}"`
        );
      }
    } else if (displayNames[base] == null || displayNames[base] === "") {
      errors.push(`packs/${file} 無 displayName，且 pack-registry.displayNames["${base}"] 未設定`);
    }
  }

  for (const key of Object.keys(displayNames)) {
    if (!allKeys.has(key)) {
      errors.push(`registry.displayNames 有多餘鍵「${key}」（order/standalone 未使用）`);
    }
  }

  if (errors.length) {
    console.error("[check-packs] 失敗：\n" + errors.map((e) => "  - " + e).join("\n"));
    process.exit(1);
  }
  console.log("[check-packs] OK — registry 與 packs/*.js 一致。");
}

main();
