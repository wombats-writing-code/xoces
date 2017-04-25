
var entities, relationships;
var entitiesPromise = $.ajax('https://mc3.mit.edu/handcar/services/learning/objectivebanks/mc3-objectivebank:2814@MIT-OEIT/objectives/')
var relationshipsPromise = $.ajax('https://mc3.mit.edu/handcar/services/relationship/families/mc3-family:139@MIT-OEIT/relationships')

let school = {
  id: 'SUTD',
  type: 'school',
  displayName: 'SUTD'
}

// =====
// instantiate a new Xoces widget
// ========
$.when(entitiesPromise, relationshipsPromise)
.done(function(eData, rData) {
  // console.log('done', eData[0], rData[0]);

  var parentType = 'mc3-relationship%3Amc3.lo.2.lo.parent.child%40MIT-OEIT';

  entities = _.map(eData[0], function(item) {
    // console.log(item.genusTypeId)
    return _.assign({}, item, {
      displayName: item.displayName.text,
      type: item.genusTypeId.replace('mc3-objective%3Amc3.', '').replace('%40MIT-OEIT', '').replace('learning.', '')
    })
  });

  relationships = _.map(rData[0], function(relationship) {
    let r = _.assign({}, relationship, {
      type: relationship.genusTypeId
    })

    if (r.genusTypeId === parentType) {
      var tempSourceId = r.sourceId;

      r.sourceId = r.destinationId,
      r.destinationId = tempSourceId;
    }

    return r;
  });

  // console.log('relationships', relationships)

  var schoolRelationships = _.map(_.filter(entities, {type: 'department'}), e => {
    return {
      id: _.uniqueId(),
      sourceId: e.id,
      destinationId: school.id,
      type: parentType
    }
  })

  var cw = xoces.widgets.XocesWidget.new({
    hierarchy: ['school', 'department', 'subject', 'outcome'],
    data: {
      entities: entities.concat(school),
      relationships: relationships.concat(schoolRelationships)
    },
    view: 'CHORD_VIEW',
    // currentLevelEntity: "mc3-objective%3A12722%40MIT-OEIT",
    // view: 'TREE_VIEW',
    entityLabelKey: 'displayName',
    nodeLabelKey: 'displayName',
    relationship: {
      parentType: parentType,
      sourceRef: 'sourceId',
      targetRef: 'destinationId',
    },
    width: '100%',
    height: 500,
    colorScheme: 'light',
    onMouseOverFinish: function(data) {
    },
    onMouseOutFinish: function() {
    },
    onClickFinish: function(data) {
    }
  });

  // render it into the specified container
  cw.render({
    container: 'xocesContainer'
  });

})
