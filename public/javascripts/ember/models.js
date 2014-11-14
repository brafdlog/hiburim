App.Car = DS.Model.extend({
	_id: DS.attr(),
	carType: DS.attr(),
	driverName: DS.attr(),
	driverNumber: DS.attr(), 
	availableFromDate: DS.attr('date'),
	availableFromTime: DS.attr(),
	availableDurationInHours: DS.attr('number'),
	van: DS.attr('boolean')
});

App.Car.reopenClass({
	FIXTURES: [
		{"id":"1", "_id":"1","carType":"van","driverName":"שלומית","driverNumber":"02-5867324","availableFromDate":"04-11-2014","availableFromTime":"7:30","availableDurationInHours":"6","van":true},
		{"id":"2", "_id":"2","carType":"van","driverName":"דוד","driverNumber":"054-234145","availableFromDate":"02-11-2014","availableFromTime":"9:15","availableDurationInHours":"2","van":true},
		{"id":"3", "_id":"3","carType":"van","driverName":"חיים","driverNumber":"07-678234","availableFromDate":"23-11-2014","availableFromTime":"17:25","availableDurationInHours":"5","van":true}
	]
});