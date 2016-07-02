
// in these examples we use the bundled SFX that makes the variable xoces globally available

var outcomesUrl = 'https://mc3.mit.edu/handcar/services/learning/objectivebanks/mc3-objectivebank%3A2821%40MIT-OEIT/objectives';
var relationshipsUrl = 'https://mc3.mit.edu/handcar/services/relationship/families/mc3-family%3A147%40MIT-OEIT/relationships' + proxyParam;
 // + '?genustypeid=mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT';

var outcomes;
fetch(outcomesUrl + proxyParam)
.then(function(res) {
  return res.json();
})
.then(function(data) {
  console.log('outcomes', data);

  data = _.filter(data, {genusTypeId: 'mc3-objective%3Amc3.learning.outcome%40MIT-OEIT'});
  outcomes = _.map(data, function(o) {
    return _.assign({}, o, {
      name: o.displayName.text
    });
  });
});

window.setTimeout(function () {
  var relationships;
  fetch(relationshipsUrl)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    console.log('relationships', data);

    relationships = _.filter(data, {genusTypeId: 'mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'});

    init({
      outcomes: outcomes,
      relationships: relationships
    });

  });
}, 1000);


function init(data) {

  var outcomes = data.outcomes,
    relationships = data.relationships;

  var wrapperEl = document.getElementById('treeWrapper');

  wrapperEl.style.width = '940px';
  wrapperEl.style.height = '500px';

  // get the prerequisites of this item, all the way
  var depthFn = function(item) {
    var itemRelationships = _.filter(relationships, {sourceId: item.id});
    var requisites = _.map(itemRelationships, function(rel) {
      return _.find(outcomes, {id: rel.destinationId});
    });

    // console.log(item.name, 'requisites:', _.map(requisites, 'name'));
    return requisites;
  }

  var packed = Xoces.pack(outcomes, relationships, depthFn);
  var layout = Xoces.layout({}, packed);

  console.log('layout', layout);

  var el = Xoces.draw(layout, {


  }, wrapperEl);


}
