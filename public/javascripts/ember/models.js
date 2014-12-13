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

App.User = DS.Model.extend({
	email: DS.attr(),
	// Only for creating user, usually ui won't see the password
	password: DS.attr(),
	firstName: DS.attr(),
	lastName: DS.attr(),
	phoneNumber: DS.attr(),
	permissions: DS.attr('raw')
});