
let config;

const getParent = (id, entities, relationships) => {
  let rel = _.find(relationships, {[config.sourceRef]: id, type: config.parentType})

  if (!rel) return null;

  return rel ? _.find(entities, {id: rel[config.targetRef]}) : null;
}

const getChildren = (id, entities, relationships) => {
  let rels = _.filter(relationships, {[config.targetRef]: id, type: config.parentType})

  return _.map(rels, r => _.find(entities, {id: r[config.sourceRef]}));
}


function provider(configuration) {
  if (!configuration) {
    throw new TypeError('Configuration must be non-null.')
  }

  if (!configuration.sourceRef) {
    throw new TypeError('Configuration provided must have a sourceRef that specifies the key for the source in a relationship.')
  }

  if (!configuration.targetRef) {
    throw new TypeError('Configuration provided must have a targetRef field that specifies the key for the target in a relationship.')
  }

  config = configuration;

  return {
    getParent,
    getChildren
  }

}

export default provider
