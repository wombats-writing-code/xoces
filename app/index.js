'use strict';

if (location.protocol === 'https:') {
        __webpack_public_path__ = 'https://' + window.location.host + '/';
} else {
        __webpack_public_path__ = 'http://' + window.location.host + '/';
}

require('./modules/model');
require('./modules/tools');
require('./modules/vis');
require('./modules/xplore');

var app = angular.module('xocesApp', ['ui.router',
	'xocesApp.tools',
	'xocesApp.xplore',
])
.config( ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $urlRouterProvider.rule(function ($injector, $location) {
                var path = $location.url();
                // check to see if the path already has a slash where it should be
                if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) return;
                if (path.indexOf('?') > -1) {
                        return path.replace('?', '/?');
                }

                return path + '/';
        });

        $stateProvider
        .state('xplore', {
                url: '/',
                templateUrl: 'xplore.html',
                controller: 'xploreController',
        })

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}]);

