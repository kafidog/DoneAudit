'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'bin/doneaudit.js');
function command(cwd, cmd, args) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout: 180000 });
  if (r.error) throw r.error;
  return r;
}
function fixture() {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'doneaudit test '));
  for (const args of [['init'], ['config', 'user.email', 'test@example.invalid'], ['config', 'user.name', 'DoneAudit test'], ['config', 'core.autocrlf', 'false']]) assert.equal(command(cwd, 'git', args).status, 0);
  fs.writeFileSync(path.join(cwd, '.gitignore'), 'node_modules/\n');
  fs.writeFileSync(path.join(cwd, 'source.js'), 'module.exports = 42;\n');
  fs.writeFileSync(path.join(cwd, 'pass.js'), 'console.log("real check passed");\n');
  fs.writeFileSync(path.join(cwd, 'fail.js'), 'console.error("intentional failing check"); process.exit(1);\n');
  command(cwd, 'git', ['add', '.']);
  assert.equal(command(cwd, 'git', ['commit', '-m', 'fixture']).status, 0);
  const invoke = (...args) => command(cwd, process.execPath, [cli, ...args]);
  const install = invoke('init'); assert.equal(install.status, 0, install.stdout + install.stderr);
  const config = { version: 1, checks: [
    { label: 'test', group: 'test', command: 'node pass.js' },
    { label: 'build', group: 'build', command: 'node pass.js' },
    { label: 'required', group: 'required', command: 'node pass.js' }
  ] };
  const setConfig = () => fs.writeFileSync(path.join(cwd, 'doneaudit.config.json'), JSON.stringify(config));
  const claim = () => fs.writeFileSync(path.join(cwd, 'doneaudit.claim.json'), JSON.stringify({ completed: true, summary: 'Fixture implementation finished' }));
  setConfig(); claim();
  const result = () => JSON.parse(fs.readFileSync(path.join(cwd, '.doneaudit/evidence/result.json')));
  return { cwd, invoke, config, setConfig, claim, result };
}
test('fresh install, real success/failure, missing evidence, stable score and source binding', () => {
  const f = fixture();
  assert.match(fs.readFileSync(path.join(f.cwd, 'AGENTS.md'), 'utf8'), /doneaudit.claim.json/);
  assert.match(fs.readFileSync(path.join(f.cwd, '.github/workflows/doneaudit.yml'), 'utf8'), /GITHUB|Verify completion/);
  assert.equal(f.invoke('init').status, 0);
  assert.equal(fs.readFileSync(path.join(f.cwd, 'AGENTS.md'), 'utf8').split('<!-- doneaudit:start -->').length, 2);
  assert.equal(f.invoke('report').status, 2);
  let run = f.invoke('run'); assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.equal(f.result().score, 100); assert.equal(f.result().status, 'VERIFIED');
  const first = f.result();
  assert.equal(f.invoke('report').status, 0);
  assert.deepEqual(f.result(), first);
  const evidence = path.join(f.cwd, '.doneaudit/evidence');
  const bundle = JSON.parse(fs.readFileSync(path.join(evidence, 'latest.json')));
  const log = path.join(f.cwd, bundle.checks[0].directory, 'check/test.log');
  const originalLog = fs.readFileSync(log);
  const originalBundle = fs.readFileSync(path.join(evidence, 'latest.json'));
  bundle.at = Date.now() - 3600001;
  fs.writeFileSync(path.join(evidence, 'latest.json'), JSON.stringify(bundle));
  assert.equal(f.invoke('report').status, 2);
  fs.writeFileSync(path.join(evidence, 'latest.json'), originalBundle);
  fs.appendFileSync(log, 'tamper');
  assert.equal(f.invoke('report').status, 2);
  fs.writeFileSync(log, originalLog);
  fs.appendFileSync(path.join(f.cwd, 'source.js'), '// changed after receipt\n');
  assert.equal(f.invoke('report').status, 2);
  assert.notEqual(f.result().status, 'VERIFIED');
  f.config.checks[0].command = 'node fail.js'; f.setConfig();
  run = f.invoke('run'); assert.equal(run.status, 1, run.stdout + run.stderr);
  assert.equal(f.result().status, 'FAILED'); assert.equal(f.result().score, 70);
  const failedBundle = JSON.parse(fs.readFileSync(path.join(evidence, 'latest.json')));
  fs.unlinkSync(path.join(f.cwd, failedBundle.checks[0].directory, 'check/test.log'));
  assert.equal(f.invoke('report').status, 1);
  assert.equal(f.result().score, 55); // Failure retained, incomplete evidence gets no points.
  f.config.checks[0].command = 'node pass.js'; f.config.checks[2].command = null; f.setConfig();
  run = f.invoke('run'); assert.equal(run.status, 2, run.stdout + run.stderr);
  assert.equal(f.result().score, 60);
  f.config.checks[2].command = 'node pass.js'; f.setConfig();
  fs.unlinkSync(path.join(f.cwd, 'doneaudit.claim.json'));
  run = f.invoke('run'); assert.equal(run.status, 2, run.stdout + run.stderr);
  assert.equal(f.result().score, 85);
  // An execution that changes tracked source cannot verify the old snapshot.
  fs.writeFileSync(path.join(f.cwd, 'mutate.js'), 'require("fs").appendFileSync("source.js", "// mutation\\n");\n');
  f.claim(); f.config.checks[2].command = 'node mutate.js'; f.setConfig();
  run = f.invoke('run'); assert.equal(run.status, 2, run.stdout + run.stderr);
  // Drop an entire evidence category: never silently renormalize to 100.
  f.config.checks = f.config.checks.filter(c => c.group !== 'required'); f.setConfig();
  run = f.invoke('run'); assert.equal(run.status, 2, run.stdout + run.stderr);
  assert.notEqual(f.result().score, 100);
});
test('invalid and duplicate configuration fail closed', () => {
  const f = fixture();
  f.config.checks[1].label = 'test'; f.setConfig();
  assert.equal(f.invoke('run').status, 2);
});

