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

	_handleFailure: function(actionName, failureReason) {
		alert('Failed to ' + actionName + " " + this.get('modelName'));
		console.log('Failed to ' + actionName + " " + this.get('modelName') + ". Reason: " + failureReason);
	},

	_handleSuccess: function(actionName) {
		console.log(actionName + " " + this.get('modelName'));
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
		updateCar: function(car) {
			var that = this;
			car.save().then(function() {
				that._handleSuccess('Updated');
			}, function(failureReason) {
				that._handleFailure('update', failureReason);
			});
			car.set('isBeingEdited', false);
		},
		editCar: function(car) {
			car.set('isBeingEdited', true);
		},
		newCar: function() {
			this.store.createRecord('car', {carType: 'van', isBeingEdited: true});
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
	}
});