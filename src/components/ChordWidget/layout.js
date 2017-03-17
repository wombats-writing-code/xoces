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
    level,
    graph
  }
*/
export const computeLayout = (props) => {
  // console.log('computeLayout props', props)
  let data = props.data;
  let hierarchy = props.hierarchy;
  let level = props.level;
  let graph = props.graph;
  let arcLabelKey = props.arcLabelKey;
  let outerRadius = props.outerRadius

  let depth = hierarchy.indexOf(level);
  if (depth === -1) {
    return new Error('level ' + level + ' not found');
  }

  // ====
  // compute layout for arcs
  // ===
  let arcModelType = hierarchy[depth+1];
  let arcModels = _.filter(data.entities, {type: arcModelType});
  let arcAngle = (2*Math.PI / arcModels.length);
  let arcPadding = .025;
  let arcs = _.map(arcModels, (m, idx) => _createArc(m, idx, arcAngle, arcPadding, null, 'arc'));

  console.log('arcs', arcModels, 'arcModelType', arcModelType)

  // ====
  // compute layout for subarcs
  // ====
  let subArcModelType = hierarchy[depth+2];
  let subArcModels = _.filter(data.entities, {type: subArcModelType});
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
    result = _.concat(result, _.map(group, (m, idx) => _createArc(m, idx, subArcAngle, subArcSpacing, parentArc.startAngle, 'subArc')));

    return result;
  }, []);

  console.log('subarcs', subArcs);

  // =====
  //  compute layout for labels
  // =====
  let labels = _.map(arcs, (a, idx) => _createLabel(a, idx, arcLabelKey, outerRadius));

  console.log('labels', labels);

  return {arcs, subArcs, labels};
}


export function _createArc(datum, i, arcAngle, arcPadding, start = 0, className) {
  let startAngle = start + i*arcAngle;

  return {
    id: datum.id,
    index: i,
    value: 1,
    startAngle: startAngle + arcPadding,
    endAngle: startAngle + arcAngle,
    padding: arcPadding,
    model: datum,
    className
  }
}

export function _createLabel(arc, i, arcLabelKey, outerRadius) {
  let centroid = _arcCentroid(arc);
  // console.log(arc.model.name, 'centroid', _radiansToDegrees(centroid))
  return {
    id: arc.model.id,
    index: i,
    value: 1,
    arc: arc,
    className: 'arcLabel',
    text: arc.model[arcLabelKey],
    position: _polarToRectangular({theta: centroid, r: outerRadius + 10}),
    translation: {
      x: 0,
      y: 0
    },
    fontSize: 12,
    rotation: _rotation(centroid),
    textAnchor: _textAnchor(centroid)
  }
}

function _arcCentroid(arc) {
  return arc.startAngle + (arc.endAngle - arc.startAngle) / 2;
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
