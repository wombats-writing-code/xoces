import _ from 'lodash'
import {instanceId} from '../../reducers/utilities'

export const computeLayout = (props) => {
  let data = props.data;
  let graph = props.graph;
  console.log('props to computeLayout in TreeComponent', props)

  // rank each node
  let nodesGrouped = _.groupBy(props.nodes, model => props.graph.getRank(model.id, data.entities, data.relationships));

  // console.log('nodesGrouped', nodesGrouped);
  let ranks = _.keys(nodesGrouped);

  let nodeRadius = 30;
  let topPadding = Math.max(30, nodeRadius)
  let rankSpacing = (props.height - topPadding) / ranks.length;

  let nodes = _.reduce(nodesGrouped, (result, models, rank) => {
    let nodeSpacing = props.width / models.length;

    _.forEach(models, (model, idx) => {
      // console.log('idx:', idx, 'rank:', rank, 'rankSpacing:', rankSpacing, 'nodeSpacing', nodeSpacing)

      let node = {
        instanceId: instanceId(),
        x: nodeSpacing*idx + nodeSpacing/2,
        y: rank*rankSpacing + topPadding,
        radius: nodeRadius,
        nodeLabelText: _.truncate(model[props.entityLabelKey]),
        nodeTagText: model[props.entityLabelKey],
        model
      }

      result.push(node)
    });


    return result;
  }, []);

  // ====
  // now compute edge layout
  // ====
  let edges = _.reduce(nodesGrouped, (result, models, rank) => {
    _.forEach(models, (model, idx) => {
      let sourceNode = _.find(nodes, {model: model});

      let es = graph.getOutgoingEntities(model.id, data.entities, data.relationships);
      _.forEach(es, (m, i) => {
        // console.log('source:', sourceNode.model.name, 'requires ', m.name)
        let targetNode = _.find(nodes, {model: m});

        let edge = {
          instanceId: instanceId(),
          x1: sourceNode.x + sourceNode.radius,
          y1: sourceNode.y + sourceNode.radius,
          x2: targetNode.x + targetNode.radius,
          y2: targetNode.y + targetNode.radius,
          source: sourceNode,
          target: targetNode
        }

        result.push(edge);
      });

    })
    return result;
  }, [])

  return {nodes, edges}
}
