# Proof-of-Done Rule (agent-done-or-not)

Applies to any agent operating in this repo (Codex, and other harnesses that
read `AGENTS.md`).

Before reporting a task complete, you MUST verify it through the proof gate.
Claiming "done" without a passing receipt is not allowed.

1. Run the verifying command through the gate:

   ```bash
   bash done-gate.sh capture --label check -- <your verifying command>
   ```

   It records the command, its exit code, and a SHA-256 of the output, and exits
   with the command's own code — so a failing check fails here.
2. Only report completion after a PASSING receipt.
3. If the check fails, fix the code and capture again. Never report success on a
   red check.

## Claim markers (for `audit`)

When you assert a check passed, also emit a claim marker in your final summary so
`done-gate.sh audit` can diff the claim against the receipt ledger:

```
<agent-done:claim label="test" exit="0" />
```

Use the same `--label` you passed to `capture`; omitting `exit` asserts a pass.
An unbacked marker is caught by `audit`. Full contract and paste-ready
instruction: [`docs/markers.md`](docs/markers.md).

See `examples/install.md` for wiring a hard stop-gate where your harness
supports stop/finish hooks.

# Cross-project delivery governance

以下治理與 Proof-of-Done **同時生效**。本節不降低上方 proof gate：任何聲稱 PASS/Done 的驗證命令仍必須有 passing receipt 與對應 claim marker。若兩者有衝突，以能提供更強產品證據、且不降低 Proof-of-Done 的規則為準。

## Astra Era
- `Astra Medium`：只在新 Phase、重大方向改變、重複失敗或 Final Review 進場；負責全局理解、架構、P0/P1/P2、Delivery Issue、依賴、Gate 與風險。
- `Sol High`：執行期 Supervisor / Reviewer / Final Gate；負責範圍、Git、proof receipts、Evidence 與最終判定。
- `Luna MAX`：主要 Executor；負責 implementation、research、tests、fixes、documentation、evidence 與 proof capture。
- 升級順序：`Luna MAX → Sol High → Astra Medium → Astra High → Astra XHigh`；High/XHigh 僅真正僵局、重大架構衝突、反覆失敗或高風險不可逆決策。

## Goal → Delivery Issue → Codex/Luna → Evidence → Sol Gate
- 一個 Delivery Issue = 一條可真正驗收、可獨立交付的完整流程，不拆成微型 Issue 海。
- 正常執行只讀永久規則、唯一最新 handoff（若存在）與當前最高優先且已解除阻塞的 Delivery Issue。
- 同一時間只執行一個 Delivery Issue；小型已定位修復可直接最小修改、proof 驗證、提交。
- Proof receipt 證明「指定命令確實通過」，但不能自行擴張成未被該命令驗證的產品主張。

## 交付優先與失敗處理
- 產品修改先最小相關測試，交付前一次必要整體驗證；純文件/治理修改只跑必要 proof，不跑無關產品測試。
- 同一失敗假設最多兩次無進展嘗試；分類只用 `PRODUCT`、`VALIDATION`、`EXTERNAL`、`HUMAN_AUTH`、`EVIDENCE_INSUFFICIENT`。
- 只有登入、OAuth、2FA、CAPTCHA、條款、人工授權、目前環境無法控制的實體裝置或真正外部事件才算 HUMAN_AUTH/EXTERNAL。
- 外部等待只留下恢復條件，不建 AI 值班、輪詢或監控平台。
- 保留既有資料、receipt ledger、修改與 dirty work；禁止為了乾淨 reset/clean/覆蓋成果。

## 共享能力
從產品缺口依序查 Registry technical_stable → experimental → 專案既有能力 → 官方能力/工具 → 成熟 OSS → 最後才新增。安裝、Registry 登記、技能數或 proof command PASS 都不等於產品改善；只有實際套用、可驗證增益、無明顯回歸且 Sol 接受才算落地。

## 驗證、證據與 Git
- 所有「命令通過」主張仍必須走 `done-gate.sh capture` 並有對應 claim marker。
- 驗證工具/Proof Gate 本身失敗與產品失敗分開；歷史 receipt 不得冒充本輪重新驗證。
- 證據少而有效，不按代理角色複製大量報告/ZIP。
- 只修改當前 Issue 最小必要範圍；禁止 `git reset --hard`、`git clean -fd`、force push、改寫已發布歷史或刪除未知資料。
- 只有 P0/P1=0、scope drift=0、必要 proof/evidence 完成且 Sol Gate 通過，才可宣稱該 Delivery Issue PASS。

## GitHub 交接與同步（每個 Delivery Issue 結束必做）

GitHub 是跨工作階段的唯一交接來源。Owner 不應再需要把已存在 GitHub 的報告、Markdown 或 ZIP 重新上傳給下一個 AI。

每個 Delivery Issue 完成、PARTIAL、FAIL 或 BLOCKED 時，在最後回覆前必須：
1. 更新或建立根目錄唯一 `CODEX_HANDOFF.md`，不得建立日期版/代理版重複 handoff；至少記錄 Current Goal、Issue、branch/HEAD、RESULT、FILES_CHANGED、USER_VISIBLE_RESULT、VALIDATION、EVIDENCE、KNOWN_ISSUES、未驗證項目、Blocker、rollback、`NEXT_SINGLE_ACTION`。
2. 若有 GitHub Delivery Issue 且環境可寫入 GitHub，回填 RESULT / VALIDATION / EVIDENCE / COMMIT / NEXT_SINGLE_ACTION；若無 Issue 寫入能力，不得假裝已回填，但 handoff 與 Git push 仍為必做。
3. 只 stage 本 Issue 可安全歸屬且已驗證修改，建立清楚 commit；未知 dirty work 不得混入。
4. 將 commit、最新 `CODEX_HANDOFF.md` 與本輪必要 proof receipt/ledger 更新（若屬追蹤檔且不含敏感資料）**push 到 GitHub 遠端**。使用目前追蹤 branch；無 upstream 時安全使用 `git push -u origin <branch>`。禁止 force push。
5. 若採 PR/受保護分支流程，只 push 工作 branch 並留下 PR/commit 參照；不得繞過保護、merge、deploy、release 或公開發布，除非當前授權明確允許。
6. push 後驗證本機 HEAD 已存在遠端追蹤 branch，最終回報必寫 `GITHUB_SYNC=PUSHED` 與 commit SHA；任何「已同步」主張也不得超出實際 Git 證據。
7. 若因憑證、網路、remote 權限或 branch protection 無法 push，保留本機 commit，寫 `GITHUB_SYNC=BLOCKED`、原始錯誤、尚未上傳 commit SHA 與恢復條件；產品/Proof 結果與 GitHub 同步結果分開。

此規則是 Owner 對一般 Git source-control 同步與 handoff 更新的持續授權；**不等於** deployment、release publication、社群發布、付款、OAuth/2FA 或其他高風險外部操作授權。Proof-of-Done Gate 仍然完整生效。
