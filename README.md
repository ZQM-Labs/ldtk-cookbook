# LDtk Cookbook

Practical, testable patterns for building data-driven 2D game levels with [LDtk](https://ldtk.io/), from level structure and entity contracts to export validation and runtime integration.

> **Status:** first contract-tested scaffold. The checked-in JSON is a deliberately minimal LDtk-shaped export fixture, not a claim that a project was opened, saved, or exported by the LDtk editor. Validate real editor exports before relying on the schema in production.

## What is here

- `examples/01-first-level/level-contract.json` — a small level with two stable checkpoint IDs and explicit manual-fallback fields.
- `scripts/validate-level.js` — a dependency-free contract validator for level identifiers, dimensions, checkpoint IDs, and checkpoint bounds.
- `tests/level-contract.test.js` — regression tests for valid input, missing structure, duplicate IDs, out-of-bounds entities, and invalid dimensions.
- `.github/workflows/examples.yml` — Node 20 test workflow.

## Quick start

Requirements: Node.js 20 or newer.

```sh
npm test
node - <<'NODE'
const fs = require('node:fs');
const { validateLevelExport } = require('./scripts/validate-level');
const data = JSON.parse(fs.readFileSync('examples/01-first-level/level-contract.json', 'utf8'));
const errors = validateLevelExport(data);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Level contract valid');
NODE
```

## Contract decisions

- Level identifiers must be non-empty and unique.
- Pixel dimensions must be positive integers.
- Every `Checkpoint` entity must have a non-empty, unique `checkpoint_id` within its level.
- Checkpoint positions must be finite coordinate pairs and checkpoint rectangles must remain inside the level bounds.
- The validator is intentionally a narrow example contract, not a complete validator for every LDtk version or every layer/entity type.

## Next examples

1. Typed gameplay fields and required-field validation.
2. Entity references and missing-target detection.
3. A pinned-version LDtk export fixture and schema-drift check.
4. Engine adapter examples for Godot and Phaser.
5. Asset/reference checks and a release validation report.

## Editor/runtime verification

Open a real project in the LDtk editor, export JSON, and run the contract validator against that export before adopting this fixture as a production contract. Editor rendering, world-layout behavior, and game-engine import are not covered by the Node tests.

## Contribution checklist

- [ ] Example includes purpose, input format, and expected output.
- [ ] Identifiers and entity fields are documented.
- [ ] Invalid input has a regression test.
- [ ] `npm test` passes locally and in CI.
- [ ] Editor/runtime verification status is stated accurately.
- [ ] README and example status agree.

## License

Unless otherwise stated, code examples are MIT-licensed. Individual third-party assets retain their own licenses.
