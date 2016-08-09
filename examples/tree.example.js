
var outcomes;
var relationships;
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

  let targetOutcomeIds = ['mc3-objective%3A14478%40MIT-OEIT', 'mc3-objective%3A14329%40MIT-OEIT'];

  var width = 900, height = 500;

  init({
    outcomes: outcomes,
    relationships: relationships,
    wrapperId: 'example1',
    targetId: targetOutcomeIds[0],
    params: {
      drawing: {
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
    outcomes: outcomes,
    relationships: relationships,
    wrapperId: 'example2',
    targetId: targetOutcomeIds[1],
    params: {
      drawing: {
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

});

// === first example ===
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
  var styled = Xoces.tree.style({}, layout);
  var el = Xoces.tree.draw(styled, {}, wrapperEl);
}
