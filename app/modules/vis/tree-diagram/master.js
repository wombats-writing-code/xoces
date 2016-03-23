'use strict';

module.exports = function TreeMaster(ModelCollection, Layout, Renderer) {

	var treeLayout;

	var computeLayout = function(viewSpec) {
		var outcomes = ModelCollection.getOutcomes();

		// TODO: this will break if there's no 'modules' in the data set
		outcomes = outcomes.filter( function(o) {
			return _.pluck(o.modules, 'id').indexOf(viewSpec.modelId) > -1;
		});

		var nodeLayout = Layout.generateNodes(outcomes, viewSpec.dataName);
		var linkLayout = Layout.generateLinks(nodeLayout, viewSpec.dataName);
		var layout = {
			nodes: nodeLayout,
			links: linkLayout,
		};

		return layout;
	}

	return {
		draw: function(viewSpec, diagramSelection) {

			var layout = computeLayout(viewSpec);
			Renderer.render(layout, diagramSelection);

		},
		getTreeLayout: function(viewSpec) {
			return computeLayout(viewSpec);
		}
	}


}
