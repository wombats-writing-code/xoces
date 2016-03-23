'use strict';

var model = require('./model.js');
var modelParams = require('./modelParams.js');
var proxy = require('./proxy.js');
var collectionSearch = require('./collectionSearch.js');
var modelCollection = require('./modelCollection.js');


angular.module('xocesApp.model', [

])
.constant('ModelParams', modelParams)
.factory('Proxy', ['$http', '$q', proxy])
.factory('Model', ['ModelParams', model])
.factory('collectionSearch', ['ModelParams', collectionSearch])
.factory('ModelCollection', ['$q', 'ModelParams', 'Model', 'Proxy', 'collectionSearch', modelCollection])

