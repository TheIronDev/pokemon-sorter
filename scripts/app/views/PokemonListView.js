define(['backbone', "app/collections/PokemonList", 'app/views/PokemonView'],
	function(Backbone, PokemonList, PokemonView){
	var PokemonListView = Backbone.View.extend({
		el: '.pokemonListView',
		initialize: function(options) {
			this.collection = new PokemonList();
			this.options.sort=$('.sort-option.on').data('sort');
			this.listenToOnce(this.collection, 'resetComplete', this.renderSorted);
		},
		// Really, the following data should not be hard coded, but... I wanted to avoid an additional call if possible.
		dirtyData: {
			totalCount: 649
		},
		options: {
			'sort': 'all',
			'searchTerm': '',
			'currentCount': 0
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
					var pokemonView = new PokemonView({model: pokemon, pokedexSort: this.options.sort, pokemonListViewRef: this});
					this.$('.pokemon-list').append(pokemonView.render());	
				}				
			}, this);			
		},
		renderSorted: function(options){
			var filterOptions = _.extend({}, options, this.options),
				filteredPokemonList = this.collection.filterList( filterOptions );
			this.updateCounts(filteredPokemonList.length, filterOptions.sort);
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
		},
		updateCounts: function(count, sortType){
			this.options.currentCount = count;
			var countTemplate = _.template('(<%= count %>)'),
				totalCount = this.dirtyData.totalCount;			
			if(sortType === "missing") {
				this.$('.sort-missing .count').text(countTemplate({count: count}));
				this.$('.sort-caught .count').text(countTemplate({count: (totalCount-count)}));
			} else if(sortType === "caught") {
				this.$('.sort-caught .count').text(countTemplate({count: count}));
				this.$('.sort-missing .count').text(countTemplate({count: (totalCount-count)}));
			} else {
				// Rather than save the caught/missing count... and rather than rechecking each of these counts...
				// I went with the easier (but slightly less usable solution) of removing counts when in 'all' mode.
				this.$('.sort-caught .count').text('');
				this.$('.sort-missing .count').text('');
			} 			
		},
		decrementSortCount: function(sortType){
			var newCount = this.options.currentCount-1;
			this.updateCounts(newCount, sortType);
		}
	});

	return PokemonListView;
});