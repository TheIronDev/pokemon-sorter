define(['backbone', 'backboneLocalStorage', 'app/models/Pokemon'],
	function(Backbone, BackboneLocalStorage, Pokemon){
	var PokemonList = Backbone.Collection.extend({
		initialize: function() {		
			console.log("pokemon list collection init");
			this.fetch({reset: true});
		},
		model: Pokemon,
		url: '/scripts/data/pokedex.json',
		localStorage: new Store("pokedex"),
		fetch: function(){
			var listContext = this;
			$.getJSON(listContext.url, function(result){
				// This is dirty and wrong, but I couldn't seem to get native collection.fetch working correctly...
				listContext.reset(result);				
			});
		},
		filterList: function(options){			
			var searchFilter = options.searchTerm || '';
			var sortType = options.sort || 'all';
			searchFilter = searchFilter.toLowerCase();

			var filteredList = this.models.filter(function(pokemon){
				var pokemonName = pokemon.get("name").toLowerCase();
				var isPokemonCaught = pokemon.get("caught");
				if(pokemonName.indexOf(searchFilter) != -1 ) {
					if(sortType == "all") {
						return pokemon;
					} else if(sortType == "caught" && isPokemonCaught) {
						return pokemon;
					} else if(sortType == "missing" && !isPokemonCaught) {
						return pokemon;
					}
				}
			});

			return filteredList;
		}
	});

	return PokemonList;
});