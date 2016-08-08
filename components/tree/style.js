
import styleParams from './styleParams'

/**
Applies styling props like stroke,
*/

module.exports = function style(userParams, data) {

  let params = _.merge({}, styleParams, userParams);
  console.log(params);

  let nodes;
  if (data.nodes) {
    nodes = _.map(data.nodes, (n) => {
      return _.assign({}, n, {
        fill: params.node.fill,
        stroke: params.node.stroke,
      });
    });
  }

  let links;
  if (data.links) {
    links = _.map(data.links, (e) => {
      return _.assign({}, e, {
        stroke: params.link.stroke,
        strokeWidth: params.link.strokeWidth,
      });
    });
  }

  let labels;
  if (data.labels) {
    labels = _.map(data.labels, (e) => {
      return _.assign({}, e, {
        fill: params.label.fill,
      });
    });
  }

  return {nodes, links, labels};

}
