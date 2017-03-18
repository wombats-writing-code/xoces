const _ = require('lodash')
import graphProvider from '../graph'


export const computeDimensions = (width, height) => {
  let w, h;
  if (!_.isFinite(width)) {
    w = parseFloat(width, 10);

  } else {
    w = width;
    h = height;
  }

  return {
    innerRadius: h/3,
    outerRadius: h/3 + 18
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
  let graph = props.graph;
  let entityLabelKey = props.entityLabelKey;
  let outerRadius = props.outerRadius;


  // ====
  // compute layout for arcs
  // ===
  let arcModels = graph.getChildren(currentLevelEntity.id, data.entities, data.relationships);
  let arcAngle = (2*Math.PI / arcModels.length);
  let arcPadding = .025;
  let arcs = _.map(arcModels, (m, idx) => _createArc(m, idx, arcAngle, arcPadding, null));

  // console.log('arc names', _.map(arcs, 'model.name'))

  // ====
  // compute layout for subarcs
  // ====
  // get subArcModels by selecting those who are children of current model
  let subArcModels = _.flatten(_.map(arcModels, e => {
    return graph.getChildren(e.id, data.entities, data.relationships);
  }));
  let subArcModelsGrouped = _.groupBy(subArcModels, model => {
    let parent = graph.getParent(model.id, data.entities, data.relationships);
    return parent ? parent.id : null;
  });

  // console.log('subArcModelsGrouped', subArcModelsGrouped)

  let subArcSpacing = 0;
  let subArcs = _.reduce(subArcModelsGrouped, (result, group, parentId) => {
    // calculate angle of each subArc takes
    let subArcAngle = (arcAngle-arcPadding) / group.length;
    // get the rightful starting position of each subArc, from its parent
    let parentArc = _.find(arcs, a => a.model.id === parentId);
    // compute arcs for these subarcs and append them to the running result
    result = _.concat(result, _.map(group, (m, idx) => _createArc(m, idx, subArcAngle, subArcSpacing, parentArc.startAngle)));

    return result;
  }, []);

  // console.log('subarcs', subArcs);
  // console.log('subarcs names', _.map(subArcs, 'model.name'))

  // =====
  //  compute layout for labels
  // =====
  let arcLabels = _.map(arcs, (a, idx) => _createLabel(a, idx, entityLabelKey, outerRadius));
  let subArcLabels = _.map(subArcs, (a, idx) => _createLabel(a, idx, entityLabelKey, outerRadius, 'start'));

  console.log('arc labels', arcLabels);
  console.log('subArc labels', subArcLabels);

  return {arcs, subArcs, arcLabels, subArcLabels};
}


export function _createArc(datum, i, arcAngle, arcPadding, start = 0) {
  let startAngle = start + i*arcAngle;

  return {
    id: datum.id,
    index: i,
    value: 1,
    startAngle: startAngle + arcPadding,
    endAngle: startAngle + arcAngle,
    padding: arcPadding,
    model: datum,
  }
}

export function _createLabel(arc, i, entityLabelKey, outerRadius, position = 'centroid') {
  let angle = _arcCentroid(arc);
  if (position === 'start') {
    angle = _arcStart(arc);
  }
  // console.log(arc.model.name, 'angle', _radiansToDegrees(angle))
  return {
    id: arc.model.id,
    index: i,
    value: 1,
    arc: arc,
    text: arc.model[entityLabelKey],
    position: _polarToRectangular({theta: angle, r: outerRadius + 10}),
    translation: {
      x: 0,
      y: 0
    },
    fontSize: 12,
    rotation: _rotation(angle),
    textAnchor: _textAnchor(angle)
  }
}

function _arcCentroid(arc) {
  return arc.startAngle + (arc.endAngle - arc.startAngle) / 2;
}

function _arcStart(arc) {
  return arc.startAngle + (arc.endAngle - arc.startAngle) / 3;
}

/***
  theta is in radians, relative to 12'oclock
 note that SVG coors is x -> positive and y going down is positive
*/
function _polarToRectangular(coors) {
  return {
    x: coors.r * Math.sin(coors.theta),
    y: -coors.r * Math.cos(coors.theta)
  }
}

function _radiansToDegrees(rad) {
  return rad * 180 / Math.PI;
}

function _textAnchor(centroid) {
  // console.log('arc', arc.model.name, 'start', _radiansToDegrees(arc.startAngle), 'end', _radiansToDegrees(arc.endAngle), 'degrees');
  // console.log('arc', arc.model.name, 'start', (arc.startAngle), 'end', (arc.endAngle), 'rad');

  if (centroid < Math.PI) {
    return 'start'

  } else {
    return 'end'
  }
}

function _rotation(centroid) {
  if (centroid < Math.PI) {
    return -1 * _radiansToDegrees(Math.PI / 2 - centroid)

  } else {
    return _radiansToDegrees(centroid) - 90 - 180;
  }
}

// let layout = new ChordLayout();
//
// visWidth = angular.element('.vis').width();
// visHeight = angular.element('.vis').height();
// visCenterX = visWidth/2 - 120;
// visCenterY = Params.vis.outerRadius + Params.vis.marginTop;
//
// let arcPadding = Mathy.deg2rad(1.5);		// TODO: not hardcode
// let positioner = labelPositioner(models);
//
// if (models.length == 1) {
//   arcPadding = 0;
// }
//
// for (let i=0; i<models.length; i++) {
//   let labelPosition = positioner(startAngle, startAngle + arcAngle);
//
// }
