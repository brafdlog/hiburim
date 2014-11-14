App.CarsRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('car');
		//return Ember.$.getJSON('cars');
	}
});

App.CarRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('car', params.car_id);
		// return Ember.$.getJSON('cars/' + params.car_id);
	}
});