const _ = require('lodash')

function configProvider() {
  return this;
}

export function init(props) {
  config = _.assign(config, props);
}

export default configProvider
