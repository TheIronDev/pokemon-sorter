define(['backbone'], function(){
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
		showPage: function(page) {
			_.forEach($('.page'), function(pageItr){
				var $page = $(pageItr);
				if($page.hasClass(page)) {
					$page.show();
				} else {
					$page.hide();
				}
			}, this)
		},
		index: function(){
			this.showPage('page-home');
		},
		about: function() {					

			if($('.page-home').is(':visible')) {
				$('.page-home').toggle("slide");
			}					
			if(!$('.page-about').is(':visible')) {
				$('.page-about').toggle("slide");
			}
		},
		pokedex: function() {
			
			if($('.page-home').is(':visible')) {
				$('.page-home').toggle("slide");						
			}
			if(!$('.page-pokedex').is(':visible')) {
				$('.page-pokedex').toggle("slide");
				$('.page-pokemon').toggle("slide");
			}
			if($('.page-about').is(':visible')) {
				$('.page-about').toggle("slide");						
			}

			$('.pokemon-sort .sort-option').removeClass("on");
			$('.sort-option[data-sort=all]').addClass("on");
			
		},
		caught: function() {
			
		},
		missing: function() {					
			
		},
		start: function() {
			Backbone.history.start({pushState: true});
		}
	});

	return Router;
});