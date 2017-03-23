

export const SET_CONFIG = 'SET_CONFIG'

export const setConfig = (config) => {
  if (!config.hierarchy) {
    throw new TypeError("config must contain a 'hierarchy' array");
  }

  if (!config.relationship || !config.relationship.parentType || !config.relationship.sourceRef || !config.relationship.targetRef) {
    throw new TypeError("config must contain a 'relationship' object with fields 'parentType', 'sourceRef', 'targetRef'. See docs.")
  }

  if (!config.data || !config.data.entities || !config.data.relationships) {
    throw new TypeError("config must contain a 'data' object with fields 'entities' and 'relationships'. See docs.")
  }

  return {type: SET_CONFIG, config}
}
