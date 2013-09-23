require.config({
    baseUrl: '/scripts/',
    paths: {
        jquery: 'vendor/jquery/jquery-1.8.2.min',
        backbone: 'vendor/backbone/backbone-min',
        underscore: 'vendor/underscore/underscore-min',
        backboneLocalStorage: 'vendor/backbone-localstorage/backbone-localstorage',
        backboneAnalytics: 'vendor/backbone-analytics/backbone.analytics',
        json2: 'vendor/json2',
        googleAnalytics: 'vendor/googleAnalytics/googleAnalytics'
    },
    shim: {
    	backbone: {
	        deps: ["underscore", "jquery"],
	        exports: "Backbone"
    	},
    	backboneLocalStorage: {
	      deps: ['backbone'],
	      exports: 'BackboneLocalStorage'
	    },
        backboneAnalytics: {
            deps: ['backbone']
        }
    }
});
var router, pageView;
require(['jquery', 'app/Router', 'app/views/PageView', 'googleAnalytics'], function($, Router, PageView, ga){

	$(document).ready(function(){
		router = new Router();
		pageView = new PageView({el: 'body',router: router});		
	});
});
