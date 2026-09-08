---
name: Delivery Task
description: 一條可直接交給 Codex/Luna 執行、經 Proof-of-Done 與 Sol Gate 驗收的完整交付流程
title: "[P0][DELIVERY] "
labels: []
assignees: []
---

## GOAL
一句話描述使用者完成後能得到什麼實際結果，不要只寫技術動作。

## CURRENT BASELINE
先讀 `AGENTS.md`、`docs/markers.md` 與相關 proof 規則，記錄 branch / HEAD / dirty state、receipt ledger、唯一最新 handoff（若存在）及本 Issue 相關成果/限制。禁止 reset/clean/覆蓋成果。

## SCOPE
完成一條完整可驗收流程，以及必要最小程式、測試與文件修改。

## NOT TO DO
不開第二條大型工作線、不重做已驗收內容、不繞過 Proof-of-Done、不重構無關模組、不建不必要平台/監控/大量報告、不改寫 Git 歷史或丟棄 dirty work。

## DEPENDENCIES
真正阻塞的前置 Issue、外部事件、授權或人工 Gate；沒有寫 `None`。

## SHARED CAPABILITY CHECK
Registry technical_stable → experimental → 專案既有 → 官方 → 成熟 OSS → 最後才新增。proof command PASS 不等於產品改善；只有實際改善成果才採用。

## IMPLEMENTATION
Codex/Luna 自行完成最小必要修改；所有要宣稱通過的驗證命令都使用 `done-gate.sh capture`。

## VALIDATION / PROOF
- 對每個 PASS 主張產生 passing receipt
- Final summary 使用對應 `<agent-done:claim ... />`
- receipt 只證明該命令，不得擴張成未驗證產品主張
- 文件/治理修改只跑必要 proof，不跑無關完整產品測試
- 驗證工具/Proof Gate 失敗與產品失敗分開

## EVIDENCE
只保留足以讓 Sol 判斷成功/失敗的本輪 receipt、命令輸出、diff 與必要產品證據；歷史 receipt 不得冒充本輪驗證。

## FAILURE POLICY
同一失敗假設最多兩次無進展嘗試；分類：`PRODUCT` / `VALIDATION` / `EXTERNAL` / `HUMAN_AUTH` / `EVIDENCE_INSUFFICIENT`。

## ACCEPTANCE
- [ ] 使用者流程/工具結果完整
- [ ] P0/P1=0 或狀態正確保持 PARTIAL/FAIL
- [ ] scope drift=0
- [ ] 必要 proof receipts 通過
- [ ] 所有 PASS claim 都有 receipt 支撐
- [ ] 有本輪實際成果證據
- [ ] 無明顯回歸
- [ ] Git 可回退
- [ ] Sol Gate 完成

## GIT
只提交本 Issue 可分離且已驗證修改，不夾帶未知 dirty work。

## REPORT
只回填：`RESULT`、`FILES_CHANGED`、`USER_VISIBLE_RESULT`、`VALIDATION/RECEIPTS`、`EVIDENCE`、`KNOWN_ISSUES`、`SCOPE_DRIFT`、`COMMIT`、`NEXT_SINGLE_ACTION`，並附必要 claim markers。
