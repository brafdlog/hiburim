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
		{"_id":"546bad8e505448f20cb353d1","carType":"לא זמין","driverName":"דוד","driverNumber":"054-8729124","availableFromDateTime":"2014-11-02T07:00:00.000Z","availableDurationInHours":2,"availableUntilDateTime":"2014-11-02T09:00:00.000Z","id":"546bad8e505448f20cb353d1"},
		{"_id":"546c4988beb4c8487856ff27","carType":"רכב מסחרי","driverName":"אל","driverNumber":"04-8963256","availableFromDateTime":"2014-11-03T09:30:00.000Z","availableDurationInHours":9,"availableUntilDateTime":"2014-11-03T18:30:00.000Z","id":"546c4988beb4c8487856ff27"},
		{"_id":"546d1af50f58e515436c9391","carType":"רכב פרטי","driverName":"חיים","driverNumber":"07-893245","availableFromDateTime":"2014-11-11T04:30:00.000Z","availableDurationInHours":6,"availableUntilDateTime":"2014-11-11T10:30:00.000Z","id":"546d1af50f58e515436c9391"},
		{"_id":"546d1ba47b9e2db243e5836f","carType":"רכב מסחרי","driverName":"מיכל","driverNumber":"052-556234","availableFromDateTime":"2014-11-04T05:00:00.000Z","availableDurationInHours":8,"availableUntilDateTime":"2014-11-04T13:00:00.000Z","id":"546d1ba47b9e2db243e5836f"}
	]
});

App.Consumer = DS.Model.extend({
	_id: DS.attr(),
	name: DS.attr(), 
	phoneNumber: DS.attr(),
	convenientDates: DS.attr(),
	item: {
		category: DS.attr(),
		requiresDismanteling: DS.attr('boolean'),
		description: DS.attr()
	},
	address: {
		geoQueryString: DS.attr(),
		geoDisplayString: DS.attr(),
		latitude: DS.attr(),
		longitude: DS.attr(),
		floor: DS.attr('number'),
		flatNumber: DS.attr('number'),
		hasElavator: DS.attr('boolean'),
		hasParking: DS.attr('boolean'),
		description: DS.attr()
	}
});

App.Consumer.reopenClass({
	FIXTURES: [
	{
		_id: 1,
		name: 'משה', 
		phoneNumber: '02-56835213',
		convenientDates: '2/4/14, 5/6/14',
		item: {
			category: 'ארון',
			requiresDismanteling: true,
			description: 'זה ארון מאוד יפה'
		},
		address: {
			geoQueryString: "Dubnov 10, Tel Aviv",
			geoDisplayString: 'דובנוב 10 תל אביב',
			latitude: "4536364.534",
			longitude: "645645645.3423",
			floor: 2,
			flatNumber: 1,
			hasElavator: true,
			hasParking: false,
			description: 'כתובת מאוד מעניינת'
		}
	},
	{
		_id: 2,
		name: 'חיים', 
		phoneNumber: "057-456732",
		convenientDates: '6/3/14, 9/5/14',
		item: {
			category: "שידה",
			requiresDismanteling: false,
			description: "וואי וואי איזה שידה"
		},
		address: {
			geoQueryString: "Even Shmuel 33, Jerusalem, Israel",
			geoDisplayString: "אבן שמואל 33, ירושלים",
			latitude: "4536364.534",
			longitude: "645645645.3423",
			floor: "3",
			flatNumber: "7",
			hasElavator: false,
			hasParking: true,
			description: "מקום יפה"
		}
	}
	]
});
