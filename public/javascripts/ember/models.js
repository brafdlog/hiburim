App.Car = DS.Model.extend({
	_id: DS.attr(),
	carType: DS.attr(),
	driverName: DS.attr(),
	driverNumber: DS.attr(), 
	availableFromDateTime: DS.attr('date'),
	availableUntilDateTime: DS.attr('date'),
	availableFromDateStr: DS.attr(),
	availableFromTimeStr: DS.attr(),
	availableDurationInHours: DS.attr('number'),
	
	// The following fields should be part of the car view/controller
	
	updateAvailableFromDateFromStr: function() {
		var dateStr = this.get('availableFromDateStr');
		var timeStr = this.get('availableFromTimeStr');
		if (dateStr) {
			var date = moment(dateStr, $.hib.consts.momentDateFormat);
			if (timeStr) {
				var time = moment(timeStr, $.hib.consts.momentTimeFormat);
				date.hours(time.hours());
				date.minutes(time.minutes());
			}
			this.set('availableFromDateTime', date.toDate());
		}
	}.observes('availableFromDateStr', 'availableFromTimeStr').on('init'),
	updateAvailableUntilDate: function() {
		var fromDate = this.get('availableFromDateTime');
		if (fromDate) {
			var toDate = moment(fromDate);
			var availableDurationInHours = this.get('availableDurationInHours');
			if (availableDurationInHours) {
				toDate.add(availableDurationInHours, 'hours');
			}
			this.set('availableUntilDateTime', toDate.toDate());
		}
	}.observes('availableFromDateTime', 'availableDurationInHours').on('init')
});

App.Car.reopenClass({
	FIXTURES: [
		{"id":"1", "_id":"1","carType":"van","driverName":"שלומית","driverNumber":"02-5867324","availableFromDate":"04-11-2014","availableFromTime":"7:30","availableDurationInHours":"6","van":true},
		{"id":"2", "_id":"2","carType":"car","driverName":"דוד","driverNumber":"054-234145","availableFromDate":"02-11-2014","availableFromTime":"9:15","availableDurationInHours":"2","van":true},
		{"id":"3", "_id":"3","carType":"van","driverName":"חיים","driverNumber":"07-678234","availableFromDate":"23-11-2014","availableFromTime":"17:25","availableDurationInHours":"5","van":true}
	]
});