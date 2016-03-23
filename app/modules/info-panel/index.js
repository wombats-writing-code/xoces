'use strict';


require('ng-cache!./infoPanel.html');
require('./infoPanel.scss');

var directive = require('./infoPanel.directive.js');
var controller = require('./infoPanel.controller.js');

angular.module('xocesApp.infoPanel', [
	'xocesApp.model'
])
.controller( 'infoPanelController', ['$rootScope', '$scope', 'ModelCollection', controller])
.directive( 'infoPanel', ['$timeout', directive])
