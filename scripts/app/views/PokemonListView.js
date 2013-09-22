define(['backbone'], function(Backbone){
	var PokemonListView = Backbone.View.extend({
		el: '.pokemonListView',
		initialize: function(options) {
			console.log("PokemonListView inited")
		},
		events: {
			"click .sort-option": "sortPokemonList",
			"keyup .searchPokemon": "searchPokemon"
		},
		sortPokemonList: function(event){
			var $sort = $(event.currentTarget),
				sortBy = $sort.data("sort");
			console.log(sortBy);
		},
		searchPokemon: function(event){
			var $searchField = $(event.currentTarget),
				searchTerm = $searchField.val();			
			console.log(searchTerm);
		}
	});

	return PokemonListView;
});