define(['backbone', "app/collections/PokemonList", 'app/views/PokemonView'],
	function(Backbone, PokemonList, PokemonView){
	var PokemonListView = Backbone.View.extend({
		el: '.pokemonListView',
		initialize: function(options) {
			console.log("PokemonListView inited");
			this.collection = new PokemonList();
			this.listenToOnce(this.collection, 'reset', this.render);
		},
		options: {
			'sort': 'all',
			'searchTerm': ''
		},
		events: {
			"click .sort-option": "sortPokemonList",
			"keyup .searchPokemon": "searchPokemon"
		},
		render: function(pokemonList){
			this.$('.pokemon-list').html('');
			pokemonList = pokemonList || pageView.subViews.pokemonListView.collection.models;			
			_.each(pokemonList, function(pokemon) {
				if(pokemon) {
					var pokemonView = new PokemonView({model: pokemon});
					this.$('.pokemon-list').append(pokemonView.render({pokedexSort: this.options.sort}));	
				}				
			}, this);			
		},
		renderSorted: function(options){
			var filterOptions = _.extend({}, options, this.options),
				filteredPokemonList = this.collection.filterList( filterOptions );
			this.render(filteredPokemonList);
		},
		sortPokemonList: function(event){
			var $sort = $(event.currentTarget),
				sortBy = $sort.data("sort");			
			this.options.sort = sortBy;
			this.renderSorted();
		},
		searchPokemon: function(event){
			var $searchField = $(event.currentTarget),
				searchTerm = $searchField.val();
			this.options.searchTerm = searchTerm;
			this.renderSorted();			
		}
	});

	return PokemonListView;
});