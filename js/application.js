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
				pokemonInfoTemplate: _.template('<h3><%= name %></h3><img class="pokemon-image" src="<%= image %>" /><br/><% print(this.printLocations(locations)) %>'),
				tagName: "div",
				className: "pokemon", 
				render: function() {
					var attributes = this.model.toJSON();					
					this.$el.html(this.template(attributes));
					return this;
				},
				remove: function() {
					this.$el.remove();
				},
				events: {
					"click .pokemon-inner": "toggleCaught",
					"hover .pokemon-inner": "displayPokemonInfo"
				},
				toggleCaught: function() {
					this.model.toggleCaught();
				},
				displayPokemonInfo: function() {
					var attributes = this.model.toJSON();					
					$('.menu-3').html(this.pokemonInfoTemplate(attributes));
				},
				printLocations: function(locations) {
					var $wrapper = $('<div>');
					var $gameSets = $('<ul>');
					$gameSets.attr("class", "location-game-sets")

					// This code is not very dry, and should be refactored
					if(locations.black2 !== undefined) {
						var $gameSet = $('<li>');
						$gameSet.attr("class", "location-game-set");
						var $gameSetGames = $('<ul>');
						$gameSetGames.attr("class", "location-game-set-games");

						$gameSet.append("Pokemon Black/White");
						$gameSetGames.append($('<li class="game">').html("<span class='game-title'>Black 2:</span><span class='game-locations'> "+ locations.black2+"</span>"));
						$gameSetGames.append($('<li class="game even">').html("<span class='game-title'>White 2:</span><span class='game-locations'> "+ locations.white2+"</span>"));
						$gameSetGames.append($('<li class="game">').html("<span class='game-title'>Black:</span><span class='game-locations'> "+ locations.black+"</span>"));
						$gameSetGames.append($('<li class="game even">').html("<span class='game-title'>White:</span><span class='game-locations'> "+ locations.white+"</span>"));
						
						$gameSet.append($gameSetGames);
						$gameSets.append($gameSet);
					}
					if(locations.platinum !== undefined) {
						var $gameSet = $('<li>');
						$gameSet.attr("class", "location-game-set");
						var $gameSetGames = $('<ul>');
						$gameSetGames.attr("class", "location-game-set-games");

						$gameSet.append("Pokemon Diamond/Pearl/Platinum");
						$gameSetGames.append($('<li class="game">').html("<span class='game-title'>Platinum:</span><span class='game-locations'> "+ locations.platinum+"</span>"));
						$gameSetGames.append($('<li class="game even">').html("<span class='game-title'>Diamond:</span><span class='game-locations'> "+ locations.diamond+"</span>"));
						$gameSetGames.append($('<li class="game">').html("<span class='game-title'>Pearl:</span><span class='game-locations'> "+ locations.pearl+"</span>"));
												
						$gameSet.append($gameSetGames);
						$gameSets.append($gameSet);
					}
					if(locations.platinum !== undefined) {
						var $gameSet = $('<li>');
						$gameSet.attr("class", "location-game-set");
						var $gameSetGames = $('<ul>');
						$gameSetGames.attr("class", "location-game-set-games");

						$gameSet.append("Pokemon HeartGold/SoulSilver");
						$gameSetGames.append($('<li class="game">').html("<span class='game-title'>Heart Gold:</span><span class='game-locations'> "+ locations.heartgold+"</span>"));
						$gameSetGames.append($('<li class="game even">').html("<span class='game-title'>Soul Silver:</span><span class='game-locations'> "+ locations.soulsilver+"</span>"));
						
												
						$gameSet.append($gameSetGames);
						$gameSets.append($gameSet);
					}
					
					$wrapper.append("<h4>Locations</h4>");
					$wrapper.append($gameSets);
					return $wrapper.html();
				}
			});

			// View for List of Pokemon
			App.variables.backbone.PokemonListView = Backbone.View.extend({
				initialize: function(){
					this.collection.on('add', this.addOne, this);
					this.collection.on('reset', this.addAll, this);
				},
				className: "pokemon-list",
				render: function() {
					this.addAll();
				},
				addAll: function() {
					this.collection.forEach(this.addOne, this);
				},
				addOne: function(pokemon) {
					var pokemonView = new App.variables.backbone.PokemonView({model:pokemon});
					this.$el.append(pokemonView.render().el);
				}
			});

		},
		handlers: function(){
			$('.pokeList').live("click", function(){
				$('.menu-2').html(App.events.drawPokedex());
				$('.menu-2').toggle("slide");
				$('.menu-3').toggle("slide");
			});
			
		},
		populatePokedex: function(){
			var pokemonList = App.variables.session.pokemonList;
			$.getJSON('js/pokedex.json', function(result){
				pokemonList.reset(result);
				App.variables.session.pokemonListView = new App.variables.backbone.PokemonListView({collection: pokemonList});
			});
		},
		drawPokedex: function(){
			var pokemonList = new App.variables.backbone.PokemonListView({collection: App.variables.session.pokemonList});
			pokemonList.render();
			return pokemonList.el;
		},

	},
	variables: {		
		session: {
			pokemonList: {},
			currentUser: {},
			pokemonListView: {},
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


