define(['backbone'], function(){
	var PageView = Backbone.View.extend({
		initialize: function(options) {
			this.router = options.router;
		},
		events: {
			"click .pokeList": "navigatePokedex",
			"click .back": "navigateHome",
			"click .about": "navigateAbout"
		},
		navigateHome: function(){
			this.router.navigate('', {trigger:true})
		},
		navigatePokedex: function(){
			this.router.navigate('pokedex', {trigger:true});
		},
		navigateAbout: function(){
			this.router.navigate('about', {trigger:true});
		}
	});

	return PageView;
});