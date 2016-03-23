'use strict';

require('./treeDiagram.scss');

var master = require('./master.js');
var layout = require('./layout.js');
var animation = require('./animation.js');
var events = require('./events.js');
var renderer = require('./renderer.js');
var shader = require('./shader.js');

require('../../model');
require('../');

angular.module('xocesApp.vis.treeDiagram', [
	'xocesApp.model'
])
.factory('TreeDiagram.Layout', ['Mathy', 'Vis.Params', 'ModelCollection', layout])
.factory('TreeDiagram.Animation', ['Vis.Params', animation])
.factory('TreeDiagram.Events', ['$rootScope', 'ModelCollection', 'TreeDiagram.Animation', 'Vis.Params', events])
.factory('TreeDiagram.Renderer', ['TreeDiagram.Events', 'Vis.Params', 'Mathy', renderer])
.factory('TreeDiagram.Master', ['ModelCollection', 'TreeDiagram.Layout', 'TreeDiagram.Renderer', master])
.factory('TreeDiagram.Shader', ['Vis.Params', shader])
