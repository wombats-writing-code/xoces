
import styleParams from './styleParams'

/**
Applies styling props like stroke,
*/

module.exports = function style(userParams, data) {

  let params = _.merge({}, styleParams, userParams);

  let nodes;
  if (data.nodes) {
    nodes = _.map(data.nodes, (n) => {
      return _.assign({}, n, params.node);
    });
  }

  let links;
  if (data.links) {
    links = _.map(data.links, (e) => {
      return _.assign({}, e, params.link);
    });
  }

  let nodeBottomLabels;
  if (data.nodeBottomLabels) {
    nodeBottomLabels = _.map(data.nodeBottomLabels, (e) => {
      return _.assign({}, e, params.nodeBottomLabel);
    });
  }

  let nodeCenterLabels;
  if (data.nodeCenterLabels) {
    nodeCenterLabels = _.map(data.nodeCenterLabels, (e) => {
      return _.assign({}, e, params.nodeCenterLabel);
    });
  }

  return {nodes, links, nodeBottomLabels, nodeCenterLabels};

}
