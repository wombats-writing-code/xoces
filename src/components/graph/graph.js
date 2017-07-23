import _ from 'lodash'

let config;

const getParent = (id, entities, relationships) => {
  let rel = _.find(relationships, {[config.sourceRef]: id, type: config.parentType})

  if (!rel) return null;

  // return _.find(entities, {id: rel[config.targetRef]});

  let parents = _.filter(entities, {id: rel[config.targetRef]});
  if (parents.length > 1) {
    console.warn('more than one parent found for', id)
  }

  // console.log('parents.length', parents.length)

  return parents[0]
}

const getParents = (id, entities, relationships) => {
  let rels = _.filter(relationships, {[config.sourceRef]: id, type: config.parentType})
  let targetIds = _.map(rels, config.targetRef)

  let parents = _.filter(entities, e => {
    return targetIds.indexOf(e.id) > -1
  });

  // console.log('parents', parents, targetIds, rels)

  return parents
}

const getParentsAll = (id, entities, relationships) => {
  let parent = getParent(id, entities, relationships);
  if (parent) {
    return _.reduce([parent], (result, e) => {
      result.push(e);
      let c = getParentsAll(e.id, entities, relationships)
      return _.concat(result, c);
    }, []);
  }

  return []
}

const getChildren = (id, entities, relationships) => {
  let rels = _.filter(relationships, {[config.targetRef]: id, type: config.parentType})

  return _.compact(_.map(rels, r => _.find(entities, {id: r[config.sourceRef]})));
}

const _memoizedGetChildren = _.memoize(getChildren)

const getChildrenAll = (id, entities, relationships) => {
  let children = getChildren(id, entities, relationships);
  return _.reduce(children, (result, e) => {
    result.push(e);
    let c = getChildrenAll(e.id, entities, relationships)
    return _.concat(result, c);
  }, []);
}

const getIncomingEntities = (id, entities, relationships) => {
  let rels = _.filter(relationships, r => r[config.targetRef] === id && r.type !== config.parentType);
  return _.compact(_.map(rels, r => _.find(entities, {id: r[config.sourceRef]})));
}

const getOutgoingEntities = (id, entities, relationships) => {
  let rels = _.filter(relationships, r => r[config.sourceRef] === id && r.type !== config.parentType);
  return _.compact(_.map(rels, r => _.find(entities, {id: r[config.targetRef]})));
}

const getOutgoingEntitiesAll = (id, entities, relationships) => {
  let outgoing = getOutgoingEntities(id, entities, relationships)
  return _.reduce(outgoing, (result, e) => {
    if (result.indexOf(e) === -1) {
      result.push(e);
      let c = getOutgoingEntitiesAll(e.id, entities, relationships)
      return _.concat(result, c);
    }

    return result;
  }, []);
}

const getOutgoingEdges = (sourceId, targetId, relationshipType, relationships) => {
  if (relationshipType) {
    return _.filter(relationships, r => r.sourceId === sourceId && r.targetId === targetId && r.type === relationshipType)
  }

  return _.filter(relationships, {sourceId: sourceId, targetId: targetId})
}

const getRank = (id, entities, relationships, optionalMaxRank = 20) => {
  let traverse = function traverse(entityId, stackCount, maxStack) {
    stackCount++;

    let reqs = getOutgoingEntities(entityId, entities, relationships);
    reqs = _.reject(reqs, e => {
      if (!e || e.id === entityId) return true;

      if (config.limitToSameParentInTree) {
        return getParent(e.id, entities, relationships) !== getParent(entityId, entities, relationships);  // only consider those within the same group
      }
    });

    // console.log('reqs of ', entityId, ':', _.map(reqs, 'name'));

    if (reqs.length == 0) {
      return 0;
    } else if (stackCount > maxStack) {
      return Infinity;

    } else {
      var maxDepth = 0;
      for (var i=reqs.length; i--;) {
          maxDepth = Math.max(maxDepth, traverse.bind(this)(reqs[i].id, stackCount, maxStack));
      }
      return maxDepth + 1;
    }
  }.bind(this);

  return traverse(id, 0, optionalMaxRank)
}

const isParentRelationship = (relationship) => {
  return relationship.type === config.parentType;
}

const isSourceOf = (entity, relationship) => {
  return entity.id === relationship[config.sourceRef]
}

const isTargetOf = (entity, relationship) => {
  return entity.id === relationship[config.targetRef]
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
    getParent: _.memoize(getParent),
    getParents: _.memoize(getParents),
    getParentsAll: _.memoize(getParentsAll),
    getChildren: _.memoize(getChildren),
    getChildrenAll: _.memoize(getChildrenAll),
    getIncomingEntities: _.memoize(getIncomingEntities),
    getOutgoingEntities: _.memoize(getOutgoingEntities),
    getOutgoingEntitiesAll: _.memoize(getOutgoingEntitiesAll),
    getOutgoingEdges: _.memoize(getOutgoingEdges),
    getRank,
    isParentRelationship,
    isSourceOf,
    isTargetOf
  }

}

export default provider
