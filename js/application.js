var App = {
	init: function() {
		this.events.init()
	},
	events: {
		init: function(){
			this.populatePokedex();
			App.variables.session.currentUser = new App.variables.backbone.User();
			this.handlers();
		},
		handlers: function(){
			$('.pokeList').on("click", function(){
				App.events.drawPokeDex($('.menu-2'));
			});
			$('.pokemonCheck').live("click", function(){
				console.log($('.pokemonCheck:checked'))
			});
			$('.pokemon-list-item').live("click", function() {
				$('.menu-3').show();
				App.events.drawPokemon($('.menu-3'), $(this).attr("data-pokemon-id"));
			});			
		},
		populatePokedex: function(){			
			//https://raw.github.com/gist/1994205/84b771ac55d05d566f098030a48786c31cadb62d/pokedex.js
			$.getJSON('js/pokedex.json', function(result){
				for(var i = 0; i<result.length;i++) {
					var tempPokemon = new App.variables.backbone.Pokemon(result[i])
					App.variables.session.pokedex.push(tempPokemon);
				}				
			});
		},
		drawPokeDex: function(element){
			var pokemonList = new App.variables.backbone.PokedexView({model: App.variables.session.pokedex});			
			pokemonList.render();
			element.html(pokemonList.el);
		},
		drawPokemon: function(element, pokemonId) {
			var pokemon = new App.variables.backbone.PokemonView({model: App.variables.session.pokedex[pokemonId]});
			pokemon.render();
			element.html(pokemon.el);
		}
	},
	variables: {		
		session: {
			pokedex: new Array(),
			currentUser: {},
		},
		backbone: {
			User: Backbone.Model.extend({
				defaults: {
					name: "Trainer",
					game: "Pokemon Black2",
					pokedex: {

					}
				}
			}),		
			Pokemon: Backbone.Model.extend({}),
			PokedexView: Backbone.View.extend({
				render: function() {
					var html = "<ul class='pokemon-list'>";
					for(var i=0;i<649;i++) {
						html = html+ ("<li class='pokemon-list-item' style='background-position:right "+
							(i*32*-1)+"px' data-pokemon-id='"+i+"'><input class='pokemonCheck' type='checkbox' name='pokemon' value='"+
							this.model[i].get("dec")+"' data-pokemon='"+this.model[i].get("name")+"' />"+this.model[i].get("name")+"</li>");
					}
					html = html+ "</ul>";
					$(this.el).html(html);
				}
			}),
			PokemonView: Backbone.View.extend({
				render: function() {
					var html = $('<div>');
					html.append(this.model.get("dec")+": "+this.model.get("name"));
					$(this.el).html(html.html());
				}
			})
		}		
	}
}

$(document).ready(function(){
	App.init();
});