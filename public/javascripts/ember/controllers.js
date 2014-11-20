/*
 To use this controller:
 On init of child controller add the filtered properties you want.
 Make an each statement on the filteredElements.
 Bind an input to filter to filter the content.
 Make action that calls sortby with the name of the parameter to sort by.
 */
 Ember.SortableAndFilterableController = Ember.ArrayController.extend({
 	modelName: '',
 	filteredProperties: Ember.A([]),
 	filter: '',

 	filteredElements: function() {
 		var filter = this.get('filter');
		// Regex for contains ignore case
		var regEx = new RegExp(filter, 'gi');
		var elements = this.get('arrangedContent');
		var filteredProperties = this.get('filteredProperties');

		if (!filter || filteredProperties.length === 0) {
			return elements;
		}
		return elements.filter(function(element) {
			for (var i=0; i<filteredProperties.length; i++) {
				var filteredProperty = filteredProperties[i];
				var match = element.get(filteredProperty) && element.get(filteredProperty).match(regEx);
				if (match) {
					return true;
				}
			}
			return false;
		});
	}.property('filter', 'arrangedContent', 'arrangedContent.@each.isDeleted'),

	actions: {
		sortBy: function(property) {
			this.set('sortProperties', [property]);
			this.set('sortAscending', !this.get('sortAscending'));
		}
	},
});

 var carTypeImgUrls = {
 	van: '/images/van.png',
 	privateCar: '/images/privateCar.png',
 	notAvailable: '/images/notAvailable.jpg'
 };

 App.CarController = Ember.ObjectController.extend({
	// Allows access to the CarsController
	needs: "cars",
	carsController: Ember.computed.alias("controllers.cars"),

	initController: function() {
		var isCarNew = this.get('model.isNew');
		if (isCarNew) {
			this.set('isBeingEdited', true);
		}

		var availableFromDateTime = this.get('model.availableFromDateTime');
		if (availableFromDateTime) {
			var availabeFromMoment = moment(availableFromDateTime);
			var dateStr = availabeFromMoment.format($.hib.consts.momentDateFormat);
			this.set('availableFromDateStr', dateStr);
			var timeStr = availabeFromMoment.format($.hib.consts.momentTimeFormat);
			this.set('availableFromTimeStr', timeStr);
		}
	}.on('init'),

	isBeingEdited: false,
	isNotEdited: Ember.computed.not('isBeingEdited'),
	availableFromDateStr: "",
	availableFromTimeStr: "",
	
	updateAvailableFromDateFromStr: function() {
		var dateStr = this.get('availableFromDateStr');
		var timeStr = this.get('availableFromTimeStr');
		if (dateStr) {
			var date = moment(dateStr, $.hib.consts.momentDateFormat);
			if (timeStr) {
				var time = moment(timeStr, $.hib.consts.momentTimeFormat);
				date.hours(time.hours());
				date.minutes(time.minutes());
			}
			this.set('availableFromDateTime', date.toDate());
		}
	}.observes('availableFromDateStr', 'availableFromTimeStr'),
	updateAvailableUntilDate: function() {
		var fromDate = this.get('availableFromDateTime');
		if (fromDate) {
			var toDate = moment(fromDate);
			var availableDurationInHours = this.get('availableDurationInHours');
			if (availableDurationInHours) {
				toDate.add(availableDurationInHours, 'hours');
			}
			this.set('model.availableUntilDateTime', toDate.toDate());
		}
	}.observes('availableFromDateTime', 'availableDurationInHours'),

	carTypeUrl: function() {
		return carTypeImgUrls[this.get('model.carType')];
	}.property('model.carType'),
	nextCarType: function() {
		if (this.get('model.carType') === 'van') {
			return 'privateCar';
		} else if (this.get('model.carType') === 'privateCar') {
			return 'notAvailable';
		} else {
			return 'van';
		}
	}.property('model.carType'),

	actions: {
		changeCarType: function(car) {
			if(this.get('isBeingEdited')) {
				car.set('carType', this.get('nextCarType'));
			}
		},
		updateCar: function(car) {
			var that = this;
			car.save().then(function() {
				that._handleSuccess('Updated');
			}, function(failureReason) {
				that._handleFailure('update', failureReason);
			});
			this.set('isBeingEdited', false);
		},
		editCar: function() {
			this.set('isBeingEdited', true);
		},
		delete: function(car) {
			var that = this;
			bootbox.confirm('האם למחוק?', function(userWantsToDelete) {
				if (userWantsToDelete) {
					car.deleteRecord();
					car.save().then(function() {
						that._handleSuccess('Deleted');
					}, function(failureReason) {
						that._handleFailure('Delete', failureReason);
					});
				}
			});
		}
	},
	_handleFailure: function(actionName, failureReason) {
		alert('Failed to ' + actionName + " car");
		console.log('Failed to ' + actionName + " car. Reason: " + failureReason);
	},
	_handleSuccess: function(actionName) {
		console.log(actionName + " car");
	}
});

App.CarsController = Ember.SortableAndFilterableController.extend({
	
	initController: function() {
		var filteredProperties = this.get('filteredProperties');
		filteredProperties.pushObject('driverName');
		filteredProperties.pushObject('carType');
		this.set('modelName', "car");
	}.on('init'),
	actions: {
		newCar: function() {
			this.store.createRecord('car', {carType: 'van'});
		}
	}

});