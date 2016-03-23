'use strict';

module.exports = function TreeLayout(Mathy, Params, ModelCollection) {

	// gets a dictionary of each layer's nodes
	var getLayers = function(outcomes, dataName) {
		var findDepthTraverse = function findDepthTraverse(arg) {
			var reqs;
			// this will break if there's no 'module'. 
			// what we really want is the ability to check if it's within the same parent
			reqs = _.filter(arg.requisites, arg.withinSameModule, arg);

			if (reqs.length == 0) {
				return 0;
			} else {
				var maxDepth = 0;
				for (var i=reqs.length; i--;) {
					maxDepth = Math.max(maxDepth, findDepthTraverse(reqs[i]));
				}
				return maxDepth + 1;
			}
		}

		var layers = {};
		for (var j=0; j<outcomes.length; j++) {
//			console.log( '\n' + 'starting depth traverse for ' + outcomes[j].displayName );
			var depth = findDepthTraverse(outcomes[j]);
			layers[depth] = layers[depth] || [];
			layers[depth].push(outcomes[j]);
		}

		return layers;
	}

	var positionLabel = function(node, parentNode, siblings) {
		var index = _.findIndex(siblings, node);

		var xPos = node.label.description.x;
		var yPos = node.label.description.y;
		if (index % 2 == 0 && siblings.length > 1) {
			xPos = node.x - node.width - 12;
			yPos = node.y + node.height + 18;
		} else if (index === 0 && siblings) {

		}

		node.label.description.x = xPos;
		node.label.description.y = yPos;

		return node;
	}

	return {
		generateNodes: function(outcomes, dataName) {
			var nodeLayout = [];

			// move this elsewhere
			var updatedCanvasWidth = angular.element('.vis').width();

			var layers = getLayers(outcomes, dataName);
			var depths = Object.keys(layers);

			var lastY = Params.vis.marginTop;
			var spacePerLayer = 170;

			for (var i=0; i<depths.length; i++) {
				var thisLayer = layers[depths[i]];

				console.log(thisLayer);
				for (var j=0; j<thisLayer.length; j++) {
					var node = thisLayer[j];
					var spacePerNode = (updatedCanvasWidth - Params.vis.marginRight - Params.vis.marginLeft) / thisLayer.length;

					node.height = Params.vis.nodeWidth;
					node.width = Params.vis.nodeWidth;
					node.x = (j+.5)*spacePerNode;
					node.y = lastY;

					node.label =  {
						title: node.getShortName(),
						description: {
							text: node.displayName,
							x: node.x + node.width + 3,
							y: node.y
						}
					};
					nodeLayout.push(node);
				}
				lastY += spacePerLayer;
			}

			return nodeLayout;
		},
		generateLinks: function(nodeLayout, dataName) {
			var linkData = [];

			var alreadyHasLink = {};
			var layers = getLayers(nodeLayout, dataName);
			var depths = _.map(_.keys(layers), _.parseInt);

			for (var i=0; i<nodeLayout.length; i++) {
				var node = nodeLayout[i];

				// takes care of all arrows leading from outside to inside (prereqs)
				for (var j=0; j<node.requisites.length; j++) {	
					var targetNode = node.requisites[j];
					var key = node.id + '-' + targetNode.id;

					// same problem as above. need a method to check if it's within the same parent.
					var isInternal = node.withinSameModule(targetNode);

					if (!alreadyHasLink[key] && isInternal ) {
						var item = {
							source: node,
							target: targetNode,
							sourceShifted: {
								x: node.x + 8,
								y: node.y + node.height - 11
							},
							targetShifted: {
								x: targetNode.x + 8,
								y: targetNode.y + node.height - 11
							}
						};
						alreadyHasLink[key] = true;	
						linkData.push(item); 

					} else if (!isInternal) {
//						console.log('external requisite', targetNode);

						var item = {
							source: node,
							target: targetNode,
							sourceShifted: {
								x: node.x + 1.6*node.width - 2,
								y: node.y - 0.6*node.height - 13
							},
							targetShifted: {
								x: node.x + .7*node.width,
								y: node.y + .6*node.height - 16
							},
							isGhost: true
						};
						linkData.push(item); 
					}
				}	

			}


			return linkData;
		}
	}
}
