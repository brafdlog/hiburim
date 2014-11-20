App.Car = DS.Model.extend({
	_id: DS.attr(),
	carType: DS.attr(),
	driverName: DS.attr(),
	driverNumber: DS.attr(), 
	availableFromDateTime: DS.attr('date'),
	availableDurationInHours: DS.attr('number'),
	availableUntilDateTime: DS.attr('date')
});

App.Car.reopenClass({
	FIXTURES: [
		{"_id":"546bad8e505448f20cb353d1","carType":"לא זמין","driverName":"דוד הגשש","driverNumber":"054-8729124","availableFromDateTime":"2014-11-02T07:00:00.000Z","availableDurationInHours":2,"availableUntilDateTime":"2014-11-02T09:00:00.000Z","id":"546bad8e505448f20cb353d1"},
		{"_id":"546c4988beb4c8487856ff27","carType":"רכב מסחרי","driverName":"אל","driverNumber":"04-8963256","availableFromDateTime":"2014-11-03T09:30:00.000Z","availableDurationInHours":9,"availableUntilDateTime":"2014-11-03T18:30:00.000Z","id":"546c4988beb4c8487856ff27"},
		{"_id":"546d1af50f58e515436c9391","carType":"רכב פרטי","driverName":"חיים","driverNumber":"07-893245","availableFromDateTime":"2014-11-11T04:30:00.000Z","availableDurationInHours":6,"availableUntilDateTime":"2014-11-11T10:30:00.000Z","id":"546d1af50f58e515436c9391"},{"_id":"546d1ba47b9e2db243e5836f","carType":"רכב מסחרי","driverName":"מיכל","driverNumber":"052-556234","availableFromDateTime":"2014-11-04T05:00:00.000Z","availableDurationInHours":8,"availableUntilDateTime":"2014-11-04T13:00:00.000Z","id":"546d1ba47b9e2db243e5836f"}
	]
});