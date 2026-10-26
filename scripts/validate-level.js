'use strict';

function validateLevelExport(document) {
  const errors = [];
  if (!document || typeof document !== 'object' || !Array.isArray(document.levels)) {
    return ['root.levels must be an array'];
  }

  const levelIds = new Set();
  for (const [levelIndex, level] of document.levels.entries()) {
    const prefix = `levels[${levelIndex}]`;
    if (!level || typeof level !== 'object' || Array.isArray(level)) {
      errors.push(`${prefix} must be an object`);
      continue;
    }
    if (typeof level.identifier !== 'string' || !level.identifier.trim()) {
      errors.push(`${prefix}.identifier must be a non-empty string`);
    } else if (levelIds.has(level.identifier)) {
      errors.push(`duplicate level identifier: ${level.identifier}`);
    } else {
      levelIds.add(level.identifier);
    }
    if (!Number.isInteger(level.pxWid) || level.pxWid <= 0 ||
        !Number.isInteger(level.pxHei) || level.pxHei <= 0) {
      errors.push(`${prefix} pixel dimensions must be positive integers`);
    }
    if (!Array.isArray(level.layerInstances)) {
      errors.push(`${prefix}.layerInstances must be an array`);
      continue;
    }

    const checkpointIds = new Set();
    for (const [layerIndex, layer] of level.layerInstances.entries()) {
      const layerPrefix = `${prefix}.layerInstances[${layerIndex}]`;
      if (!layer || typeof layer !== 'object' || Array.isArray(layer)) {
        errors.push(`${layerPrefix} must be an object`);
        continue;
      }
      // Non-entity layers may omit entityInstances, but if present it must be an array.
      if (layer.entityInstances === undefined) continue;
      if (!Array.isArray(layer.entityInstances)) {
        errors.push(`${layerPrefix}.entityInstances must be an array when present`);
        continue;
      }
      for (const [entityIndex, entity] of layer.entityInstances.entries()) {
        const entityPrefix = `${layerPrefix}.entityInstances[${entityIndex}]`;
        if (!entity || typeof entity !== 'object' || Array.isArray(entity)) {
          errors.push(`${entityPrefix} must be an object`);
          continue;
        }
        if (entity.__identifier !== 'Checkpoint') continue;
        if (!Array.isArray(entity.px) || entity.px.length !== 2 ||
            !entity.px.every(Number.isFinite)) {
          errors.push(`${entityPrefix}.px must contain two finite coordinates`);
          continue;
        }
        if (!Number.isFinite(entity.width) || entity.width <= 0 ||
            !Number.isFinite(entity.height) || entity.height <= 0) {
          errors.push(`${entityPrefix} width and height must be positive numbers`);
        }
        if (!Array.isArray(entity.fieldInstances)) {
          errors.push(`${entityPrefix}.fieldInstances must be an array`);
          continue;
        }
        const fieldIds = new Set();
        for (const [fieldIndex, field] of entity.fieldInstances.entries()) {
          const fieldPrefix = `${entityPrefix}.fieldInstances[${fieldIndex}]`;
          if (!field || typeof field !== 'object' || Array.isArray(field)) {
            errors.push(`${fieldPrefix} must be an object`);
            continue;
          }
          if (typeof field.__identifier !== 'string' || !field.__identifier.trim()) {
            errors.push(`${fieldPrefix}.__identifier must be a non-empty string`);
            continue;
          }
          if (fieldIds.has(field.__identifier)) {
            errors.push(`${entityPrefix} has duplicate field: ${field.__identifier}`);
          } else {
            fieldIds.add(field.__identifier);
          }
        }
        const idField = entity.fieldInstances.find((field) =>
          field && typeof field === 'object' && field.__identifier === 'checkpoint_id'
        );
        const checkpointId = idField && idField.__value;
        if (typeof checkpointId !== 'string' || !checkpointId.trim()) {
          errors.push(`${entityPrefix} requires a non-empty checkpoint_id`);
        } else if (checkpointIds.has(checkpointId)) {
          errors.push(`${prefix} has duplicate checkpoint_id: ${checkpointId}`);
        } else {
          checkpointIds.add(checkpointId);
        }
        if (entity.px[0] < 0 || entity.px[1] < 0 ||
            entity.px[0] + entity.width > level.pxWid ||
            entity.px[1] + entity.height > level.pxHei) {
          errors.push(`${entityPrefix} lies outside level pixel bounds`);
        }
      }
    }
  }
  return errors;
}

module.exports = { validateLevelExport };
