'use strict';
const { spawnSync } = require('node:child_process');
for (const script of (process.argv.includes('--windows-only') ? [] : ['test', 'build', 'check', 'demo'])) {
  const r = spawnSync(process.execPath, [process.env.npm_execpath, 'run', script], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);
}
if (process.platform === 'win32') {
  // PowerShell 7 module paths inherited by Windows PowerShell 5 can hide its built-ins.
  const env = { ...process.env }; delete env.PSModulePath;
  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'tests/run.ps1'], { stdio: 'inherit', env });
  if (r.status !== 0) process.exit(r.status || 1);
}
console.log(process.argv.includes('--windows-only') ? 'Windows upstream compatibility PASS.' : 'Necessary overall verification PASS.');
