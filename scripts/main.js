require.config({
    baseUrl: '/scripts/',
    paths: {
        jquery: 'vendor/jquery/jquery-1.8.2.min',
        backbone: 'vendor/backbone/backbone-min',
        underscore: 'vendor/underscore/underscore-min',
        backboneLocalStorage: 'vendor/backbone-localstorage/backbone-localstorage',
        json2: 'vendor/json2'
    },
    shim: {
    	backbone: {
	        deps: ["underscore", "jquery"],
	        exports: "Backbone"
    	},
    	backboneLocalStorage: {
	      deps: ['backbone'],
	      exports: 'Backbone'
	    }
    }
});

require(['jquery', 'backbone', 'backboneLocalStorage'], function($){
	console.log($);
});
