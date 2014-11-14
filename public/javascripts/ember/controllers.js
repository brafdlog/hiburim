App.CarsController = Ember.ArrayController.extend({
	filter: '',

	filteredCars: function() {
		var filter = this.get('filter');
		var regEx = new RegExp(filter, 'gi');
		var cars = this.get('arrangedContent');
		if (!filter) {
			return cars;
		}
		return cars.filter(function(car) {
			if (car.get('carType')) {
				return car.get('carType').match(regEx);	
			} 
			if (car.get('driverName')) {
				return car.get('driverName').match(regEx);
			}
			return false;
		});
	}.property('filter', 'arrangedContent', 'arrangedContent.@each.isDeleted'),
	actions: {
		newCar: function() {
			this.store.createRecord('car', {carType: 'van'});
		},
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