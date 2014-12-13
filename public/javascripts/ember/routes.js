App.AuthenticatedRoute = Ember.Route.extend({
	actions: {
		error: function(errorReason, transition) {
			if (errorReason && errorReason.status == 401) {
				console.log('Authentication error: ' + JSON.stringify(errorReason));
				this.transitionTo('login');
			} else {
				console.log('General error: ' + JSON.stringify(errorReason));
				// Bubble this event onwards
				return true;
			}
		}
	}
});

App.CarsRoute = App.AuthenticatedRoute.extend({
	model: function() {
		return this.store.find('car');
	}
});

App.CarRoute = App.AuthenticatedRoute.extend({
	model: function(params) {
		return this.store.find('car', params.car_id);
	}
});

// model hook implemented in super (carRoute)
App.CarEmailRoute = App.CarRoute.extend({
	
});

App.ConsumersRoute = App.AuthenticatedRoute.extend({
	model: function(params) {
		return this.store.find('consumer');
	}
});

App.ConsumerRoute = App.AuthenticatedRoute.extend({
	model: function(params) {
		return this.store.find('consumer', params.consumer_id);
	}
});

App.DonorsRoute = App.AuthenticatedRoute.extend({
	model: function(params) {
		return this.store.find('donor');
	}
});

App.DonorRoute = App.AuthenticatedRoute.extend({
	model: function(params) {
		return this.store.find('donor', params.donor_id);
	}
});

// model hook implemented in super (donorRoute)
App.DonorItemImagesRoute = App.AuthenticatedRoute.extend({
	
});

App.LoginRoute = Ember.Route.extend({
	setupController: function(controller, context) {
		// reset username and password when going back to login page
		controller.reset();
	}
});