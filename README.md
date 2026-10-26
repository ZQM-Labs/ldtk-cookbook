# LDtk Cookbook

Practical, testable patterns for building data-driven 2D game levels with [LDtk](https://ldtk.io/), from level structure and entity contracts to export validation and runtime integration.

> **Status:** starter repository. The examples in this cookbook are deliberately small and contract-tested. A passing structural test does not prove that a map renders correctly in LDtk or imports correctly into a game engine; those checks are called out explicitly.

## Goals

- Keep level data portable and reviewable in version control.
- Give entities and gameplay markers stable identifiers and explicit fields.
- Validate exported JSON before it reaches a game build.
- Separate editor-authored content from runtime assumptions.
- Document what is automated versus what still needs a human/editor check.

## Planned example path

1. **First level** — a minimal level and world layout with stable identifiers.
2. **Gameplay entities** — typed fields, required-field checks, and entity reference validation.
3. **Export contract** — validate exported LDtk JSON shape, identifiers, dimensions, and references.
4. **Runtime adapter** — map LDtk entities and levels to a small engine-neutral checkpoint contract.
5. **Release validation** — deterministic checks for missing assets, broken references, and unsupported schema changes.

## Quick start

Requirements: Node.js 20 or newer. The first example uses Node's built-in test runner and does not require the LDtk editor.

```sh
npm test
```

The tests validate the checked-in example contract. To validate editor compatibility, open the project in the LDtk editor and export it using the version documented by that example. Editor/runtime checks are not implied by the Node test suite.

## Repository layout

```text
examples/              Small, self-contained level-design examples
scripts/               Reusable validation helpers
 tests/                 Contract tests
.github/workflows/      Continuous integration
```

## Quality and safety rules

- Prefer stable string identifiers over assumptions about generated numeric IDs.
- Validate references and required fields; fail with actionable errors rather than silently dropping content.
- Do not commit generated exports that contain machine-specific absolute paths.
- Keep tests deterministic and offline; do not download executable assets in CI.
- Label editor-rendering and engine-import checks as manual until automated with a pinned toolchain.

## Contribution checklist

- [ ] Example includes a purpose, input format, and expected output.
- [ ] Identifiers and entity fields are documented.
- [ ] Invalid input has a regression test.
- [ ] `npm test` passes locally and in CI.
- [ ] Editor/runtime verification status is stated accurately.
- [ ] README and example status agree.

## License

Unless otherwise stated, repository examples are provided under the MIT License. See `LICENSE` when added; individual third-party assets retain their own licenses.
