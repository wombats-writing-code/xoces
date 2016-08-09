
var outcomes;
var relationships;
var asssessmentItems;
var daoData;

fetch('./outcomes.json')
.then(function(res) {
  return res.json();
})
.then(function(data) {
  data = _.filter(data, {genusTypeId: 'mc3-objective%3Amc3.learning.outcome%40MIT-OEIT'});
  outcomes = _.map(data, function(o) {
    return _.assign({}, o, {
      name: o.displayName.text
    });
  });

  return fetch('./relationships.json');
})
.then(function(res) {
  return res.json();
})
.then(function(data) {
  relationships = _.map(_.filter(data, {genusTypeId: 'mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'}), function(rel) {
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
  console.log('assessment items', data);
  asssessmentItems = data;
  let targetIds = ['mc3-objective%3A14478%40MIT-OEIT', 'mc3-objective%3A14329%40MIT-OEIT', 'assessment.Item%3A5751b5e8e7dde00feac50d94%40bazzim.MIT.EDU'];

  var width = 900, height = 500;

  init({
    outcomes: outcomes,
    relationships: relationships,
    wrapperId: 'example1',
    targetId: targetIds[0],
    params: {
      drawing: {
        background: '#333',
        width: width,
        height: height
      },
      node: {
        width: 30,
        height: 30,
      },
    }
  });

  init({
    targetId: targetIds[1],
    outcomes: outcomes,
    relationships: relationships,
    wrapperId: 'example2',
    params: {
      drawing: {
        background: '#fff',
        width: width,
        height: height
      },
      node: {
        width: 15,
        height: 15,
        borderRadius: '50%'
      },
    }
  });

  init({
    targetId: targetIds[1],
    outcomes: outcomes,
    relationships: relationships,
    wrapperId: 'example3',
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
        fill: function(item) {
          if (hasAssessmentItem(item.id)) {
            console.log('has item', item)
            return '#AAD8B0';
          }

          // color red if outcome is doesn't have any assessment items
          return '#FF6F69';
        }
      },
    }
  });
});

function hasAssessmentItem(outcomeId) {
  let taggedOutcomeIds = _.uniq(_.flatten(_.map(asssessmentItems, 'learningObjectiveIds')));
  return taggedOutcomeIds.indexOf(outcomeId) > -1;
}

function init(data) {
  var outcomes = data.outcomes,
    relationships = data.relationships;

  var targetId = data.targetId;
  var wrapperEl = document.getElementById(data.wrapperId);

  wrapperEl.style.width = data.params.drawing.width + 'px';
  wrapperEl.style.height = data.params.drawing.height + 'px';

  var dag = dao.getPathway(data.targetId, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], 'OUTGOING_ALL', daoData);
  var ranked = dao.rankDAG(dag, function(item) {
    return dao.getIncomingEntitiesAll(item.id, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], daoData);
  });

  var layout = Xoces.tree.layout(data.params, ranked, dag.edges);
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
