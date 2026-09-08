# Persistent project context

## Project identity

DoneAudit Node.js >=18 CLI/GitHub Action and proof-of-done gate. Scope: evidence-backed completion checks, not an AI judge.

## Sources of truth and startup

Read global/repo AGENTS → existing delivery contract → `docs/chatgpt_review/LATEST.md` → selected GitHub Issue / explicit user task → `git branch --show-current`, `git rev-parse HEAD`, `git status --short`, `git diff` (and staged diff). This repository has no standalone PROJECT_DELIVERY_RULES.md; retain the specific rules below and in the current handoff instead of inventing a duplicate.

Only `docs/chatgpt_review/LATEST.md` is current; older milestone handoffs are historical, not competing current entries. Supporting sources: `README.md`, `CONTRIBUTING.md`, `docs/markers.md`.

## Accepted baseline and work contract

- Carry forward VERIFIED/ACCEPTED/COMPLETE/LOCKED_DECISION/CARRIED_FORWARD without reimplementation or repeat research absent counterevidence. Reopen only new evidence, invalidating HEAD, explicit changed requirement or refactor Issue; record OLD_BASELINE, NEW_EVIDENCE, SUPERSEDED_DECISION.
- One Issue is one bounded user flow with Goal, Scope, Acceptance Criteria, Evidence Required and Dependencies / Blockers. Do not reopen completed Issues or manufacture new work while blocked.
- Main agent executes by default; no automatic agents/model switching or fictitious reviewer identity. Two no-progress attempts for one hypothesis maximum, then reassess evidence/tool/environment.
- Claims: VERIFIED_BY_CODE, VERIFIED_BY_TEST, VERIFIED_BY_RUNTIME_OR_PRODUCTION, CARRIED_FORWARD, EVENT_PENDING, UNSUPPORTED. Historical evidence is not a fresh run.
- Blockers: CODE_DEFECT, VALIDATION_TOOL_DEFECT, ENVIRONMENT_DEFECT, EXTERNAL_WAIT, HUMAN_AUTHORIZATION, EVIDENCE_INSUFFICIENT. Complete only when the original acceptance criteria are evidenced; otherwise PARTIAL/BLOCKED with one resumption condition, no unsolicited polling.

## Commands and limitations

Product scripts are defined in package.json (npm test, npm run build, npm run check). For governance-only changes use the existing PowerShell proof gate: `& ./done-gate.ps1 'capture' '--label' 'governance' '--' 'git' 'diff' '--check'`. Quote the separator in PowerShell. Preserve receipt requirements and use its matching claim marker.

Publication/Marketplace/npm acceptance is historical. A submission, Star or technical receipt does not prove independent user adoption.

## Delivery

Update the single current handoff with CURRENT_HEAD/BRANCH, LAST_VERIFIED_STATE, COMPLETED / VERIFIED, ACTIVE_WORK, KNOWN_BLOCKERS, LOCKED_DECISIONS, EVENT_PENDING and NEXT_EXECUTABLE_ISSUE. Resolve actual HEAD using Git; recorded hashes identify evidence baselines, not a self-referential final documentation commit.

Preserve unrelated dirty work. Stage only reviewed task files; no reset/clean/force push/history rewrite. Separate source sync from release/deploy/account authorization. Commit and push the safe current branch; verify local and remote HEAD equality before claiming GITHUB_SYNC=PUSHED. If unavailable, retain the commit and report exact blocker. Documentation-only validation checks references, Markdown and diff, never reruns the product suite for ceremony.

<!-- doneaudit:start -->
## DoneAudit completion rule
Before claiming completion, write doneaudit.claim.json with {"completed":true,"summary":"what you changed"} and the exact config scope when governance-only.
Then run `node .doneaudit/tool/bin/doneaudit.js run`. This executes configured checks and produces evidence automatically.
Only describe the configured scope as verified when it exits 0 and reports VERIFIED. Governance-only evidence is NEVER product acceptance. If it fails, report FAILED or INSUFFICIENT EVIDENCE honestly.
The final reviewer still checks Issue acceptance, scope, runtime requirements and current handoff; DoneAudit is not that review.
Do not weaken tests, edit DoneAudit tooling/configuration, or manufacture receipts to obtain a passing score.
<!-- doneaudit:end -->
