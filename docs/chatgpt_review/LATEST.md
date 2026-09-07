# DoneAudit — latest handoff

## Only objective
Publicly release MIT DoneAudit v0.1.0: install → real Codex work → evidence →
deterministic 0–100 score → terminal and GitHub results. No additional product scope.

## Fixed acceptance — all passed
1. Fresh project installation. 2. Codex generates completion evidence.
3. Intentional failing tests cannot verify. 4. Real passing checks verify.
5. Repeatable score. 6. GitHub displays results. 7. Windows works.
8. Upstream license retained. 9. README explains the product immediately.
10. Real Codex end-to-end demo. 11. Public v0.1.0 release after all gates pass.

## Upstream and license
mohamedzhioua/agent-done-or-not, MIT, Copyright (c) 2026 Zhioua Mohamed.
Base SHA: 2d7ae9331cf8d0272834bb9db31ae863f042bc88.
LICENSE, gate engines and legacy wrapper unchanged; full upstream history retained.
THIRD_PARTY_NOTICES.md identifies origin and DoneAudit additions. No agent-verify code imported.
The upstream local v0.1.0 tag is preserved as upstream/v0.1.0; DoneAudit v0.1.0
points to the separately validated DoneAudit source below.

## Completed
- DoneAudit branding, fixed evidence score, fail-closed results and source binding.
- One-command package installation, Codex AGENTS.md rule and generated CI workflow.
- Original Claude Code functionality preserved.
- English README, concise Traditional Chinese explanation and real docs/demo.txt.
- Real Codex CLI 0.153.4 fixed only math.js, wrote doneaudit.claim.json and executed
  the installed DoneAudit command successfully. Its claim/source are in examples/doneaudit-demo.
- Public repository and published release, with downloadable npm tarball and SHA256SUMS.

## Actual tests
- Fresh packed install on Windows: PASS, including a path containing spaces.
- Exact published README npx v0.1.0 installation command: PASS.
- Public GitHub source installation and check execution: 100/VERIFIED.
- DoneAudit regression tests: 2 passed, 0 failed; cover success, failed tests,
  missing commands/categories/claim, stale state, expired receipts, tampered logs,
  incomplete failure evidence, source mutations and repeated report equality.
- Build syntax and required syntax checks: PASS.
- Packaged demo replay: 100/VERIFIED for success; 70/FAILED for intentional broken addition.
- Native Windows PowerShell 5 upstream compatibility: 66 passed, 0 failed.
- All final GitHub workflows passed for the release SHA:
  - [DoneAudit Windows/Linux release gate](https://github.com/kafidog/DoneAudit/actions/runs/34146884912)
  - [Upstream Windows PowerShell 5/7, Linux and macOS tests](https://github.com/kafidog/DoneAudit/actions/runs/34146885006)
  - [Upstream Action self-test](https://github.com/kafidog/DoneAudit/actions/runs/34146884999)
- Downloaded the actual GitHub Windows artifact and checked its result.json:
  success=100/VERIFIED; failure=70/FAILED. CI logs and job summaries use the same formatter.

## Resolved issues / testing limits
- The first overall run passed DoneAudit tests/build/demo, then exposed inherited
  PowerShell 7 module-path contamination in PowerShell 5. The test runner now starts
  PowerShell 5 with its native module path; only the failed compatibility portion
  was rerun, passing all 66 tests. No gate engine changes were needed.
- Windows CI exposed short-path/long-path root comparison. Reproduced locally
  under Node 22 using a Windows short-path TEMP; fixed with native realpath.
  Focused tests then passed locally and on GitHub Windows/Linux.
- Initial PATH Codex 0.146.0 could not use the configured model; the existing desktop
  CLI 0.153.4 completed the real test. No global model configuration was changed.
- Local detailed logs: artifacts/verification.txt, artifacts/windows-verification.txt,
  artifacts/codex-session-final.txt; actual downloaded CI artifacts: artifacts/github-windows/.
  These are untracked. The public demonstration is docs/demo.txt and the linked CI runs.
- The score is evidence coverage, not correctness probability. Codex uses instructions,
  not a hard stop hook; CI reruns checks. Local evidence is not signed against a
  malicious actor who controls both tooling and receipts. Ignored files are outside
  the source fingerprint. These limits are documented in README.

## Incomplete
No v0.1 delivery items remain. External third-party adoption and the OpenAI award
application are not claimed as completed by these development tests.

## v0.1 release readiness / publication
DONEAUDIT_V0_1_READY — actually published, not a draft or prerelease.
[Public v0.1.0](https://github.com/kafidog/DoneAudit/releases/tag/v0.1.0)
Published at 2026-09-07T17:21:01Z (2026-09-08 01:21:01 UTC+8).
Package SHA-256: 1a0dd9330b6edd105ad58d8c6dd55c200fbdbe86f84c530a72f5258953560f43.

## Git SHA
Release tag v0.1.0: **4db85f38168ce75ec32dd11edc3e5c74509f718c**.
Later main-branch changes only update this handoff; released code is unchanged.

## Next single action
Obtain the first genuine external installation report through the public repository.
Do not add features before collecting that feedback.

## User-only actions
None required for this release. External outreach and an award application have
not been submitted; no approval or reward is implied by publishing this project.
