'use strict';

function validateLevelExport(document) {
  const errors = [];
  if (!document || typeof document !== 'object' || !Array.isArray(document.levels)) {
    return ['root.levels must be an array'];
  }

  const levelIds = new Set();
  for (const [levelIndex, level] of document.levels.entries()) {
    const prefix = `levels[${levelIndex}]`;
    if (!level || typeof level !== 'object') {
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
      if (!layer || !Array.isArray(layer.entityInstances)) continue;
      for (const [entityIndex, entity] of layer.entityInstances.entries()) {
        if (!entity || entity.__identifier !== 'Checkpoint') continue;
        const entityPrefix = `${prefix}.layerInstances[${layerIndex}].entityInstances[${entityIndex}]`;
        if (!Array.isArray(entity.px) || entity.px.length !== 2 ||
            !entity.px.every(Number.isFinite)) {
          errors.push(`${entityPrefix}.px must contain two finite coordinates`);
          continue;
        }
        if (!Number.isFinite(entity.width) || entity.width <= 0 ||
            !Number.isFinite(entity.height) || entity.height <= 0) {
          errors.push(`${entityPrefix} width and height must be positive numbers`);
        }
        const fields = Array.isArray(entity.fieldInstances) ? entity.fieldInstances : [];
        const idField = fields.find((field) => field && field.__identifier === 'checkpoint_id');
        const checkpointId = idField && idField.__value;
        if (typeof checkpointId !== 'string' || !checkpointId.trim()) {
          errors.push(`${entityPrefix} requires a non-empty checkpoint_id`);
        } else if (checkpointIds.has(checkpointId)) {
          errors.push(`${prefix} has duplicate checkpoint_id: ${checkpointId}`);
        } else {
          checkpointIds.add(checkpointId);
        }
        if (Number.isFinite(level.pxWid) && Number.isFinite(level.pxHei) &&
            entity.px[0] >= 0 && entity.px[1] >= 0 &&
            Number.isFinite(entity.width) && Number.isFinite(entity.height) &&
            (entity.px[0] + entity.width > level.pxWid ||
             entity.px[1] + entity.height > level.pxHei)) {
          errors.push(`${entityPrefix} lies outside level pixel bounds`);
        }
      }
    }
  }
  return errors;
}

module.exports = { validateLevelExport };
