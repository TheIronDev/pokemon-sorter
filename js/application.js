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
					//Image Sources: http://pokemondb.net/			
					//$('.menu-3').html("<img src='"+this.model.get("image")+"' />"+this.model.get("name")+" "+this.model.get("locations"));					
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
						$gameSetGames.append($('<li>').html("Black 2: "+ locations.black2));
						$gameSetGames.append($('<li>').html("White 2: "+ locations.white2));
						$gameSetGames.append($('<li>').html("Black: "+ locations.black));
						$gameSetGames.append($('<li>').html("White 2: "+ locations.white));
						
						$gameSet.append($gameSetGames);
						$gameSets.append($gameSet);
					}
					if(locations.platinum !== undefined) {
						var $gameSet = $('<li>');
						$gameSet.attr("class", "location-game-set");
						var $gameSetGames = $('<ul>');
						$gameSetGames.attr("class", "location-game-set-games");

						$gameSet.append("Pokemon Diamond/Pearl/Platinum");
						$gameSetGames.append($('<li>').html("Platinum: "+ locations.platinum));
						$gameSetGames.append($('<li>').html("Diamond: "+ locations.diamond));
						$gameSetGames.append($('<li>').html("Pearl: "+ locations.pearl));
												
						$gameSet.append($gameSetGames);
						$gameSets.append($gameSet);
					}
					if(locations.platinum !== undefined) {
						var $gameSet = $('<li>');
						$gameSet.attr("class", "location-game-set");
						var $gameSetGames = $('<ul>');
						$gameSetGames.attr("class", "location-game-set-games");

						$gameSet.append("Pokemon HeartGold/SoulSilver");
						$gameSetGames.append($('<li>').html("Heart Gold: "+ locations.heartgold));
						$gameSetGames.append($('<li>').html("Soul Silver: "+ locations.soulsilver));
						
												
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
				$('.menu-3').show();
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


