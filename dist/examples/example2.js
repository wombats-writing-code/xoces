
var entities, relationships;
// var url = 'http://open-ed-graph-dev.us-east-1.elasticbeanstalk.com/api/mapping?domainId=593026b4734d1d5068f21e9d&entities=SUBJECT&entities=DEPARTMENT&entities=OUTCOME&relationships=HAS_PREREQUISITE_OF&relationships=HAS_PARENT_OF';
var url = 'http://open-ed-graph.aeizqnc7mw.us-east-1.elasticbeanstalk.com/api/mapping?domainId=593026b4734d1d5068f21e9d&entities=SUBJECT&entities=DEPARTMENT&entities=OUTCOME&relationships=HAS_PREREQUISITE_OF&relationships=HAS_PARENT_OF';
var getDataPromise = $.ajax(url)

let school = {
  id: 'SUTD',
  type: 'SCHOOL',
  displayName: 'SUTD'
}

// =====
// instantiate a new Xoces widget
// ========
$.when(getDataPromise)
.done(function(data) {
  console.log('done', data);
  var entities = data.entities;
  var relationships = data.relationships;

  entities = _.filter(entities, e => e && e.displayName.indexOf('[L') == -1);
  relationships = _.filter(relationships, r => {
    let source = _.find(entities, {id: r.sourceId})
    let target = _.find(entities, {id: r.targetId})

    return source && target;
  })


  var parentType = 'HAS_PARENT_OF';

  var schoolRelationships = _.map(_.filter(entities, {type: 'DEPARTMENT'}), e => {
    return {
      id: _.uniqueId(),
      sourceId: e.id,
      targetId: school.id,
      type: parentType
    }
  })

  console.log('departments', _.filter(entities, {type: 'DEPARTMENT'}))
  console.log('subjects', _.filter(entities, {type: 'SUBJECT'}))
  console.log('outcomes', _.filter(entities, {type: 'OUTCOME'}))

  var cw = xoces.widgets.XocesWidget.new({
    hierarchy: ['SCHOOL', 'DEPARTMENT', 'SUBJECT', 'OUTCOME'],
    data: {
      entities: entities.concat(school),
      relationships: relationships.concat(schoolRelationships)
    },
    view: 'CHORD_VIEW',
    currentLevelEntity: "5941e69b2b70774a40e3030f",
    view: 'TREE_VIEW',
    entityLabelKey: 'displayName',
    nodeLabelKey: 'displayName',
    relationship: {
      parentType: parentType,
      sourceRef: 'sourceId',
      targetRef: 'targetId',
    },
    width: '100%',
    height: 600,
    colorScheme: 'light',
    limitToSameParentInTree: false,
    onMouseOverDirection: 'both',
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
