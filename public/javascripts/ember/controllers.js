App.CarsController = Ember.ObjectController.extend({
	actions: {
		delete: function(carId) {
			this.store.find('car', carId).then(function(car) {
				car.deleteRecord();
				car.save();	
			});
		}
	}
});