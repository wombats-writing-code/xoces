'use strict';

require('ng-cache!./xplore.html');
require('./xplore.scss');

require('../info-panel');
require('../loading-curtain');
require('../breadcrumb-nav');

var controller = require('./xplore.controller.js');
var directive = require('./responsiveWidth.directive.js');

angular.module('xocesApp.xplore', [
	'xocesApp.model',
	'xocesApp.infoPanel',
	'xocesApp.loadingCurtain',
	'xocesApp.breadcrumbNav',
	'xocesApp.vis',
])
.directive('responsiveWidth', ['$window', directive])
.controller('xploreController', ['$rootScope', '$scope', '$timeout', 'ModelCollection', controller])
