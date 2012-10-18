var App = {
	init: function() {
		this.events.init()
	},
	events: {
		init: function(){
			this.populatePokedex();
		},
		populatePokedex: function(){
			//https://raw.github.com/gist/1994205/84b771ac55d05d566f098030a48786c31cadb62d/pokedex.js
			$.getJSON('/pokedex.json', function(result){
				App.variables.Pokedex = new App.variables.Pokemon(result);
			});
		},
		draw: function(){
			var pokemonList = new App.variables.PokedexView({model: App.variables.Pokedex});			
			pokemonList.render();
			$('body').html(pokemonList.el);
		}
	},
	variables: {
		Pokemon: Backbone.Model.extend({}),
		Pokedex: {},
		PokedexView: Backbone.View.extend({
			render: function() {
				var html = "<ul>";
				console.log(this.model.attributes);
				for(var i=0;i<649;i++) {
					html = html+ ("<li>"+this.model.attributes[i].name+"</li>");
				}
				html = html+ "</ul>";
				console.log(html)
				$(this.el).html(html);
			}
		})
	}
}

$(document).ready(function(){
	App.init();
});