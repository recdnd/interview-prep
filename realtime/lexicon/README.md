# Lexicon 詞庫包使用指引

本資料夾放「公司詞彙層」設定，目的不是硬背官話，而是把回答穩定拉回公司內部可對話的語境。

## 檔案

- `loglass_internal_lexicon.json`：Loglass internal-ish 版本
- `loglass_internal_lexicon_lite.json`：Loglass 極短版（高壓現場優先）

## 啟用方式（現場模式）

直接貼：

`現場模式 ON｜公司=Loglass｜lexicon=loglass_internal_lexicon｜語氣=穩短・知性・不壓迫｜長度=15-30秒｜語言=日文`

Lite 版：

`現場模式 ON｜公司=Loglass｜lexicon=loglass_internal_lexicon_lite｜語氣=穩短・知性・不壓迫｜長度=15-30秒｜語言=日文`

## 建議套用順序

1. 先保留你原本答案骨架（pack / helper 產生）
2. 再套詞庫（核心詞、禁用詞、句型）
3. 最後做長度壓縮（15 秒 / 30 秒）

## 快速擴充新公司

1. 複製 `loglass_internal_lexicon.json` 成 `your_company_lexicon.json`
2. 至少更新這些欄位：
   - `company`
   - `key`
   - `core_worldview_terms`
   - `banned_or_deprioritized_terms`
   - `preferred_sentence_patterns`
3. 把 `activation_template` 改成新公司口令

