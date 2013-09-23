define(['backbone'], function(Backbone){
	var Pokemon = Backbone.Model.extend({
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
			console.log(this.toJSON())
			this.save({"caught": this.get('caught')});
		}
	});

	return Pokemon;
});