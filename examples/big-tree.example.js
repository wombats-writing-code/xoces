
var outcomes;
var relationships;
var asssessmentItems;
var daoData;

fetch('./big-outcomes.json')
.then(function(res) {
  return res.json();
})
.then(function(data) {
  outcomes = _.map(data, function(o) {
    return _.assign({}, o, {
      name: o.displayName.text
    });
  });

  return fetch('./big-relationships.json');
})
.then(function(res) {
  return res.json();
})
.then(function(data) {
  relationships = _.map(data, function(rel) {
    rel.type = rel.genusTypeId;
    rel.targetId = rel.destinationId;
    return rel;
  });

  daoData = {entities: outcomes, relationships: relationships};

  // then fetch assessment items
  return fetch('./ACC-items.json')
})
.then(function(res) {
  return res.json();
})
.then(function(data) {
  // console.log('assessment items', data, 'daoData', daoData);
  asssessmentItems = data;

  var moduleIds = ['mc3-objective%3A14227%40MIT-OEIT']; // Unit 2 in college algebra
  var targetIds = ['mc3-objective%3A14289%40MIT-OEIT', 'mc3-objective%3A14329%40MIT-OEIT'];

  var width = 1800, height = 800;

  console.log(dao.getEntityById(moduleIds[0], daoData.entities))

  var nodes = dao.getOutgoingEntities(moduleIds[0], ['mc3-relationship%3Amc3.lo.2.lo.parent.child%40MIT-OEIT'], daoData);
  var dag = {
    nodes: nodes,
    edges: dao.getEdgeSet(_.map(nodes, 'id'), ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], daoData)
  };

  console.log(dag);

  init({
    dag: dag,
    wrapperId: 'example1',
    params: {
      drawing: {
        background: '#eee',
        width: width,
        height: height
      },
      node: {
        width: 15,
        height: 15,
        borderRadius: '50%',
        fill: function(outcome) {
          if (hasAssessmentItem(outcome.id)) {
            return '#AAD8B0';
          }

          // color red if outcome is doesn't have any assessment items
          return '#FF6F69';
        }
      },
      nodeCenterLabel: {
        fontSize: 10,
        property: function(outcome) {
          var items = _.filter(asssessmentItems, function(item) {
            return item.learningObjectiveIds.indexOf(outcome.id) > -1;
          });

          return items.length;
        }
      }
    }
  });
});

function hasAssessmentItem(outcomeId) {
  let taggedOutcomeIds = _.uniq(_.flatten(_.map(asssessmentItems, 'learningObjectiveIds')));
  return taggedOutcomeIds.indexOf(outcomeId) > -1;
}

function init(data) {
  var targetId = data.targetId;
  var wrapperEl = document.getElementById(data.wrapperId);

  wrapperEl.style.width = data.params.drawing.width + 'px';
  wrapperEl.style.height = data.params.drawing.height + 'px';

  var ranked = dao.rankDAG(data.dag, function(item) {
    return dao.getIncomingEntitiesAll(item.id, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], daoData);
  });

  var layout = Xoces.tree.layout(data.params, ranked, data.dag.edges);
  var styled = Xoces.tree.style(data.params, layout);
  var el = Xoces.tree.draw(styled, data.params, wrapperEl);
}

function initAssessment(data) {
  var targetId = data.targetId;
  var wrapperEl = document.getElementById(data.wrapperId);

  wrapperEl.style.width = data.params.drawing.width + 'px';
  wrapperEl.style.height = data.params.drawing.height + 'px';

  // var dag = dao.getPathway(data.targetId, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], 'OUTGOING_ALL', daoData);
  // var ranked = dao.rankDAG(dag, function(item) {
  //   return dao.getIncomingEntitiesAll(item.id, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], daoData);
  // });

}
