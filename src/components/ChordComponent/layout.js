const _ = require('lodash')
import graphProvider from '../graph'
import {
  arcCentroid, arcStart,
  polarToRectangular, radiansToDegrees, degreesToRadians,
  rotation, textAnchor
} from '../canvas/geometry'
import {instanceId} from '../../reducers/utilities'

export const computeDimensions = (width, height) => {
  let w, h;
  if (!_.isFinite(width)) {
    w = parseFloat(width, 10);

  } else {
    w = width;
    h = height;
  }

  return {
    innerRadius: h/3.5,
    outerRadius: h/3.5 + 18*h/620
  }
}

/**
  needs an object of {
    data
    hierarchy
    currentLevelEntity,
    graph
  }
*/
export const computeLayout = (props) => {
  // console.log('computeLayout props', props);
  let data = props.data;
  let hierarchy = props.hierarchy;
  let currentLevelEntity = props.currentLevelEntity;
  let selectedEntities = props.selectedEntities;
  let graph = props.graph;
  let entityLabelKey = props.entityLabelKey;
  let outerRadius = props.outerRadius;

  // ====
  // compute layout for arcs
  // ===
  let arcLevelIndex = hierarchy.indexOf(currentLevelEntity.type) + 1;
  // console.log('arcLevelIndex', arcLevelIndex, currentLevelEntity.type)
  let children = graph.getChildren(currentLevelEntity.id, data.entities, data.relationships);
  let arcModels = _.filter(children, m => selectedEntities.indexOf(m) > -1 && m.type === hierarchy[arcLevelIndex]);
  let arcAngle = (2*Math.PI / arcModels.length);
  let arcPadding = .025;
  let arcs = _.map(arcModels, (m, idx) => _createArc(m, idx, arcAngle, arcPadding, idx, null));

  // console.log('arcs', arcs);
  // console.log('arc names', _.map(arcs, 'model.displayName'))

  if (!arcModels || arcModels.length === 0) {
    console.warn('no arc models')
    return null;
  }

  let subArcLevel = hierarchy[arcLevelIndex+1];

  // =======
  // compute layout for subarcs
  // ========
  let subArcModelsGrouped;
  if (arcModels[0].type === _.last(hierarchy)) {
    // get subArcModels by selecting those who are children of current model
    let subArcModels = _.clone(arcModels);
    subArcModelsGrouped = _.groupBy(subArcModels, 'id');

  } else {
    // get subArcModels by selecting those who are children of current arc model
    // only those children one level down in the hierarchy will be selected
    let subArcModels = _.filter(_.flatten(_.map(arcModels, e => {
      return graph.getChildren(e.id, data.entities, data.relationships);
    })), {type: subArcLevel});

    // console.log('subArcModels names', _.map(subArcModels, 'displayName'))

    subArcModelsGrouped = _.groupBy(subArcModels, model => {
      let parent = graph.getParent(model.id, data.entities, data.relationships);
      return parent ? parent.id : null;
    });
  }

  // console.log('subArcModelsGrouped', subArcModelsGrouped)

  let subArcSpacing = 0;
  let subArcs = _.reduce(subArcModelsGrouped, (result, group, parentId) => {
    // calculate angle of each subArc takes
    let subArcAngle = (arcAngle-arcPadding) / group.length;
    // get the rightful starting position of each subArc, from its parent
    let parentArc = _.find(arcs, a => a.model.id === parentId);

    if (!parentArc) {
      console.log('no parent arc of', parentId, 'for ', _.map(result, 'model.displayName'));
      return;
    }

    // compute arcs for these subarcs and append them to the running result
    result = _.concat(result, _.map(group, (m, idx) => _createArc(m, idx, subArcAngle, subArcSpacing, parentArc.index, parentArc.startAngle)));

    return result;
  }, []);

  // console.log('subarcs', subArcs);
  // console.log('subarcs names', _.map(subArcs, 'model.name'))

  // ===========
  //  compute layout for labels
  // ===========
  let arcLabels = _.map(arcs, (a, idx) => _createLabel(a, idx, entityLabelKey, outerRadius));
  let subArcLabels = _.map(subArcs, (a, idx) => _createLabel(a, idx, entityLabelKey, outerRadius, 'start'));

  // console.log('arc labels', arcLabels);
  // console.log('subArc labels', subArcLabels);

  // =======
  // create chords
  // =======
  let nonParentRelationships = _.reject(data.relationships, graph.isParentRelationship);
  // for all non parent relationships, see how many arcs they contain
  let chords = _.compact(_.map(nonParentRelationships, (r, idx) => {

    // find the source arc of the sourceId in this relationship
    let sourceArc = _.find(subArcs, arc => {
      // if the source is in one of the subarcs, return the model
      if (graph.isSourceOf(arc.model, r)) {
      // if (arc.model.id === r[config.sourceId])
        return arc;
      }
      // console.log('arc', arc)

      // if not, get all of its children and see which ones are its source arc
      let childrenAll = graph.getChildrenAll(arc.model.id, data.entities, data.relationships);
      return _.find(childrenAll, m => graph.isSourceOf(m, r));
    })

    if (!sourceArc) return null;;

    let targetArc = _.find(subArcs, arc => {
      // if the target is in one of the subarcs, return the model
      if (graph.isTargetOf(arc.model, r)) {
        return arc;
      }

      let childrenAll = graph.getChildrenAll(arc.model.id, data.entities, data.relationships);
      return _.find(childrenAll, m => graph.isTargetOf(m, r));
    })

    if (!targetArc) return null;

    if (sourceArc === targetArc) return null;

    // get the parent to filter out same-parent arcs
    // but only if we're not in the last layer of the hierarchy
    if (arcModels[0].type !== _.last(hierarchy)) {
      let sourceArcParent = graph.getParent(sourceArc.model.id, data.entities, data.relationships);
      let targetArcParent = graph.getParent(targetArc.model.id, data.entities, data.relationships);
      if (sourceArcParent === targetArcParent) return null;
    }

    // console.log('sourceArc', sourceArc.model.displayName, r);
    // console.log('targetArc', targetArc.model.displayName, r)

    return _createChord({sourceArc, targetArc}, idx);
  }));

  // console.log('chords', chords)

  return {
    arcs, subArcs,
    chords,
    arcLabels, subArcLabels
  };
}

