App.Car = DS.Model.extend({
	carType: DS.attr(),
	driverName: DS.attr(),
	driverNumber: DS.attr(), 
	availableFromDateTime: DS.attr('date'),
	availableDurationInHours: DS.attr('number'),
	availableUntilDateTime: DS.attr('date')
});

App.PersonWithItem = DS.Model.extend({
	name: DS.attr(), 
	phoneNumber: DS.attr(),
	convenientDates: DS.attr(),
	item: DS.attr('raw'),
	address: DS.attr('raw')
});

App.Consumer = App.PersonWithItem.extend({
	
});

App.Donor = App.PersonWithItem.extend({

});