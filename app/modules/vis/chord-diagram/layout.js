'use strict';

module.exports = function Layout(Mathy, Params, ModelCollection) {

	function ChordLayout(data) {
		this.collection = [];
		this.viewLevelType = null;
	}

	ChordLayout.prototype = {
		getCollection: function() {
			return this.collection;
		},
		getViewLevelType: function() {
			return this.viewLevelType;
		},
		getCollectionType: function() {
			return this.collectionType;
		},
		setViewLevelType: function(viewLevelType) {
			this.viewLevelType = viewLevelType;
			return this;
		},
		setCollectionType: function(collectionType) {
			this.collectionType = collectionType;
			return this;
		},
	};

	var labelPositioner = function(models) {
		var textRadius = Params.vis.outerRadius + 20;

		return function positioner(startAngle, endAngle) {
			var angle = startAngle + (endAngle - startAngle)/2;
			var anchor = 'end', rotation, position;

			// determine position & rotation
			if (models.length == 1) {
				position = {x: 0, y:0};
				anchor = 'middle';
				rotation = 0;
			} else {
				position = {
					x: textRadius * Math.sin(angle),
					y: -textRadius * Math.cos(angle),
				};

				// determine rotation
				var shifted = Math.abs( startAngle - Math.PI/2 );
				if (angle > 0 && angle <= Math.PI) {
					rotation = -Mathy.rad2deg( Math.PI/2 - angle);
				} else if (angle > Math.PI) {
					rotation = Mathy.rad2deg( Math.abs( (Math.PI/2 + angle)) );
				} 

				if (startAngle >= 0 && endAngle < Math.PI) {
					anchor = 'start';
				} 
				if ( Mathy.rad2deg(angle)>=179 && Mathy.rad2deg(angle)<=181 ) {
					anchor = 'start';
				}

			}

			return {
				position: position,
				rotation: rotation,
				anchor: anchor,
			}
		}
	}

	var visWidth, visHeight, visCenterX, visCenterY;

	return {
		generateArcLayout: function(models, parentType) {
			var layout = new ChordLayout();

			visWidth = angular.element('.vis').width();
			visHeight = angular.element('.vis').height();
			visCenterX = visWidth/2 - 120;
			visCenterY = Params.vis.outerRadius + Params.vis.marginTop;
			
			var arcPadding = Mathy.deg2rad(1.5);		// TODO: not hardcode
			var positioner = labelPositioner(models);

			if (models.length == 1) {
				arcPadding = 0;
			}

			var arcAngle = (2*Math.PI - arcPadding*models.length)/models.length;
			for (var i=0; i<models.length; i++) {
				var startAngle = i*(2*Math.PI / models.length);
				var labelPosition = positioner(startAngle, startAngle + arcAngle);

				var layoutItem = {
					index: i,
					value: 1,
					startAngle: startAngle,
					endAngle: startAngle + arcAngle,
					layoutType: Params.ARC,
					translation: {x: visCenterX, y: visCenterY},
					model: models[i],
					className: 'arc',
					label: {
						text: models[i].getShortName(),
						position: labelPosition.position,
						rotation: labelPosition.rotation,
						textAnchor: labelPosition.anchor
					}
				};
				layout.getCollection().push(layoutItem);
			}

			layout.setViewLevelType(parentType);
			layout.setCollectionType(models[0].modelType);
			return layout;
		},
		generateSubArcLayout: function(models, arcLayout) {
			var layout = new ChordLayout();

			for (var i=0; i<arcLayout.collection.length; i++) {
				var arcLayoutItem = arcLayout.collection[i];
				var arcLayoutModel = arcLayout.collection[i].model;

				var children = ModelCollection.getChildren(arcLayoutModel);
				var positioner = labelPositioner(models);
				var startAngle = arcLayoutItem.startAngle;
				var subArcWidth  = (arcLayoutItem.endAngle - arcLayoutItem.startAngle) / children.length;

				for (var j=0; j<children.length; j++) {
					var labelPosition = positioner(startAngle, startAngle + subArcWidth);
					var layoutItem = {
						startAngle: startAngle,
						endAngle: startAngle + subArcWidth,
						layoutType: Params.SUBARC,
						translation: {x: visCenterX, y: visCenterY},
						model: children[j],
						parent: arcLayoutModel,
						className: 'sub-arc',
						label: {
							text: children[j].getShortName(),
							position: labelPosition.position,
							rotation: labelPosition.rotation,
							textAnchor: labelPosition.anchor
						}
					};
					startAngle += subArcWidth;
					layout.getCollection().push(layoutItem);	
				}
			}

			// -------

			if (models.length > 0) {
				layout.setCollectionType(models[0].modelType);
			} else {
				layout.setCollectionType(null);
			}
			return layout;
		},
		generateChordLayout: function(outcomes, subArcLayout, arcLayout) {
			var layout = new ChordLayout();

			for (var i=0; i<subArcLayout.collection.length; i++) {
				var layoutItem = subArcLayout.collection[i];
				var layoutModel = layoutItem.model;
			
				var modelOutcomes = ModelCollection.getOutcomesOf(layoutModel);
				for (var j=0; j<modelOutcomes.length; j++) {

					// for each of its requisites...do chord logic
					for (var k=0; k<modelOutcomes[j].requisites.length; k++) {
						var req = modelOutcomes[j].requisites[k];

						// this checks if the arc parent(s) of this requisite outcome comes from outside the arc of the destination outcome
						var arcParents = ModelCollection.getParentsOfType(req, arcLayout.collection[0].model.modelType);
						var isExternalToArc = (arcParents.indexOf(layoutItem.parent) == -1);

						// this checks if the requisite outcome is within the current level view (the circle)
						var isWithinCircle = _.any( arcLayout.collection, function(arcLayoutItem) {
							return arcParents.indexOf(arcLayoutItem.model) > -1;
						});

						// if this requisite outcome exists within the current circle AND comes from outside of the arc, make a chord for it
						if (isWithinCircle && isExternalToArc) {
							// what if there's more than 1 sub-arc parent? ignore for now
							var subArcParentsModels = ModelCollection.getParentsOfType(req, layoutModel.modelType);
							var subArcParent = _.find(subArcLayout.collection, {model: subArcParentsModels[0]});

							var sourceLayoutItem = subArcParent;
							var destinationLayoutItem = layoutItem;

							var sourceSlice = (sourceLayoutItem.endAngle - sourceLayoutItem.startAngle) * 0.75;
							var sourceStart = Mathy.random(sourceLayoutItem.startAngle + sourceSlice, sourceLayoutItem.endAngle - sourceSlice);
							var targetSlice = (destinationLayoutItem.endAngle - destinationLayoutItem.startAngle) * 0.75;
							var targetStart = Mathy.random(destinationLayoutItem.startAngle + targetSlice, destinationLayoutItem.endAngle - targetSlice);

							var chordItem = {
								sourceModel: sourceLayoutItem.model,
								targetModel: layoutModel,
								source: {
									startAngle: sourceStart,
									endAngle: sourceStart,
									translation: {x: visCenterX, y: visCenterY},
									model: sourceLayoutItem.model,
								},
								target: {
									startAngle: targetStart,
									endAngle: targetStart,
									translation: {x: visCenterX, y: visCenterY},
									model: layoutItem.model,
								},
							};

							layout.collection.push(chordItem);
						}
					}
				}

/*
				var requisites = ModelCollection.getRequisitesOfSameType(layoutModel);
				var typeModels = requisites.typeModels;

				var subArcModels = _.pluck(subArcLayout.collection, 'model');
				var sourceLayoutItemsInside = _.filter(subArcLayout.collection, function(item, index) {
					return (typeModels.indexOf(item.model) > -1 && item.parent.id !== layoutItem.parent.id);
				});

				var sourceLayoutItemsOutside = _.filter(typeModels, function(req) {
					return subArcModels.indexOf(req) == -1;
				});
				// assigns positions for chords that are within the circle
				for (var j=0; j<sourceLayoutItemsInside.length; j++) {
					var sourceLayoutItem = sourceLayoutItemsInside[j];
				}
*/
			}

			return layout;
		}
	}

}
