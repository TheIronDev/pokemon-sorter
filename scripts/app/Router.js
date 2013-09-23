define(['backbone', 'backboneAnalytics'], function(){
	var Router = Backbone.Router.extend({
		initialize: function(options) {
			this.start();
		},
		routes: {
			"": "index",
			"pokedex": "pokedex",
			"pokedex/caught": "caught",
			"pokedex/missing": "missing",
			"about" : "about"
		},
		index: function(){
			this.showPage('page-home');
		},
		about: function() {					
			this.showPage('page-about');			
		},
		pokedex: function() {
			this.togglePokeDexPages('all');			
		},
		caught: function(event) {
			this.togglePokeDexPages('caught');
		},
		missing: function() {
			this.togglePokeDexPages('missing');
		},
		showPage: function(page) {
			_.forEach($('.page'), function(pageItr){
				var $page = $(pageItr);
				if($page.hasClass(page) &&
					!$page.is(':visible')) {
					$page.toggle("slide");
				} else if(!$page.hasClass(page) &&
					$page.is(':visible')) {
					$page.toggle("slide");
				}
			}, this)
		},
		togglePokeDexPages: function(pokePage) {
			this.showPage('page-pokedex');

			$('.pokemon-sort .sort-option').removeClass("on");
			$('.sort-option[data-sort='+pokePage+']').addClass("on");
		},
		start: function() {
			Backbone.history.start({pushState: true});
		}
	});

	return Router;
});