'use strict';

require('ng-cache!./loadingCurtain.html');
require('./loadingCurtain.scss');

var directive = require('./loadingCurtain.directive.js');

angular.module('xocesApp.loadingCurtain', [
])
.directive( 'loadingCurtain', directive)
