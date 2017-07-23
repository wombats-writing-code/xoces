import _ from 'lodash'
import {instanceId} from '../../reducers/utilities'

export const computeLayout = (props) => {
  let data = props.data;
  let graph = props.graph;
  // console.log('props to computeLayout in TreeComponent', props)

  // rank each node
  let nodesGrouped = _.groupBy(props.nodes, model => props.graph.getRank(model.id, data.entities, data.relationships));

  // console.log('nodesGrouped', nodesGrouped);
  let ranks = _.keys(nodesGrouped);

  let nodeRadius = 25;
  let topPadding = Math.max(30, nodeRadius)
  let rankSpacing = (props.height - topPadding) / ranks.length;

  let nodes = _.reduce(nodesGrouped, (result, models, rank) => {
    let nodeSpacing = props.width / models.length;

    _.forEach(models, (model, idx) => {
      // console.log('idx:', idx, 'rank:', rank, 'rankSpacing:', rankSpacing, 'nodeSpacing', nodeSpacing)
      let node = {
        id: model.id,
        instanceId: instanceId(),
        x: nodeSpacing*idx + nodeSpacing/2,
        y: rank*rankSpacing + topPadding,
        radius: nodeRadius,
        nodeLabelText: _.truncate(model[props.nodeLabelKey], {length: 20}),
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
        let targetNode = _.find(nodes, {model: m});
        // console.log('source:', sourceNode.model[props.entityLabelKey], 'requires: ', m[props.entityLabelKey])
        if (!targetNode) {
          // console.log('missing target node for edge', m)
          return
        };

        // console.log('source:', sourceNode.model[props.entityLabelKey], 'requires: ', m[props.entityLabelKey]);
        let x1 = sourceNode.x + sourceNode.radius;
        let y1 = sourceNode.y + sourceNode.radius;
        let x2 = targetNode.x + targetNode.radius;
        let y2 = targetNode.y + targetNode.radius;
        let dy = y2 - y1;
        let dx = x2 - x1;
        let theta = Math.atan((dy/dx));

        let x1Shift = sourceNode.radius * Math.cos(theta);
        let y1Shift = sourceNode.radius * Math.sin(theta);

        if (x1 > x2) {
          x1Shift = -x1Shift;
          y1Shift = -y1Shift;
        }

        let edge = {
          instanceId: instanceId(),
          x1: x1 + x1Shift,
          y1: y1 + y1Shift,
          x2: x2 + -x1Shift,
          y2: y2 + -y1Shift,
          theta,
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
