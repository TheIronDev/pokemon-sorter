var App = {
	init: function() {
		this.events.init()
	},
	events: {
		init: function(){
			this.backboneExtends();
			this.backboneInstances();
			
			App.variables.session.currentUser = new App.variables.backbone.User();
			this.handlers();
		},
		backboneInstances: function(){
			var pokemonList = App.variables.session.pokemonList = new App.variables.backbone.PokemonList();
			this.populatePokedex();	
		},
		backboneExtends: function(){

			// Not in use yet
			App.variables.backbone.User = Backbone.Model.extend({
				defaults: {
					name: "Trainer",
					game: "Pokemon Black2"
				}
			});

			// Pokemon Object (i.e Bulbasaur)			
			App.variables.backbone.Pokemon = Backbone.Model.extend({
				defaults: {
					caught:false
				},
				toggleCaught: function() {
					if(!this.get("caught")) {
						this.set({"caught": true})
					} else {
						this.set({"caught": false})
					}
				}
			});

			// Collection of Pokemon Objects
			App.variables.backbone.PokemonList = Backbone.Collection.extend({
				model: App.variables.backbone.Pokemon
			});

			// View for individual Pokemon
			App.variables.backbone.PokemonView = Backbone.View.extend({
				initialize: function() {
					this.model.on("change", this.render, this);
					this.model.on("destroy", this.remove, this);
				},
				template: _.template('<div class="pokemon-inner" style="background-position: right <%= thumbnailPosition %>px;">\
					<input type="checkbox" <% if(caught) print("checked=checked") %> /> <%= id %>: <%= name %></div>'),
				pokemonInfoTemplate: _.template('<h3><%= name %></h3><img class="pokemon-image" src="<%= image %>" /><br/><% print(this.printLocations(locations)) %><br/><a href="<%= moreInfo.veekun %>">Veekums\'s Entry</a> '),
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

			// View for List of Pokemon
			App.variables.backbone.PokemonListView = Backbone.View.extend({
				initialize: function(){
					this.collection.on('reset', this.render, this);
				},
				render: function() {					
					this.addAll();				
				},
				addAll: function() {
					this.$el.html("");
					this.collection.forEach(this.addOne, this);
				},
				addOne: function(pokemon) {
					var pokemonView = new App.variables.backbone.PokemonView({model:pokemon});					
					this.$el.append(pokemonView.render().el);
				},
				searchPokemon: function(searchFilter) {
					searchFilter = searchFilter.toLowerCase();
					var sortType = App.variables.session.sortBy;
					this.$el.html("");
					var filteredList = this.collection.filter(function(pokemon){
						var pokemonName = (pokemon.get("name").toLowerCase());
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
											
					filteredList.forEach(this.addOne, this);
				},
				caughtPokemon: function() {
					this.$el.html("");
					var filteredList = this.collection.where({caught: true});
					filteredList.forEach(this.addOne, this);
				},
				missingPokemon: function() {
					this.$el.html("");
					var filteredList = this.collection.where({caught: false});					
					filteredList.forEach(this.addOne, this);	
				}
			});

		},
		handlers: function(){

			// Now that I am using Backbone, having these handlers here are potentially questionable.
			// I'll need to investigate more...
			$('.pokeList').live("click", function(){
				$('.menu-2 .pokemon-list').html(App.events.drawPokedex());
				$('.menu-2').toggle("slide");
				$('.menu-3').toggle("slide");
			});
			$('.searchPokemon').on("keyup", function() {
				var searchTerm = App.variables.session.searchTerm = $(this).val();
				$('.menu-2 .pokemon-list').html(App.events.searchPokemon( searchTerm ) );
			})

			$('.pokemon-sort .sort-option').on("click", function() {
				$('.pokemon-sort .sort-option').removeClass("on");
				var $this = $(this);				
				$this.addClass("on");
				App.variables.session.sortBy = $this.attr("data-sort");
				App.variables.session.pokemonListView.searchPokemon( App.variables.session.searchTerm );
			})
		},
		populatePokedex: function(){
			var pokemonList = App.variables.session.pokemonList;
			$.getJSON('js/pokedex.json', function(result){
				pokemonList.reset(result);
				App.variables.session.pokemonListView = new App.variables.backbone.PokemonListView({collection: pokemonList});
			});
		},
		drawPokedex: function(){
			var pokemonList = App.variables.session.pokemonListView = new App.variables.backbone.PokemonListView({collection: App.variables.session.pokemonList});
			pokemonList.render();
			return pokemonList.el;
		},
		searchPokemon: function(searchName) {
			App.variables.session.pokemonListView.searchPokemon(searchName);
		}
	},
	variables: {		
		session: {
			pokemonList: {},
			currentUser: {},
			pokemonListView: {},
			sortBy: "all",
			searchTerm: ""
		},
		backbone: {
			User: {},		
			Pokemon: {},
			PokemonList: {},
			PokemonListView: {},
			PokemonView: {},
			PokemonListView: {}
		}		
	}
}

$(document).ready(function(){
	App.init();
});


