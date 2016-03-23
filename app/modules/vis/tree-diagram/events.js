'use strict';

module.exports = function Events($rootScope, ModelCollection, Animation, Params) {

	var textTitleClass = '.tree-vis__text-title';
	var textBodyClass = '.tree-vis__text-description';

	var nodeClass = '.tree-node';
	var linkClass = '.tree-link__link';
	var linkGroupClass = '.tree-link-group';
	var linkArrowClass = '.tree-link__arrow';

	var results = [];
	var getRequisites = function getRequisites(model, results) {
		for (var i=model.requisites.length; i--;) {
			results.push(model.requisites[i]);
			getRequisites(model.requisites[i], results);	
		}	
		return results;
	}

	var currentMouseover;
	var mouseoverHandler = function(mouseoverData, i) {
		currentMouseover = d3.event;
		currentMouseover = mouseoverData;
		$rootScope.$broadcast( 'mouseoveredModel', {model: currentMouseover});

		var results = [];

		var allRequisites = getRequisites(mouseoverData, results);
		var allRequisitesIds = _.pluck( allRequisites );
		var inFocusLinkGroup = d3.selectAll(linkGroupClass)
			.filter( function(d, i) {
				var joinsRequisite = (allRequisites.indexOf(d.source) > -1) && (allRequisites.indexOf(d.target) > -1);
				return joinsRequisite || d.target.id == mouseoverData.id || d.source.id == mouseoverData.id;
			})

		var inFocusNodes = d3.selectAll(nodeClass)
		.filter( function(d, i) {
			return allRequisites.indexOf(d) > -1 || d == mouseoverData;
		});

		// paints outFocus irrelevant nodes
		d3.selectAll(nodeClass)
		.filter( function(d, i) {
			return !(allRequisites.indexOf(d) > -1 || d == mouseoverData);
		})
		.select(textTitleClass)
		.style( "background", '#666' )

		// paints inFocus the node
		inFocusNodes
		.select(textTitleClass)
		.style( "background", Params.text.title.fill.inFocus )
		.style( "color", '#a31f34' )
		.style( "color", '#aaa' )

		// paints inFocus the node description (make it visible)
		inFocusNodes
		.select(textBodyClass)
		.style( "opacity", "1");

/*
		// paints outFocus the node title (make it visible)
		inFocusNodes
		.select(textBodyClass)
		.style( "opacity", "1");
*/

		// paints inFocus the relevant arrows
		inFocusLinkGroup
		.select(linkArrowClass)
		.style( "fill", Params.link.fill.inFocus)

		// paints inFocus the links that have this or any of its requisites as a source
		inFocusLinkGroup
		.select(linkClass)
		.style( "opacity", Params.link.opacity.inFocus)
		.style( "stroke", Params.link.stroke.inFocus )

	}

	var mouseoutHandler = function(mouseoutData, i) {
		d3.selectAll(textTitleClass)
		.style( "background", Params.text.title.fill.default )
		.style( "color", '#343434' );

		d3.selectAll(textBodyClass)
		.style( "opacity", 0);

		d3.selectAll(linkClass)
		.style( "opacity", Params.link.opacity.default )
		.style( "stroke", Params.link.stroke.default )

		d3.selectAll(linkArrowClass)
		.style( "fill", '#888' )
	}


	return {
		mouseoverHandler: mouseoverHandler,
		mouseoutHandler: mouseoutHandler,
	}	

}
