App.CarsController = Ember.ObjectController.extend({
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
		}
	}
});