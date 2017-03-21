const _ = require('lodash')
import graphProvider from '../graph'
import {
  arcCentroid, arcStart,
  polarToRectangular, radiansToDegrees, degreesToRadians,
  rotation, textAnchor
} from './geometry'

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
    outerRadius: h/3.5 + 18
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
  let arcModels = _.filter(graph.getChildren(currentLevelEntity.id, data.entities, data.relationships), m => selectedEntities.indexOf(m) > -1);
  let arcAngle = (2*Math.PI / arcModels.length);
  let arcPadding = .025;
  let arcs = _.map(arcModels, (m, idx) => _createArc(m, idx, arcAngle, arcPadding, idx, null));

  // console.log('arcs', arcs);
  // console.log('arc names', _.map(arcs, 'model.name'))

  if (!arcModels || arcModels.length === 0) {
    console.warn('no arc models')
    // console.log('arc names', _.map(arcs, 'model.name'))
    return null;
  }

  // =======
  // compute layout for subarcs
  // ========
  let subArcModelsGrouped;
  if (arcModels[0].type === _.last(hierarchy)) {
    // get subArcModels by selecting those who are children of current model
    let subArcModels = _.clone(arcModels);
    subArcModelsGrouped = _.groupBy(subArcModels, 'id');

  } else {
    // get subArcModels by selecting those who are children of current model
    let subArcModels = _.flatten(_.map(arcModels, e => {
      return graph.getChildren(e.id, data.entities, data.relationships);
    }));

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
  // find the model in it or all its children that corresponds to the source of the relationship
  let chords = _.compact(_.map(nonParentRelationships, (r, idx) => {

    let sourceArc = _.find(subArcs, arc => {
      if (graph.isSourceOf(arc.model, r)) {
        return arc;
      }

      let childrenAll = graph.getChildrenAll(arc.model.id, data.entities, data.relationships);
      return _.find(childrenAll, m => graph.isSourceOf(m, r));
    })

    let targetArc = _.find(subArcs, arc => {
      if (graph.isTargetOf(arc.model, r)) {
        return arc;
      }

      let childrenAll = graph.getChildrenAll(arc.model.id, data.entities, data.relationships);
      return _.find(childrenAll, m => graph.isTargetOf(m, r));
    })

    if (sourceArc === targetArc) return null;
    if (!sourceArc || !targetArc) return null;

    // console.log('sourceArc', sourceArc.model.name, r);
    // console.log('targetArc', targetArc.model.name, r)

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

  let sourceCentroid = arcCentroid(datum.sourceArc) + _.random(-datum.sourceArc.angle/2, datum.sourceArc.angle/2, true);
  let targetCentroid = arcCentroid(datum.targetArc) + _.random(-datum.sourceArc.angle/2, datum.sourceArc.angle/2, true);

  return {
    instanceId: _instanceId(),
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
    instanceId: _instanceId(),
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
    instanceId: _instanceId(),
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

function _instanceId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + '-' + s4();
}
