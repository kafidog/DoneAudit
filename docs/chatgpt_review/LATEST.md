# DoneAudit — latest handoff

## Only objective
Publicly release MIT DoneAudit v0.1.0: install → real Codex work → evidence →
deterministic 0–100 score → terminal and GitHub results. No additional product scope.

## Fixed acceptance
1. Fresh project installation. 2. Codex generates completion evidence.
3. Intentional failing tests cannot verify. 4. Real passing checks verify.
5. Repeatable score. 6. GitHub displays results. 7. Windows works.
8. Upstream license retained. 9. README explains the product immediately.
10. Real Codex end-to-end demo. 11. Public v0.1.0 release after all gates pass.

## Upstream and license
mohamedzhioua/agent-done-or-not, MIT, Copyright (c) 2026 Zhioua Mohamed.
Base SHA: 2d7ae9331cf8d0272834bb9db31ae863f042bc88.
LICENSE, gate engines and legacy wrapper unchanged; full upstream history retained.
THIRD_PARTY_NOTICES.md identifies origin and DoneAudit additions.

## Completed
- DoneAudit branding, fixed evidence score, fail-closed results and source binding.
- One-command package installation, Codex AGENTS.md rule and generated CI workflow.
- Original Claude Code functionality preserved.
- English README, concise Traditional Chinese explanation and real docs/demo.txt.
- Real Codex CLI 0.153.4 fixed only math.js, wrote doneaudit.claim.json and executed
  the installed DoneAudit command successfully. Its claim/source are in examples/doneaudit-demo.

## Actual tests
- Fresh packed install on Windows: PASS (path containing spaces).
- DoneAudit regression tests: 2 passed, 0 failed; cover success, failed tests,
  missing commands/categories/claim, stale state, expired receipts, tampered logs,
  incomplete failure evidence, source mutations and repeated report equality.
- Build syntax and required syntax checks: PASS.
- Packaged demo replay: 100/VERIFIED for success; 70/FAILED for intentional broken addition.
- Native Windows PowerShell 5 upstream compatibility: 66 passed, 0 failed.
- The first overall run passed DoneAudit tests/build/demo, then exposed inherited
  PowerShell 7 module-path contamination in PowerShell 5. The test runner now starts
  PowerShell 5 with its native module path; only the failed compatibility portion
  was rerun, passing all 66 tests. No gate engine changes were needed.
- Initial PATH Codex 0.146.0 could not use the configured model; the existing desktop
  CLI 0.153.4 completed the real test. No global model configuration was changed.
- Local detailed logs: artifacts/verification.txt, artifacts/windows-verification.txt,
  artifacts/codex-session-final.txt (untracked; not published).

## Incomplete
GitHub Actions execution and public v0.1.0 release remain pending.

## v0.1 release readiness
Local gates passed; not released and not yet DONEAUDIT_V0_1_READY.

## Git SHA
This source commit is being prepared; upstream SHA is recorded above.

## Next single action
Push kafidog/DoneAudit, inspect actual GitHub Actions results, then publish v0.1.0.

## User-only actions
None currently. Real third-party adoption/stars and award selection are not
claimed by these development tests.
