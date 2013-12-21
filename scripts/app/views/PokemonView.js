define(['backbone'], function(Backbone){
	var PokemonView = Backbone.View.extend({
		initialize: function(options) {
			this.pageState.pokedexSort = options.pokedexSort || 'all';
			this.pokedexFilter = options.pokedexFilter;
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.remove, this);
		},
		pageState: {},
		template: _.template($('#pokemon-view-template').html()),
		pokemonInfoTemplate: _.template($('#pokemonInfo-view-template').html()),
		tagName: "div",
		className: "pokemon", 
		render: function() {
			var attributes = this.model.toJSON();
			attributes.pokedexFilterId = attributes[this.pokedexFilter];
			this.$el.html(this.template(attributes));
			return this.el;
		},
		remove: function() {
			var pokemonView = this;			
			this.$el.fadeOut(100, function(){
				pokemonView.$el.remove();

				var options = pokemonView.options;
				options.pokemonListViewRef.decrementSortCount(options.pokedexSort);
			});					
		},
		events: {
			"click .pokemon-inner": "toggleCaught",
			"mouseover .pokemon-inner": "displayPokemonInfo"
		},
		toggleCaught: function() {
			this.model.toggleCaught();
			if(this.pageState.pokedexSort !== "all") {				
				this.remove();
			}
		},
		displayPokemonInfo: function() {
			var attributes = this.model.toJSON(),
				locations = attributes.locations,
				gameSetsJson = {
					"Generation VI" : {
						"X": locations.x,
						"Y": locations.y
					},
					"Pokemon Black/White": {
						"Black 2": locations.black2 || "Not available",
						"White 2": locations.white2 || "Not available",
						"Black": locations.black || "Not available",
						"White": locations.white || "Not available"
					},
					"Pokemon Diamond/Pearl/Platinum" : {
						"Platinum": locations.platinum || "Not available",
						"Diamond": locations.diamond || "Not available",
						"Pearl": locations.pearl || "Not available"
					},
					"Pokemon HeartGold/SoulSilver": {
						"Heart Gold": locations.heartgold || "Not available",
						"Soul Silver": locations.soulsilver || "Not available"
					}
				};
			attributes.gameSetsJson = gameSetsJson;
			$('.pokemon-info').html(this.pokemonInfoTemplate(attributes));
			$('.pokemon-info').css({"top": $('body').scrollTop()+10})
		}
	});

	return PokemonView;
});