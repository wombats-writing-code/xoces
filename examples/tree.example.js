
var outcomes;
var relationships;
var asssessmentItems;
var daoData;

fetch('./outcomes.json')
.then(function(res) {
  return res.json();
})
.then(function(data) {
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
  relationships = _.map(_.filter(data, function(rel) {
    rel.type = rel.genusTypeId;
    rel.targetId = rel.destinationId;
    return rel;
  }));

  daoData = {entities: outcomes, relationships: relationships};

  let targetIds = ['mc3-objective%3A13055%40MIT-OEIT', 'mc3-objective%3A13060%40MIT-OEIT', 'mc3-objective%3A13063%40MIT-OEIT'];

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
      nodeBottomLabel: {
        fontSize: 11,
      }
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
        width: 30,
        height: 30,
        borderRadius: '50%'
      },
      nodeBottomLabel: {
        fontSize: 10,
        property: function(outcome) {
          return outcome.name.split(' ').slice(0, 4).join(' ') + '...';
        }
      }
    }
  });

  init({
    targetId: targetIds[2],
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
        fill: function(outcome) {
          if (Math.random() > .5) {
            return '#AAD8B0';
          }
          // color red if outcome is doesn't have any assessment items
          return '#FF6F69';
        }
      },
      nodeCenterLabel: {
        fontSize: 10,
        property: function(outcome) {
          return outcome.id.split('%')[1];
        }
      },
      nodeBottomLabel: {
        fontSize: 10,
        property: function(outcome) {
          return outcome.name.split(' ').slice(0, 3).join(' ') + '...';
        }
      }
    }
  });
});

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
