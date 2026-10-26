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

test('rejects malformed layer and entity collections instead of silently skipping them', () => {
  const badLayer = structuredClone(fixture);
  badLayer.levels[0].layerInstances[0] = null;
  assert.ok(validateLevelExport(badLayer).some((error) => /layerInstances\[0\] must be an object/.test(error)));

  const badEntities = structuredClone(fixture);
  badEntities.levels[0].layerInstances[0].entityInstances = {};
  assert.ok(validateLevelExport(badEntities).some((error) => /entityInstances must be an array/.test(error)));
});

test('rejects malformed checkpoint fields instead of treating them as absent', () => {
  const input = structuredClone(fixture);
  const entities = input.levels[0].layerInstances[0].entityInstances;
  entities[0].fieldInstances = [null];
  assert.ok(validateLevelExport(input).some((error) => /fieldInstances\[0\] must be an object/.test(error)));
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