test('portable init preserves project model, unknown workflow and managed rule ownership', () => {
  const f = fixture();
  const agents = path.join(f.cwd, 'AGENTS.md');
  const workflow = path.join(f.cwd, '.github/workflows/doneaudit.yml');
  const originalWorkflow = 'name: existing-owner-workflow\n';
  fs.writeFileSync(workflow, originalWorkflow);
  fs.appendFileSync(agents, '\nOwner rule must survive.\n');
  assert.equal(f.invoke('init', '--portable').status, 0);
  const first = fs.readFileSync(agents, 'utf8');
  assert.equal(f.invoke('init', '--portable').status, 0);
  assert.equal(fs.readFileSync(agents, 'utf8'), first);
  assert.match(first, /Owner rule must survive/);
  assert.equal(first.split('<!-- doneaudit:start -->').length, 2);
  assert.equal(fs.readFileSync(workflow, 'utf8'), originalWorkflow);
  assert.equal(fs.existsSync(path.join(f.cwd, 'package.json')), false);
  assert.equal(fs.existsSync(path.join(f.cwd, 'package-lock.json')), false);
  assert.equal(fs.readFileSync(path.join(f.cwd, '.doneaudit/.gitattributes'), 'utf8'), '/tool/** -text\n');
  fs.unlinkSync(workflow);
  assert.equal(f.invoke('init', '--portable', '--no-workflow').status, 0);
  assert.equal(fs.existsSync(workflow), false);
  assert.equal(f.invoke('init', '--portable').status, 0);
  assert.doesNotMatch(fs.readFileSync(workflow, 'utf8'), /npm (ci|install)/);
  const tool = path.join(f.cwd, '.doneaudit/tool/bin/execute-check.js');
  fs.appendFileSync(tool, '// owner modification\n');
  const modified = fs.readFileSync(tool, 'utf8');
  assert.equal(f.invoke('init', '--portable').status, 2);
  assert.equal(fs.readFileSync(tool, 'utf8'), modified);
});

test('malformed markers and foreign tool directories fail before changing project configuration', () => {
  const f = fixture();
  const agents = path.join(f.cwd, 'AGENTS.md');
  const malformed = '<!-- doneaudit:start -->owner content';
  fs.writeFileSync(agents, malformed);
  assert.equal(f.invoke('init', '--portable').status, 2);
  assert.equal(fs.readFileSync(agents, 'utf8'), malformed);
  fs.writeFileSync(agents, 'Owner content\n');
  fs.unlinkSync(path.join(f.cwd, '.doneaudit/tool/doneaudit-install.json'));
  const before = fs.readFileSync(path.join(f.cwd, 'doneaudit.config.json'), 'utf8');
  assert.equal(f.invoke('init', '--portable').status, 2);
  assert.equal(fs.readFileSync(path.join(f.cwd, 'doneaudit.config.json'), 'utf8'), before);
});

test('governance evidence has explicit scope, source binding and no product-category bypass', () => {
  const f = fixture();
  f.config.scope = 'governance-only';
  f.config.checks = [{ label: 'governance', group: 'required', command: 'git diff --check' }];
  f.setConfig();
  assert.equal(f.invoke('run').status, 2, 'a product claim cannot satisfy governance scope');
  fs.writeFileSync(path.join(f.cwd, 'doneaudit.claim.json'), JSON.stringify({ completed: true, scope: 'governance-only', summary: 'Whitespace validation only; not product acceptance' }));
  let run = f.invoke('run');
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.equal(f.result().scope, 'governance-only');
  assert.match(f.result().conclusion, /NOT product acceptance/);
  fs.appendFileSync(path.join(f.cwd, 'source.js'), '// after evidence\n');
  assert.equal(f.invoke('report').status, 2);
  f.config.scope = 'product'; f.setConfig();
  f.claim();
  assert.equal(f.invoke('run').status, 2, 'product still requires missing test/build categories');
  f.config.scope = 'unknown'; f.setConfig();
  assert.equal(f.invoke('run').status, 2);
});
