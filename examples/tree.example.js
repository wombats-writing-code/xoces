
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

  outcomes = _.filter(outcomes, function(item) {
    var parents = dao.getIncomingEntities(item.id, ['mc3-relationship%3Amc3.lo.2.lo.parent-child%40MIT-OEIT'], {}, daoData);
    if (_.map(parents, 'id').indexOf('mc3-objective%3A14475%40MIT-OEIT') > -1) {
      return item;
    }
  });

  console.log('relationships', data);
  console.log('outcomes', data);
  console.log('dao data', daoData);

  init({
    outcomes: outcomes,
    relationships: relationships
  });
});

function init(data) {
  var outcomes = data.outcomes,
    relationships = data.relationships;

  var wrapperEl = document.getElementById('treeWrapper');

  var width = 900;
  wrapperEl.style.width = width + 'px';
  wrapperEl.style.height = '700px';

  var dag = dao.getPathway('mc3-objective%3A14478%40MIT-OEIT', ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], 'OUTGOING_ALL', daoData);
  console.log('dag', dag);

  var ranked = dao.rankDAG(dag, function(item) {
    return dao.getIncomingEntitiesAll(item.id, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], daoData);
  });

  console.log('ranked', ranked);

  let params = {
    drawing: {
      width: width
    },
    node: {
      width: 30,
      height: 30,
    },
  };

  var layout = Xoces.tree.layout(params, ranked, dag.edges);
  var styled = Xoces.tree.style({}, layout);
  // console.log('layout', layout);
  // console.log('styled', styled)

  var el = Xoces.tree.draw(styled, {}, wrapperEl);


}
