App.CarsController = Ember.ArrayController.extend({
	filter: '',

	filteredCars: function() {
		var filter = this.get('filter');
		var regEx = new RegExp(filter, 'gi');
		var cars = this.get('arrangedContent');
		return cars.filter(function(car) {
			return car.get('carType').match(regEx) || car.get('driverName').match(regEx);
		});
	}.property('filter', 'arrangedContent', 'arrangedContent.@each.isDeleted'),
	actions: {
		delete: function(carId) {
			var that = this;
			bootbox.confirm('האם למחוק?', function(userWantsToDelete) {
				if (userWantsToDelete) {
					that.store.find('car', carId).then(function(car) {
						car.deleteRecord();
						car.save();
					});
				}
			});
		},
		sortBy: function(property) {
			this.set('sortProperties', [property]);
			this.set('sortAscending', !this.get('sortAscending'));
		}
	}
});