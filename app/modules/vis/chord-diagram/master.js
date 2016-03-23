'use strict';

module.exports = function(ModelCollection, Layout, Shader, Renderer) {

	var strategies = {
		'ROOT': {
			getArcModels: function(){
				return ModelCollection.getUniqueCourses();
			},
			getSubArcModels: function(){
				return ModelCollection.getUniqueSubjects();
			},
		},
		'COURSE': {
			getArcModels: function(id){
				var course = _.findWhere(ModelCollection.getUniqueCourses(), {'id': id});
				return ModelCollection.getChildren(course);
			},
			getSubArcModels: function(id){
				var course = _.findWhere(ModelCollection.getUniqueCourses(), {'id': id});
				var arcLevel = ModelCollection.getChildren(course);
				var subArcLevel = _.flatten( ModelCollection.getChildren(course).map( ModelCollection.getChildren ) );
				return subArcLevel || [];
			}
		},
		'SUBJECT': {
			getArcModels: function(id){
				var subject = _.findWhere(ModelCollection.getUniqueSubjects(), {'id': id});
				return ModelCollection.getChildren(subject);
			},
			getSubArcModels: function(id){
				var subject = _.findWhere(ModelCollection.getUniqueSubjects(), {'id': id});
				var arcLevel = ModelCollection.getChildren(subject);
				var subArcLevel = _.flatten(arcLevel.map( ModelCollection.getChildren));

				return subArcLevel;
			}
		},
		'MODULE': {
			getArcModels: function(id) {
				var module = _.findWhere(ModelCollection.getUniqueModules(), {'id': id});
				return ModelCollection.getChildren(module);
			},
			getSubArcModels: function(id){
				var module = _.findWhere(ModelCollection.getUniqueModules(), {'id': id});
				var arcLevel = ModelCollection.getChildren(module);
				var subArcLevel = _.flatten(arcLevel.map( ModelCollection.getChildren));

				return subArcLevel;
			}
		},
		'OUTCOME': {
			getArcModels: function(modelId){
				return _.filter(ModelCollection.getOutcomes(), {'id': modelId});
			},
			getSubArcModels: function(modelId){
				return _.filter(ModelCollection.getOutcomes(), {'id': modelId});
			},
		},
	};

	return {
		draw: function(viewSpec, diagramSelection) {

			// decides what models 'arcs' and 'subarcs' are depending on the view level
			// e.g. if the view level is at subject, then arcs are subjects and subarcs are modules 
			var outcomes = ModelCollection.getOutcomes();
			var arcModels = strategies[viewSpec.levelName].getArcModels(viewSpec.modelId)
			.filter( function(model) {
				return model.isDrawn;
			});
			var subArcModels = strategies[viewSpec.levelName].getSubArcModels(viewSpec.modelId)
			.filter( function(model) {
				return model.isDrawn;
			});

			console.log(viewSpec.levelName, 'arc models: ', arcModels);	
			console.log(viewSpec.levelName, 'sub arc models: ', subArcModels);	

			// === LAYOUT: ARC, SUBARC, CHORD
			// --- generate arcs 
			var arcLayout = Layout.generateArcLayout(arcModels);
			arcLayout = Shader.shadeArc(arcLayout);

			// --- generate subarcs
			var subArcLayout = Layout.generateSubArcLayout(subArcModels, arcLayout);
			subArcLayout = Shader.shadeSubArc(subArcLayout);

			// --- generate chords
			var chordLayout = Layout.generateChordLayout(outcomes, subArcLayout, arcLayout);
			chordLayout = Shader.shadeChord( chordLayout );

			// === RENDER
			Renderer.drawChords(chordLayout.getCollection(), diagramSelection);
			Renderer.drawArcs( arcLayout.getCollection(), diagramSelection );
			Renderer.drawArcs( subArcLayout.getCollection(), diagramSelection );

			Renderer.drawText( arcLayout.getCollection(), diagramSelection );
			Renderer.drawText( subArcLayout.getCollection(), diagramSelection );
		}
	}
}
