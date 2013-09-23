define(['backbone'], function(Backbone){
	var PokemonView = Backbone.View.extend({
		initialize: function() {
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.remove, this);
		},
		template: _.template('<div class="pokemon-inner" >\
			<label><input type="checkbox" <% if(caught) print("checked=checked") %> /> <%= id %>: <%= name %></label><i style="background-position: right <%= thumbnailPosition %>px;">&nbsp;</i></div>'),
		pokemonInfoTemplate: _.template('<h3 class="pokemon-name"><%= name %></h3><img class="pokemon-image" src="<%= image %>" /><br/><% print(this.printLocations(locations)) %><br/><a href="<%= moreInfo.veekun %>">Veekuns\'s Entry</a> '),
		tagName: "div",
		className: "pokemon", 
		render: function() {
			var attributes = this.model.toJSON();
			this.$el.html(this.template(attributes));
			return this;
		},
		remove: function() {
			var pokemonView = this;
			this.$el.fadeOut(500, function(){
				pokemonView.$el.remove();	
			});					
		},
		events: {
			"click .pokemon-inner": "toggleCaught",
			"mouseover .pokemon-inner": "displayPokemonInfo"
		},
		toggleCaught: function() {
			var pokeSort = App.variables.session.sortBy;
			this.model.toggleCaught();
			if(pokeSort != "all") {
				this.remove();
			}
		},
		displayPokemonInfo: function() {
			var attributes = this.model.toJSON();										
			$('.menu-3').html(this.pokemonInfoTemplate(attributes));					


			$('.menu-3').css({"top": scrollY+10})
		},
		printLocations: function(locations) {
			var $wrapper = $('<div>');
			$wrapper.append("<h4>Locations</h4>");
			var $gameSets = $('<ul>');
			$gameSets.attr("class", "location-game-sets");

			// Formatting JSON used to store the display layer
			var gameSetsJson = {
				"Pokemon Black/White": {
					"Black 2": locations.black2,
					"White 2": locations.white2,
					"Black": locations.black,
					"White": locations.white							
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