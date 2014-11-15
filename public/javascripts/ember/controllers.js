/*
 To use this controller:
 On init of child controller add the filtered properties you want.
 Make an each statement on the filteredElements.
 Bind an input to filter to filter the content.
 Make action that calls sortby with the name of the parameter to sort by.
 */
Ember.SortableAndFilterableController = Ember.ArrayController.extend({
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
	}
});

App.CarsController = Ember.SortableAndFilterableController.extend({
	
	initFilteredProperties: function() {
		var filteredProperties = this.get('filteredProperties');
		filteredProperties.pushObject('driverName');
		filteredProperties.pushObject('carType');
	}.on('init'),

	actions: {
		updateCar: function(car) {
			car.save();
			car.set('isBeingEdited', false);
		},
		editCar: function(car) {
			car.set('isBeingEdited', true);
		},
		newCar: function() {
			this.store.createRecord('car', {carType: 'van', isBeingEdited: true});
		},
		delete: function(car) {
			bootbox.confirm('האם למחוק?', function(userWantsToDelete) {
				if (userWantsToDelete) {
					car.deleteRecord();
					car.save();
				}
			});
		}
	}
});