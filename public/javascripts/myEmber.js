App = Ember.Application.create();

App.Router.map(function() {
	this.resource('cars', function() {
		this.resource('car', {path: ':car_id'});
	});
	this.resource('consumers');
});

App.CarsRoute = Ember.Route.extend({
	model: function() {
		return Ember.$.getJSON('cars/api');
		//return App.Car.findAll();
	}
});

App.CarRoute = Ember.Route.extend({
	model: function(params) {
		return Ember.$.getJSON('cars/' + params.car_id);
		//return App.Car.findById(params.car_id);
	}
});

App.Car = Ember.Object.extend({
	id: function() {
		return this._id;
	}.property('_id')
});

// App.Car.reopenClass({
// 	findAll: function() {
// 		var carsArray = [];
// 		$.getJSON('cars/api').then(function (carsJson) {
// 			_.each(carsJson, function(car) {
// 				var emberCar = App.Car.create(car);
// 				carsArray.pushObject(emberCar);
// 			});
// 		});
// 		return carsArray;
// 	},
// 	findById: function(carId) {
// 		var emberCar;
// 		$.getJSON('cars/' + carId).then(function(car) {
// 			emberCar = App.Car.create(car);
// 		});
// 		return emberCar;
// 	}
// });