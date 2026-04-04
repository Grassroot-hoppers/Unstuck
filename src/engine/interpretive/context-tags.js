/**
 * v1 context tags for interpretive narratives (closed set).
 */

/** @type {readonly ['under_pressure','in_groups','in_conflict','intimate_settings','at_work','in_close_relationships']} */
export const CONTEXT_TAGS_V1 = Object.freeze([
  'under_pressure',
  'in_groups',
  'in_conflict',
  'intimate_settings',
  'at_work',
  'in_close_relationships',
]);

export function isValidContextTag(tag) {
  return CONTEXT_TAGS_V1.includes(tag);
}
