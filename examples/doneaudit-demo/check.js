const assert = require('node:assert/strict');
const fs = require('node:fs');
assert.ok(!fs.readFileSync('math.js', 'utf8').includes('TODO'), 'Unfinished TODO in source');
assert.equal(typeof require('./math').sum, 'function', 'Public sum export must exist');
console.log('Required checks passed: sum export exists; no unfinished TODO.');
