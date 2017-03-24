
var entities, relationships;
var entitiesPromise = $.ajax('https://xoces.mit.edu/api/v1/handcar/services/learning/objectivebanks/mc3-objectivebank:11@MIT-OEIT/objectives/')
var relationshipsPromise = $.ajax('https://xoces.mit.edu/api/v1/handcar/services/relationship/families/mc3-family:12@MIT-OEIT/relationships')

var school = {
  id: 'MIT',
  type: 'school',
  displayName: 'MIT'
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

  entities = _.filter(entities, function(e) {
    if (e.type === 'department') {
      return e.displayName === 'Course 16' || e.displayName === 'Course 18' || e.displayName === 'Course 6' || e.displayName === 'Course 8';
    }

    return true;
  });

  relationships = _.map(rData[0], function(relationship) {
    var r = _.assign({}, relationship, {
      type: relationship.genusTypeId
    })

    // console.log('type', r.type)

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
    hierarchy: ['school', 'department', 'subject', 'topic', 'outcome'],
    data: {
      entities: entities.concat(school),
      relationships: relationships.concat(schoolRelationships)
    },
    // view: 'CHORD_VIEW',
    currentLevelEntity: "mc3-objective%3A8152%40MIT-OEIT",
    view: 'TREE_VIEW',
    entityLabelKey: 'displayName',
    relationship: {
      parentType: parentType,
      sourceRef: 'sourceId',
      targetRef: 'destinationId',
    },
    width: '100%',
    height: 900,
    colorScheme: 'light',
    onMouseOver: function(e, data) {
      // console.log('embedded!: i was mouseovered!', e, data)
    },
    onMouseOut: function() {

    },
    onClick: function(e, data) {
      // console.log('i was clicked!', e, data)
    }
  });
  // console.log('chord widget', cw);

  // render it into the specified container
  cw.render({});

})
