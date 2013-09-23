define(['backbone'], function(Backbone){
	var PokemonView = Backbone.View.extend({
		initialize: function() {
			this.fetch()
		},
		defaults: {
			caught:false
		},
		toggleCaught: function() {
			if(!this.get("caught")) {
				this.set({"caught": true});
			} else {
				this.set({"caught": false});						
			}
			this.save();
		}
	});

	return PokemonView;
});