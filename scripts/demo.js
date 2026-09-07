'use strict';
// Reproduce the same installed demo on Windows and Linux. No model required in CI;
// math.js and the completion claim are the outputs of the recorded real Codex run.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'doneaudit installed demo '));
const project = path.join(temp, 'project');
fs.mkdirSync(project);
function run(cwd, cmd, args, expected = 0) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout: 240000, maxBuffer: 16 * 1024 * 1024 });
  assert.equal(r.status, expected, (r.stdout || '') + (r.stderr || '') + (r.error || ''));
  return r.stdout;
}
const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run with npm run demo');
const packed = JSON.parse(run(root, process.execPath, [npmCli, 'pack', '--pack-destination', temp, '--json']))[0];
for (const file of fs.readdirSync(path.join(root, 'examples/doneaudit-demo'))) fs.copyFileSync(path.join(root, 'examples/doneaudit-demo', file), path.join(project, file));
fs.writeFileSync(path.join(project, '.gitignore'), 'node_modules/\npackage-lock.json\n');
for (const args of [['init'], ['config', 'user.email', 'demo@example.invalid'], ['config', 'user.name', 'DoneAudit demo'], ['config', 'core.autocrlf', 'false'], ['add', '.'], ['commit', '-m', 'Real Codex demo output']]) run(project, 'git', args);
console.log(run(project, process.execPath, [npmCli, 'exec', '--yes', '--package=' + path.join(temp, packed.filename), '--', 'doneaudit', 'init']));
const cli = path.join(project, '.doneaudit/tool/bin/doneaudit.js');
console.log(run(project, process.execPath, [cli, 'run']));
const resultFile = path.join(project, '.doneaudit/evidence/result.json');
assert.equal(JSON.parse(fs.readFileSync(resultFile)).score, 100);
assert.equal(JSON.parse(fs.readFileSync(resultFile)).status, 'VERIFIED');
fs.cpSync(path.join(project, '.doneaudit/evidence'), path.join(root, 'artifacts/demo-success'), { recursive: true });
// Deliberately break the existing test, leaving its real Codex claim in place.
const source = path.join(project, 'math.js');
fs.writeFileSync(source, fs.readFileSync(source, 'utf8').replace('return a + b', 'return a - b'));
console.log(run(project, process.execPath, [cli, 'run'], 1));
assert.equal(JSON.parse(fs.readFileSync(resultFile)).score, 70);
assert.equal(JSON.parse(fs.readFileSync(resultFile)).status, 'FAILED');
fs.cpSync(path.join(project, '.doneaudit/evidence'), path.join(root, 'artifacts/demo-failure'), { recursive: true });
console.log('Installed package demo PASS: success=100/VERIFIED; intentional failure=70/FAILED.');
