App.Car = DS.Model.extend({
	carType: DS.attr(),
	driverName: DS.attr(),
	driverNumber: DS.attr(), 
	availableFromDateTime: DS.attr('date'),
	availableDurationInHours: DS.attr('number'),
	availableUntilDateTime: DS.attr('date')
});

App.Consumer = DS.Model.extend({
	name: DS.attr(), 
	phoneNumber: DS.attr(),
	convenientDates: DS.attr(),
	item: DS.attr('raw'),
	address: DS.attr('raw')
});