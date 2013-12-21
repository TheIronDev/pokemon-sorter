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
			var attributes = this.model.toJSON();										
			$('.pokemon-info').html(this.pokemonInfoTemplate(attributes));
			$('.pokemon-info').css({"top": $('body').scrollTop()+10})
		},
		printLocations: function(locations) {
			var $wrapper = $('<div>');
			$wrapper.append("<h4>Locations</h4>");
			var $gameSets = $('<ul>');
			$gameSets.attr("class", "location-game-sets");

			// Formatting JSON used to store the display layer
			var gameSetsJson = {
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
			
			// Refactored the previous code by using a display-layor json
			for(var gameSet in gameSetsJson) {
				var $gameSet = $('<li>');
				$gameSet.attr("class", "location-game-set");
				var $gameSetGames = $('<ul>');
				$gameSetGames.attr("class", "location-game-set-games");
				$gameSet.append(gameSet);
					
				for(var game in gameSetsJson[gameSet]) {
					var $game = $('<li class="game">');							
					
					$game.html("<span class='game-title'>"+game+":</span><span class='game-locations'> "+ gameSetsJson[gameSet][game]+"</span>");
					$gameSetGames.append($game);
				}

				$gameSet.append($gameSetGames);
				$gameSets.append($gameSet);
			}

			$wrapper.append($gameSets);
			return $wrapper.html();
		}
	});

	return PokemonView;
});