define(['backbone', "app/collections/PokemonList", 'app/views/PokemonView'],
	function(Backbone, PokemonList, PokemonView){
	var PokemonListView = Backbone.View.extend({
		el: '.pokemonListView',
		initialize: function(options) {
			this.collection = new PokemonList();
			this.options.sort=$('.sort-option.on').data('sort');
			this.listenToOnce(this.collection, 'resetComplete', this.renderSorted);
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
					var pokemonView = new PokemonView({model: pokemon, pokedexSort: this.options.sort});
					this.$('.pokemon-list').append(pokemonView.render());	
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