export function _createChord(datum, i) {

  let sourceCentroid = arcCentroid(datum.sourceArc) + Math.min(.1, _.random(-datum.sourceArc.angle/2, datum.sourceArc.angle/2, true));
  let targetCentroid = arcCentroid(datum.targetArc) + Math.min(.1, _.random(-datum.sourceArc.angle/2, datum.sourceArc.angle/2, true));

  return {
    instanceId: instanceId(),
    source: {
      startAngle: sourceCentroid,
      endAngle: sourceCentroid,
      value: 1,
      index: i,
      arc: datum.sourceArc        // remember that these are subArcs
    },
    target: {
      startAngle: targetCentroid,
      endAngle: targetCentroid,
      value: 1,
      index: i,
      arc: datum.targetArc
    }
  }
}

export function _createArc(datum, i, arcAngle, arcPadding, arcIndex, start = 0) {
  let startAngle = start + i*arcAngle;

  return {
    instanceId: instanceId(),
    id: datum.id,
    index: i,
    arcIndex,
    value: 1,
    startAngle: startAngle + arcPadding,
    endAngle: startAngle + arcAngle,
    angle: startAngle + arcPadding - startAngle - arcAngle,
    padding: arcPadding,
    model: datum,
  }
}

export function _createLabel(arc, i, entityLabelKey, outerRadius, position = 'centroid') {
  let angle = arcCentroid(arc);
  if (position === 'start') {
    angle = arcStart(arc);
  }
  // console.log(arc.model.name, 'angle', radiansToDegrees(angle))
  return {
    instanceId: instanceId(),
    id: arc.model.id,
    index: i,
    value: 1,
    arc: arc,
    text: arc.model[entityLabelKey],
    position: polarToRectangular({theta: angle, r: outerRadius + 10}),
    translation: {
      x: 0,
      y: 0
    },
    fontSize: 12,
    rotation: rotation(angle),
    textAnchor: textAnchor(angle)
  }
}
