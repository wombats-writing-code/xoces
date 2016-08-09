
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

  let labels;
  if (data.labels) {
    labels = _.map(data.labels, (e) => {
      return _.assign({}, e, params.label);
    });
  }

  return {nodes, links, labels};

}
