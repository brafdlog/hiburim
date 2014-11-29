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

// model hook implemented in super (carRoute)
App.CarEmailRoute = App.CarRoute.extend({
	
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

App.DonorsRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('donor');
	}
});

App.DonorRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('donor', params.donor_id);
	}
});