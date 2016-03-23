'use strict';

require('./chord-diagram');
require('./tree-diagram');

require('ng-cache!./vis.html');
require('./vis.scss');
var directive = require('./vis.directive.js');
var controller = require('./vis.controller.js');
var params = require('./visParams.js');


angular.module('xocesApp.vis', [
	'xocesApp.vis.chordDiagram',
	'xocesApp.vis.treeDiagram',
])
.constant('Vis.Params', params)
.controller('visController', ['$scope', '$window', '$timeout', 'Vis.Params', 'ChordDiagram.Master', 'TreeDiagram.Master', controller])
.directive('vis', ['$window', directive])
