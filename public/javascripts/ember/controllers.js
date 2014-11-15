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
			var carTypeMatch = car.get('carType') && car.get('carType').match(regEx);
			var driverNameMatch = car.get('driverName') && car.get('driverName').match(regEx);
			return carTypeMatch || driverNameMatch;
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