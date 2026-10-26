'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validateLevelExport } = require('../scripts/validate-level');

const fixturePath = path.join(__dirname, '../examples/01-first-level/level-contract.json');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

test('starter fixture has unique, in-bounds checkpoints', () => {
  assert.deepEqual(validateLevelExport(fixture), []);
});

test('rejects a missing levels array', () => {
  assert.match(validateLevelExport({})[0], /root\.levels/);
});

test('rejects duplicate checkpoint identifiers', () => {
  const input = structuredClone(fixture);
  const entities = input.levels[0].layerInstances[0].entityInstances;
  entities[1].fieldInstances[0].__value = 'start';
  assert.ok(validateLevelExport(input).some((error) => /duplicate checkpoint_id/.test(error)));
});

test('rejects checkpoints outside level bounds', () => {
  const input = structuredClone(fixture);
  input.levels[0].layerInstances[0].entityInstances[0].px = [250, 180];
  assert.ok(validateLevelExport(input).some((error) => /outside level pixel bounds/.test(error)));
});

test('rejects missing stable checkpoint id', () => {
  const input = structuredClone(fixture);
  input.levels[0].layerInstances[0].entityInstances[0].fieldInstances = [];
  assert.ok(validateLevelExport(input).some((error) => /requires a non-empty checkpoint_id/.test(error)));
});

test('rejects invalid dimensions', () => {
  const input = structuredClone(fixture);
  input.levels[0].pxWid = 0;
  assert.ok(validateLevelExport(input).some((error) => /pixel dimensions/.test(error)));
});
