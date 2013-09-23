define(['backbone', 'backboneLocalStorage', 'app/models/Pokemon'],
	function(Backbone, BackboneLocalStorage, Pokemon){
	var PokemonList = Backbone.Collection.extend({
		initialize: function() {		
			console.log("pokemon list collection init");
			this.fetch({reset: true});
		},
		model: Pokemon,
		url: 'scripts/data/pokedex.json',
		localStorage: new Store("pokedex"),
		parse: function(data) {
		    return data;
		}
	});

	return PokemonList;
});