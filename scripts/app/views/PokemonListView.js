define(['backbone', "app/collections/PokemonList"], function(Backbone, PokemonList){
	var PokemonListView = Backbone.View.extend({
		el: '.pokemonListView',
		initialize: function(options) {
			console.log("PokemonListView inited");
			this.collection = new PokemonList();
			this.listenTo(this.collection, 'reset', this.render);
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
			pokemonList = pokemonList || pageView.subViews.pokemonListView.collection.models;			
			var template = _.template('Template here '+pokemonList.length);
			this.$('.pokemon-list').html(template);
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