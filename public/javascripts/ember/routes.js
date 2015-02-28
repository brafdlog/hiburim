Ember.Route.reopen({
	afterModel: function(model, transition) {
		this._super(model, transition);
		// Hide the spinner if it was displayed
		$.hib.hideSpinner("spinnerDiv");
  }
});

// Defining auth error handling here so it will apply to
// the whole app
App.ApplicationRoute = Ember.Route.extend({
	// Set logged in user
	setupController: function(controller, context) {
		Ember.$.getJSON('/users/current').then(function(loggedInUserJson) {
			if (loggedInUserJson) {
				var loggedInUser = Ember.Object.create(loggedInUserJson);
				controller.set('loggedInUser', loggedInUser);	
			}
		});
	},
	actions: {
		error: function(errorReason, transition) {
			// Hide the spinner if it was displayed
			$.hib.hideSpinner("spinnerDiv");
			
			if (errorReason && errorReason.status == 401) {
				console.log('Authentication error: ' + JSON.stringify(errorReason));
				this.transitionTo('login');
			} else {
				console.log('Error: ' + JSON.stringify(errorReason));
				bootbox.alert("קרתה תקלה. אנא נסו שנית");
				// Bubble this event onwards
				return true;
			}
		},
		loading: function(transition, originRoute) {
			$.hib.displaySpinner("spinnerDiv");
		    // Bubble this event onwards
		    return true;
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
	queryParams: {
		donationStatus: {
			// Refresh model when a transition happens and only query param changes
			refreshModel: true
		}
	},
	model: function(params) {
		var donationStatus = params.donationStatus || 'available';
		return this.store.find('donor', {donationStatus: donationStatus});
	}
});

App.DonorRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('donor', params.donor_id);
	}
});

App.NewDonorRoute = Ember.Route.extend({
	setupController: function(controller, model) {
		var newDonor = controller.store.createRecord('donor', {});
		newDonor.set('item', Ember.Object.create());
		newDonor.set('address', Ember.Object.create());
		controller.set('model', newDonor);
	    
	    // Prepopulate previous donor data (in case same donor donated multiple items)
		var previousDonorId = controller.get('previousDonorId');
		if (previousDonorId) {
			this.store.find('donor', previousDonorId).then(
				function(previousDonor) {
					if (previousDonor) {
						newDonor = controller.get('model');
						newDonor.set('name', previousDonor.get('name'));
						newDonor.set('phoneNumber', previousDonor.get('phoneNumber'));
						newDonor.set('area', previousDonor.get('area'));
						newDonor.set('convenientDates', previousDonor.get('convenientDates'));
						var cloneOfAddress = JSON.parse(JSON.stringify(previousDonor.get('address')));
						newDonor.set('address', cloneOfAddress);
						controller.set('model', newDonor);
					}
				}
				);
		}
    }	
});

App.LoginRoute = Ember.Route.extend({
	setupController: function(controller, context) {
		// reset username and password when going back to login page
		controller.reset();
	}
});

App.UsersRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('user');
	}
});