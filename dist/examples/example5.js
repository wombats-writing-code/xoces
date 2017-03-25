// console.log('xoces is loaded:', xoces);

// ========
// data that we want to visualize
// =========
var outcomes = [
  {id: '1', type: 'outcome', name: 'Become captain of a starship'},
  {id: '2', type: 'outcome', name: 'Do 50 pullups with a 20lb backpack'},
  {id: '3', type: 'outcome', name: 'Demonstrate leadership potential in crises situations'},
  {id: '4', type: 'outcome', name: 'Design engineering systems'},
  {id: '5', type: 'outcome', name: 'Collaborate with others in a team'},
  {id: '6', type: 'outcome', name: 'Derive the physics governing electromagnetic systems'},
  {id: '7', type: 'outcome', name: 'Apply Faraday\'s law'},
];


var relationships = [
  {id: 'r1', type: 'has_prerequisite_of', sourceId: '1', targetId: '2'},
  {id: 'r2', type: 'has_prerequisite_of', sourceId: '1', targetId: '3'},
  {id: 'r3', type: 'has_prerequisite_of', sourceId: '1', targetId: '4'},
  {id: 'r4', type: 'has_prerequisite_of', sourceId: '3', targetId: '5'},
  {id: 'r5', type: 'has_prerequisite_of', sourceId: '4', targetId: '6'},
  {id: 'r6', type: 'has_prerequisite_of', sourceId: '6', targetId: '7'},
]

// =====
// instantiate a new Xoces widget
// ========
var cw = xoces.widgets.TreeWidget.new({
  data: {
    entities: outcomes,
    relationships: relationships
  },
  entityLabelKey: 'name',
  relationship: {
    sourceRef: 'sourceId',
    targetRef: 'targetId',
  },
  width: '100%',
  height: 500,
  colorScheme: 'light',
  onMouseOverFinish: function(data) {
  },
  onMouseOutFinish: function() {
  },
  onClickFinish: function(edata) {
  }
});
// console.log('tree widget', cw);

// render it into the specified container
cw.render({
  container: 'xocesTreeWidgetContainer'
});
