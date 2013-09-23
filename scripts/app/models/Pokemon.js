define(['backbone'], function(Backbone){
	var Pokemon = Backbone.Model.extend({
		initialize: function() {
			// fetch from localStorage
			this.fetch()
		},
		defaults: {
			caught:false
		},
		toggleCaught: function() {
			this.set({"caught": !this.get("caught")});
			this.save();
		}
	});

	return Pokemon;
});