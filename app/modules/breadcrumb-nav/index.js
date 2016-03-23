'use strict';

var breadcrumbNavDirective = require('./breadcrumbNav.directive.js');
require('ng-cache!./breadcrumbNav.html');
require("./breadcrumbNav.scss");


module.exports = angular.module('xocesApp.breadcrumbNav', [
])
.directive( 'breadcrumbNav', breadcrumbNavDirective)
