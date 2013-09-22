define(['backbone', "app/views/PokemonListView"], function(Backbone, PokemonListView){
	var PageView = Backbone.View.extend({
		initialize: function(options) {
			this.router = options.router;
			this.subViews.pokemonListView = new PokemonListView();
		},
		subViews: {},
		events: {
			"click .pokeList": "navigatePokedex",
			"click .pokemon-sort .sort-option[data-sort=all]": "navigatePokedex",
			"click .pokemon-sort .sort-option[data-sort=caught]": "navigatePokedexCaught",
			"click .pokemon-sort .sort-option[data-sort=missing]": "navigatePokedexMissing",
			"click .back": "navigateHome",
			"click .about": "navigateAbout"
		},
		navigateHome: function(){
			this.router.navigate('', {trigger:true})
		},
		navigatePokedex: function(){
			this.router.navigate('pokedex', {trigger:true});
		},
		navigatePokedexCaught: function(){
			this.router.navigate('pokedex/caught', {trigger:true});
		},
		navigatePokedexMissing: function(){
			this.router.navigate('pokedex/missing', {trigger:true});
		},
		navigateAbout: function(){
			this.router.navigate('about', {trigger:true});
		}
	});

	return PageView;
});