# DoneAudit

**AI: “Everything is done. All tests pass.”**

```text
DoneAudit
Trust score: 70 / 100 🔴

❌ test: FAILED — the actual test failed
✅ build: PASSED
✅ required: PASSED
✅ Git state: PASSED
✅ Completion evidence: PASSED

Conclusion: Cannot confirm completion
```

**Saying done doesn't make it done.** Verify the evidence before you ship.

Install inside your Git project (Node.js 18+, Git; PowerShell on Windows, Bash elsewhere):

```sh
npx doneaudit@0.1.0 init
```

GitHub Marketplace: [DoneAudit - Verify AI Completion](https://github.com/marketplace/actions/doneaudit-verify-ai-completion)

GitHub v0.1.0 fallback installation:

```sh
npx --yes --package=https://github.com/kafidog/DoneAudit/archive/refs/tags/v0.1.0.tar.gz doneaudit init
```

Then use Codex as usual:

```sh
codex "Fix the failing test. Follow the DoneAudit completion rule."
```

DoneAudit installs the rule that tells Codex to write its completion claim and run
`node .doneaudit/tool/bin/doneaudit.js run`. The tool executes your checks, captures
real receipts and displays the result. Commit the generated files and claim; the
installed GitHub Actions workflow reruns the same checks and posts the same score
format in the job summary. There is no account, server, or AI judge.

**One-time setup:** review `doneaudit.config.json`. npm `test`, `build` and
`lint` (or `check`) scripts are detected automatically. Replace any `null` with a
real shell command for your project. Missing checks never silently count as passes.
Run from a Git repository root with at least one commit. Install project
dependencies before checking. Review the generated workflow if your project uses
a toolchain other than Node.js.

[Real Windows terminal result](docs/demo.txt) · [GitHub checks](https://github.com/kafidog/DoneAudit/actions) · [Releases](https://github.com/kafidog/DoneAudit/releases)

## GitHub Action

For npm projects with a committed package-lock.json, add this workflow and adjust
the check commands to your project:

```yaml
name: DoneAudit
on: [push, pull_request]
permissions:
  contents: read
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - uses: kafidog/DoneAudit@v0.1.1
        with:
          mode: verify
          checks: |
            test: npm test
            build: npm run build
            lint: npm run lint
```

The Action reruns checks through the retained receipt gate and reports pass/fail
in the job summary. The npm/Codex flow provides the 0–100 evidence score.

## What gets verified?

| Evidence | Points |
| --- | ---: |
| Tests | 30 |
| Build | 20 |
| Required checks | 25 |
| Git/source binding | 10 |
| Completion evidence | 15 |

Within each command category, points are the category weight multiplied by the
fraction of passing checks, rounded down. A failed required check **always** means
`FAILED`, even with a high score. Missing, inconsistent, or older-than-one-hour
evidence means `INSUFFICIENT EVIDENCE`. Only all required items passing produces
`VERIFIED` and exit code 0. Failure exits 1; insufficient evidence exits 2.
A build for an interpreted project can be its real syntax/type/package check.

The score is evidence coverage, **not a probability that the software is correct**.
DoneAudit checks command exit codes, receipt/log integrity and source state. It
cannot tell whether your chosen tests are good or cover every requirement.

```json
{
  "version": 1,
  "checks": [
    { "label": "test", "group": "test", "command": "npm test" },
    { "label": "build", "group": "build", "command": "npm run build" },
    { "label": "lint", "group": "required", "command": "npm run lint" }
  ]
}
```

Completion claim (`doneaudit.claim.json`, written by Codex):

```json
{ "completed": true, "summary": "Fixed addition and verified the configured checks." }
```

The claim is an assertion to check, not proof by itself. Commands generate the
proof. Reports and upstream receipts live in `.doneaudit/evidence/` and are
uploaded as workflow artifacts. To inspect existing evidence without rerunning:

```sh
node .doneaudit/tool/bin/doneaudit.js report
```

## Supported scope and trust boundary

### Portable integration (repository HEAD; not in npm 0.1.0 / Action v0.1.1)

Use a reviewed, immutable source commit for these new options; do not use `latest`
or claim that the existing releases contain them. From that checkout, run its
`bin/doneaudit.js init --portable` with the target Git root as the working directory.
Node 18+, Git and PowerShell/Unix Bash are still proof-tool requirements, not
product dependencies. No root package.json/package-lock is created. Portable CI
sets up the proof runtime only; add the product's real toolchain bootstrap when
an authorized product task requires it. `--no-workflow` omits CI creation.
Existing workflows/configuration are preserved; modified vendored tool files and
malformed AGENTS markers fail closed. Re-init owns only one doneaudit marker block.
The vendored manifest records file SHA-256 and source revision when available;
review those against the pinned upstream commit before accepting an update.

For a strictly documentation-only task, an explicit configuration may use:

```json
{"version":1,"scope":"governance-only","checks":[{"label":"docs","group":"required","command":"git diff --check"}]}
```

This example proves whitespace only. Add actual reference, scope and document
checks required by the task; an empty diff is not evidence of product acceptance.
The claim must also say `"scope":"governance-only"`. The result explicitly says
`NOT product acceptance`; its score covers only configured governance checks.
Default/product mode still requires test, build and required categories and
never treats missing checks as a pass. Do not switch a product Issue to governance
scope to obtain a green result. Receipts remain bound to HEAD, source bytes and
config, expire after one hour, and are invalidated by subsequent source edits.

- Windows PowerShell and Unix Bash execution, with zero npm runtime dependencies.
- Codex through project `AGENTS.md`. This is an instruction-based integration,
  not a hard Codex stop hook. GitHub independently reruns the checks.
- Dirty working trees are allowed; changes to tracked or nonignored untracked
  file contents after execution invalidate the receipts. Ignored files (such as
  dependencies and build output) are outside the source fingerprint.
- Only use configured commands you trust. On GitHub, use `pull_request`, never
  `pull_request_target` for executing contribution code. The generated workflow
  has read-only repository permissions.
- Local receipts are not signed or an adversarial sandbox. Someone able to edit
  both tooling and evidence can forge local results. Review changes to the
  configuration, tests and vendored tool. CI reruns instead of trusting receipts.
- Upstream Claude Code hooks and `agent-done-or-not` CLI are retained; see the
  [original integration instructions](examples/install.md). They retain upstream
  behavior; DoneAudit scoring is provided by the `doneaudit` command.

## Origin and license

DoneAudit is built on [mohamedzhioua/agent-done-or-not](https://github.com/mohamedzhioua/agent-done-or-not).
Its receipt engines do the execution capture. We add deterministic scoring,
stronger working-tree binding, Codex setup and concise terminal/GitHub results.
The original code is **not** presented as our own.

MIT. Original Copyright (c) 2026 Zhioua Mohamed retained in [LICENSE](LICENSE).
See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the exact upstream revision.

## Contributing

Found an incorrect result? [Open an issue](https://github.com/kafidog/DoneAudit/issues)
with your OS, Node version, config and redacted terminal output. Never attach
secrets from check logs. Run `npm test` for DoneAudit regression tests; original
upstream tests remain in `tests/`. Keep v0.1 focused on completion verification.
If this helped you catch a false “done”, a star and a reproducible report help
other people find and improve the project.

## 繁體中文

它說完成，不代表真的完成。DoneAudit 實際執行測試、建置與必要檢查，
核對 Git 狀態與完成證據，顯示 0–100 分及通過／不足／失敗項目。
分數是證據覆蓋程度，不是正確機率；缺證據或必要檢查失敗就不能確認完成。
