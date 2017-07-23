
var entities, relationships;
var getDataPromise = $.ajax('http://open-ed-graph-dev.us-east-1.elasticbeanstalk.com/api/mapping?domainId=5939baa2f36d2842458b0ff5&entities=SUBJECT&entities=DEPARTMENT&entities=MODULE&entities=OUTCOME&relationships=HAS_PREREQUISITE_OF&relationships=HAS_PARENT_OF');

var school = {
  id: 'MIT',
  type: 'SCHOOL',
  displayName: 'MIT'
}

// =====
// instantiate a new Xoces widget
// ========
$.when(getDataPromise)
.done(function(data) {
  var entities = data.entities;
  var relationships = data.relationships;

  var parentType = 'HAS_PARENT_OF';

  entities = _.filter(entities, function(e) {
    if (e.type === 'DEPARTMENT') {
      return e.displayName === 'Course 16' || e.displayName === 'Course 18' || e.displayName === 'Course 6' || e.displayName === 'Course 8';
    }

    return true;
  });

  relationships = _.filter(relationships, r => {
    let source = _.find(entities, {id: r.sourceId})
    let target = _.find(entities, {id: r.targetId})

    return source && target;
  })

  // console.log('relationships', relationships)
  // console.log('entities', entities)
  console.log('departments', _.filter(entities, {type: 'DEPARTMENT'}))
  console.log('subjects', _.filter(entities, {type: 'SUBJECT'}))


  var schoolRelationships = _.map(_.filter(entities, {type: 'DEPARTMENT'}), function(e) {
    return {
      id: _.uniqueId(),
      sourceId: e.id,
      targetId: school.id,
      type: parentType
    }
  })

  var cw = xoces.widgets.XocesWidget.new({
    hierarchy: ['SCHOOL', 'DEPARTMENT', 'SUBJECT', 'MODULE', 'OUTCOME'],
    data: {
      entities: entities.concat(school),
      relationships: relationships.concat(schoolRelationships)
    },
    view: 'CHORD_VIEW',
    entityLabelKey: 'displayName',
    nodeLabelKey: 'displayName',
    relationship: {
      parentType: parentType,
      sourceRef: 'sourceId',
      targetRef: 'targetId',
    },
    width: '100%',
    height: 900,
    colorScheme: 'light',
    onMouseOverDirection: 'both',
    // onMouseOverDirection: 'incoming',
    onMouseOverFinish: function(data) {
    },
    onMouseOutFinish: function() {
    },
    onClickFinish: function(e, data) {
    }
  });

  // render it into the specified container
  cw.render({});

})
