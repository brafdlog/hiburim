App.CarsRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('car');
	}
});

App.CarRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('car', params.car_id);
	}
});

App.ConsumersRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('consumer');
	}
});

App.ConsumerRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('consumer', params.consumer_id);
	}
});