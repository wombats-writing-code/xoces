'use strict';

require('./chordDiagram.scss');

var master = require('./master.js');
var layout = require('./layout.js');
var animation = require('./animation.js');
var renderer = require('./renderer.js');
var shader = require('./shader.js');
var events = require('./events.js');

require('../../model');
require('../');

angular.module('xocesApp.vis.chordDiagram', [
	'xocesApp.model'
])
.factory('ChordDiagram.Layout', ['Mathy', 'Vis.Params', 'ModelCollection', layout])
.factory('ChordDiagram.Animation', ['Vis.Params', animation])
.factory('ChordDiagram.Events', ['$rootScope', 'ModelCollection', 'ChordDiagram.Animation', events])
.factory('ChordDiagram.Renderer', ['Mathy', 'Vis.Params', 'ChordDiagram.Events', 'ChordDiagram.Animation', renderer])
.factory('ChordDiagram.Shader', ['Vis.Params', shader])
.factory('ChordDiagram.Master', ['ModelCollection', 'ChordDiagram.Layout', 'ChordDiagram.Shader', 'ChordDiagram.Renderer', master])

