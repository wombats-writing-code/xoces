'use strict';

module.exports = function Events($rootScope, ModelCollection, Animation) {

	var arcTextClassName = '.arc-text';
	var subArcClassName = '.sub-arc';
	var subArcTextClassName = '.sub-arc-text';
	var chordClassName = '.chord__path, .chord__arrow';

	var currentMouseover = null, currentClicked = null;

	// event handlers =====
	var mouseoverHandler = function(mouseoverData, i) {
		currentMouseover = d3.event;
		currentMouseover.layoutModel = mouseoverData;
		$rootScope.$broadcast( 'mouseoveredModel', mouseoverData);

//		console.log('mouseovered:', mouseoverData);
		// get all the relevant subArcs:
		// all the subarcs in its requisite chain + itself
		var savedSubArcModels = [mouseoverData.model];

		if (mouseoverData.className == 'sub-arc') {
			d3.selectAll(subArcClassName)
			.filter( function(d, i) {
				var requisitesOfType = ModelCollection.getRequisitesOfSameType(mouseoverData.model);
				var matchesRequisites = requisitesOfType.typeModels.indexOf(d.model) > -1;
				var matchesSelf = (mouseoverData.model.id == d.model.id);
				if (matchesRequisites) savedSubArcModels.push(d.model);

				return matchesRequisites;
			});

		} else if (mouseoverData.className == 'arc') {
			d3.selectAll(subArcClassName)
			.filter( function(d, i) {
				var children = ModelCollection.getChildren(mouseoverData.model);
				var matchesChildren = children.indexOf(d.model) > -1;
				if (matchesChildren) savedSubArcModels.push(d.model);
			});
		}
	
		// handle subarc labels
		var ids = _.pluck(savedSubArcModels, 'id');
		if (!(d3.select('.arc').data()[0].model.modelType.name == 'OUTCOME' && mouseoverData.model.modelType.name == 'OUTCOME') ) {
			d3.selectAll(subArcTextClassName)
			.filter( function(d, i) {
				return ids.indexOf(d.model.id) > -1 || d.model.id == mouseoverData.model.id;
			})
			.call( Animation.paintInFocus );
		}

		// paint all non-relevant sub-arcs else out focus
		d3.selectAll(subArcClassName)
		.filter( function(d, i) {
			return savedSubArcModels.indexOf(d.model) == -1;
		})
		.call( Animation.paintOutFocus );

		// then paint the relevant sub-arcs in focus
		d3.selectAll(subArcClassName)
		.filter( function(d, i) {
			return savedSubArcModels.indexOf(d.model) > -1;
		})
		.call( Animation.paintInFocus );

		// paint all non-relevant chords outFocus
		d3.selectAll(chordClassName)
		.filter( function(d, i) {
			return d.target.model.id != mouseoverData.model.id;	
		})
		.call( Animation.paintOutFocus );

		// then paint all the chords that are involved in the requisite chain inFocus
		d3.selectAll(chordClassName)
		.filter( function(d, i) {			
			return d.target.model.id == mouseoverData.model.id;
		})
		.call( Animation.paintInFocus );

		// finally, handle arc text -- make them go outFocus unless they match exactly the arc text that's hovered on
		d3.selectAll(arcTextClassName)
		.filter( function(d) {
			//return d.model.id !== mouseoverData.model.id;
			return ids.indexOf(d.model.id) == -1 && d.model.id != mouseoverData.model.id;
		})
		.call( Animation.paintOutFocus );

	}

	var mouseoutHandler = function(d, i) {
		currentMouseover = null;
		$rootScope.$broadcast( 'mouseoutModel', currentMouseover);

		// handle sub-arcs
		d3.selectAll(subArcClassName)
		.call( Animation.paintDefault );

		// handle sub-arc-text
		d3.selectAll(subArcTextClassName)
		.call( Animation.paintDefault );

		// handle arc-text
		d3.selectAll(arcTextClassName)
		.call( Animation.paintDefault );

		// handle chords
		d3.selectAll(chordClassName)
		.call( Animation.paintDefault );
		
	}

	var clickHandler = function(eventData, i) {
		currentClicked = eventData;
		$rootScope.$broadcast( 'selectedModel', eventData );
	}

	// ==================

	return {
		mouseoverHandler: mouseoverHandler,
		mouseoutHandler: mouseoutHandler,
		clickHandler: clickHandler,
	}

};
