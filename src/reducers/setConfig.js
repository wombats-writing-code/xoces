

export const SET_CONFIG = 'SET_CONFIG'

export const setConfig = (config) => {
  if (!config.hierarchy) {
    throw new TypeError("config must contain a 'hierarchy' array");
  }

  return {type: SET_CONFIG, config}
}
