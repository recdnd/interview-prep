#!/bin/bash
# interview-prep：在本專案根目錄提交、推送到 GitHub，並啟動本機靜態預覽（雙擊執行）
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
PROJECT_NAME="$(basename "$SCRIPT_DIR")"

echo "📁 ${PROJECT_NAME}：$SCRIPT_DIR"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "錯誤：此目錄不是 Git 儲存庫。" >&2
  exit 1
fi

BRANCH="$(git branch --show-current)"
REMOTE="${GIT_REMOTE:-origin}"
PORT="${PORT:-8001}"

echo "🔄 分支：$BRANCH → 遠端：$REMOTE"

git add -A

if git diff --cached --quiet; then
  echo "（暫無需提交的變更）"
else
  MSG="${1:-Update ${PROJECT_NAME}}"
  echo "💾 提交：$MSG"
  git commit -m "$MSG"
fi

echo "⬆️  推送 $REMOTE $BRANCH …"
git push -u "$REMOTE" "$BRANCH"

echo ""
echo "✅ 已同步至 GitHub。"
echo "   線上請依 CNAME / GitHub Pages（本專案 CNAME：pp.bin.ooo）。"
echo ""
echo "🌐 本機預覽 http://127.0.0.1:${PORT}/ （Ctrl+C 結束）"
if command -v open >/dev/null 2>&1; then
  open "http://127.0.0.1:${PORT}/" || true
fi
exec python3 -m http.server "$PORT"
