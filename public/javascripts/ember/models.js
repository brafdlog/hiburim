var carTypeImgUrls = {
	van: '/images/van.png',
	privateCar: '/images/privateCar.png'
};

App.Car = DS.Model.extend({
	_id: DS.attr(),
	carType: DS.attr(),
	driverName: DS.attr(),
	driverNumber: DS.attr(), 
	availableFromDate: DS.attr('date'),
	availableFromTime: DS.attr(),
	availableDurationInHours: DS.attr('number'),
	
	// The following fields should be part of the car view/controller
	carTypeUrl: function() {
		return carTypeImgUrls[this.get('carType')];
	}.property('carType'),
	nextCarType: function() {
		if (this.get('carType') === 'van') {
			return 'privateCar';
		} else {
			return 'van';
		}
	}.property('carType'),
	isBeingEdited: false,
	isNotEdited: Ember.computed.not('isBeingEdited')
});

App.Car.reopenClass({
	FIXTURES: [
		{"id":"1", "_id":"1","carType":"van","driverName":"שלומית","driverNumber":"02-5867324","availableFromDate":"04-11-2014","availableFromTime":"7:30","availableDurationInHours":"6","van":true},
		{"id":"2", "_id":"2","carType":"car","driverName":"דוד","driverNumber":"054-234145","availableFromDate":"02-11-2014","availableFromTime":"9:15","availableDurationInHours":"2","van":true},
		{"id":"3", "_id":"3","carType":"van","driverName":"חיים","driverNumber":"07-678234","availableFromDate":"23-11-2014","availableFromTime":"17:25","availableDurationInHours":"5","van":true}
	]
});