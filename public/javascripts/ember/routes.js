// Defining auth error handling here so it will appy to
// the whole app
App.ApplicationRoute = Ember.Route.extend({
	actions: {
		error: function(errorReason, transition) {
			if (errorReason && errorReason.status == 401) {
				console.log('Authentication error: ' + JSON.stringify(errorReason));
				this.transitionTo('login');
			} else {
				console.log('Error: ' + JSON.stringify(errorReason));
				// Bubble this event onwards
				return true;
			}
		}
	}
});

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

// model hook implemented in super (donorRoute)
App.DonorItemImagesRoute = Ember.Route.extend({
	
});

App.LoginRoute = Ember.Route.extend({
	setupController: function(controller, context) {
		// reset username and password when going back to login page
		controller.reset();
	}
});