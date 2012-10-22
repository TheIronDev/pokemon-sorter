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
					//Image Sources: http://pokemondb.net/			
					$('.menu-3').html("<img src='"+this.model.get("image")+"' />"+this.model.get("name"));
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

			$('.pokemon-list-item').live("click", function() {
				$('.menu-3').show();
				App.events.drawPokemon($('.menu-3'), $(this).attr("data-pokemon-id"));
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