/*
 To use this controller:
 On init of child controller add the filtered properties you want.
 Make an each statement on the filteredElements.
 Bind an input to filter in order to filter the content.
 Make action that calls sortby with the name of the parameter to sort by.
 */
Ember.SortableAndFilterableController = Ember.ArrayController.extend({
	modelName: '',
	filteredProperties: Ember.A([]),
	filter: '',

	filteredElements: function() {
		var filter = this.get('filter');
		// Regex for contains ignore case
		var regEx = new RegExp(filter, 'gi');
		var elements = this.get('arrangedContent');
		var filteredProperties = this.get('filteredProperties');

		if (!filter || filteredProperties.length === 0) {
			return elements;
		}
		return elements.filter(function(element) {
			for (var i=0; i<filteredProperties.length; i++) {
				var filteredProperty = filteredProperties[i];
				var match = element.get(filteredProperty) && element.get(filteredProperty).match(regEx);
				if (match) {
					return true;
				}
			}
			return false;
		});
	}.property('filter', 'arrangedContent', 'arrangedContent.@each.isDeleted'),

	actions: {
		sortBy: function(property) {
			this.set('sortProperties', [property]);
			this.set('sortAscending', !this.get('sortAscending'));
		},
		createModel: function() {
			this.store.createRecord(this.get('modelName'), {});
		}
	},
});

App.SingleModelController = Ember.ObjectController.extend({
	modelName: '',
	isBeingEdited: false,
	isNotEdited: Ember.computed.not('isBeingEdited'),

	initController: function() {
		var isNew = this.get('model.isNew');
		if (isNew) {
			this.set('isBeingEdited', true);
		}
	}.on('init'),

	actions: {
		updateModel: function(model) {
			var that = this;
			model.save().then(function() {
				that._handleSuccess('Updated');
			}, function(failureReason) {
				that._handleFailure('update', failureReason);
			});
			this.set('isBeingEdited', false);
		},
		editModel: function() {
			this.set('isBeingEdited', true);
		},
		deleteModel: function(model) {
			var that = this;
			bootbox.confirm('האם למחוק?', function(userWantsToDelete) {
				if (userWantsToDelete) {
					model.deleteRecord();
					model.save().then(function() {
						that._handleSuccess('Deleted');
					}, function(failureReason) {
						that._handleFailure('Delete', failureReason);
					});
				}
			});
		}	
	},

	_handleFailure: function(actionName, failureReason) {
		alert('Failed to ' + actionName + " " + this.get('modelName'));
		console.log('Failed to ' + actionName + " " + this.get('modelName') + ". Reason: " + failureReason);
	},
	_handleSuccess: function(actionName) {
		console.log(actionName + " " + this.get('modelName'));
	}
	
});

var carTypeImgUrls = {
	'רכב מסחרי': '/images/van.png',
	'רכב פרטי': '/images/privateCar.png',
	'לא זמין': '/images/notAvailable.jpg'
};

App.CarController = App.SingleModelController.extend({
	// Allows access to the CarsController
	needs: "cars",
	carsController: Ember.computed.alias("controllers.cars"),

	initController: function() {
		this._super();
		this.set('modelName', 'car');

		// Default car type of new car is van
		var isNew = this.get('model.isNew');
		if (isNew) {
			this.set('carType', 'רכב מסחרי');
		}

		var availableFromDateTime = this.get('model.availableFromDateTime');
		if (availableFromDateTime) {
			var availabeFromMoment = moment(availableFromDateTime);
			var dateStr = availabeFromMoment.format($.hib.consts.momentDateFormat);
			this.set('availableFromDateStr', dateStr);
			var timeStr = availabeFromMoment.format($.hib.consts.momentTimeFormat);
			this.set('availableFromTimeStr', timeStr);
		}
	}.on('init'),
		
	availableFromDateStr: "",
	availableFromTimeStr: "",
	
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
	}.observes('availableFromDateStr', 'availableFromTimeStr'),
	updateAvailableUntilDate: function() {
		var fromDate = this.get('availableFromDateTime');
		if (fromDate) {
			var toDate = moment(fromDate);
			var availableDurationInHours = this.get('availableDurationInHours');
			if (availableDurationInHours) {
				toDate.add(availableDurationInHours, 'hours');
			}
			this.set('model.availableUntilDateTime', toDate.toDate());
		}
	}.observes('availableFromDateTime', 'availableDurationInHours'),

	carTypeUrl: function() {
		return carTypeImgUrls[this.get('model.carType')] + '?dim=40x40';
	}.property('model.carType'),
	nextCarType: function() {
		if (this.get('model.carType') === 'רכב מסחרי') {
			return 'רכב פרטי';
		} else if (this.get('model.carType') === 'רכב פרטי') {
			return 'לא זמין';
		} else {
			return 'רכב מסחרי';
		}
	}.property('model.carType'),

	actions: {
		changeCarType: function(car) {
			if(this.get('isBeingEdited')) {
				car.set('carType', this.get('nextCarType'));
			}
		}
	}

});

App.DonorItemImagesController = Ember.ObjectController.extend({
	imagesForView: function() {
		var itemImages = this.get('model.item.images');
		
		if (itemImages && itemImages.length > 0) {
			// Set the first element as active in the carousel
			itemImages.objectAt(0).isActive = true;

			// Set indexes for images. this is also used in the carousel
			for (var i=0; i<itemImages.length; i++) {
				itemImages.objectAt(i).index = i;
			}
		}
		return itemImages;
	}.property('model.item.images'),
	uploadUrl: function() {
		return '/donors/' + this.get('model.id') + '/images';
	}.property('model._id'),
	actions: {
		imageAdded: function(file, fileServerUrl) {
			var donorModel = this.get('model');
			var images = donorModel.get('item.images');
			if (!images) {
				images = [];
			}
			images.addObject({url: fileServerUrl});
			donorModel.set('item.images', images);
			donorModel.save();
		},
		deleteImage: function(imageToDelete) {
			var that = this;
			bootbox.confirm('האם למחוק?', function(userWantsToDelete) {
				if (userWantsToDelete) {
					var donorModel = that.get('model');
					var images = donorModel.get('item.images');
					images.removeObject(imageToDelete);
					donorModel.set('item.images', images);
					donorModel.save();

					var imageUrl = imageToDelete.url;
					var encodedImageUrl = encodeURIComponent(imageUrl);

					var donorId = that.get('model.id');
					$.ajax({
						type: "DELETE",
						url: 'donors/' + donorId + '/images/' + encodedImageUrl,
						contentType: "application/json",
						dataType: 'json',
						success: function() {
							console.log('Deleted image successfully');
						},
						error: function(error) {
							console.log('Failed deleting image. Error ' + JSON.stringify(error));
							alert('failed deleting image');
						}
					});
				}
			});
		}
	}
});
/*
ar availableFromDateTime = this.get('model.availableFromDateTime');
		if (availableFromDateTime) {
			var availabeFromMoment = moment(availableFromDateTime);
			var dateStr = availabeFromMoment.format($.hib.consts.momentDateFormat);
			this.set('availableFromDateStr', dateStr);
			var timeStr = availabeFromMoment.format($.hib.consts.momentTimeFormat);
			this.set('availableFromTimeStr', timeStr);
		}
 */
App.CarEmailController = Ember.ObjectController.extend({
	emailAddress: "",
	actions: {
		sendEmail: function(car) {
			var availableFromDateTime = this.get('model.availableFromDateTime');
			var dateStr, timeStr;
			if (availableFromDateTime) {
				var availabeFromMoment = moment(availableFromDateTime);
				dateStr = availabeFromMoment.format($.hib.consts.momentDateFormat);
				timeStr = availabeFromMoment.format($.hib.consts.momentTimeFormat);
			}

			var postData = {
				emailAddress: this.get('emailAddress'),
				mailParams: {
					mailType: 'sendCar',
					availableFromDate: dateStr,
					availableFromTime: timeStr,
					availableDurationInHours: car.get('availableDurationInHours'),
					driverName: car.get('driverName'),
					driverNumber: car.get('driverNumber')
				}
			}; 
			var controller = this;
			$.ajax({
				type: "POST",
				url: '/api/email',
				data: JSON.stringify(postData),
				contentType: "application/json",
				dataType: 'json',
				success: function() {
					bootbox.alert('המייל נשלח בהצלחה', function() {
						controller.transitionToRoute('cars');	
					});
				},
				error: function(error) {
					console.log('Failed sending email. Error ' + JSON.stringify(error));
					alert('failed sending email');
				}
			});
		}
	}
});

App.CarsController = Ember.SortableAndFilterableController.extend({
	headerText: 'רכבים',
	newModelText: 'רכב חדש',
	hideTableOnMobile: false,
	initController: function() {
		this._super();
		var filteredProperties = this.get('filteredProperties');
		filteredProperties.pushObject('driverName');
		filteredProperties.pushObject('carType');
		this.set('modelName', "car");
	}.on('init')
});

App.ConsumersController = Ember.SortableAndFilterableController.extend({
	headerText: 'פניות',
	newModelText: 'פניה חדשה',
	hideTableOnMobile: false,
	initController: function() {
		this._super();
		var filteredProperties = this.get('filteredProperties');
		filteredProperties.pushObject('name');
		filteredProperties.pushObject('item.category');
		filteredProperties.pushObject('item.description');
		filteredProperties.pushObject('address.geoDisplayString');
		this.set('modelName', "consumer");
	}.on('init')
});

App.DonorsController = Ember.SortableAndFilterableController.extend({
	headerText: 'תרומות',
	newModelText: 'תרומה חדשה',
	hideTableOnMobile: false,
	initController: function() {
		this._super();
		var filteredProperties = this.get('filteredProperties');
		filteredProperties.pushObject('name');
		filteredProperties.pushObject('item.category');
		filteredProperties.pushObject('item.description');
		filteredProperties.pushObject('address.geoDisplayString');
		this.set('modelName', "donor");
	}.on('init')
});

App.SinglePersonWithItemController = App.SingleModelController.extend({
	itemCategories: ['כיסאות', 'מיטה זוגית', 'מיטה זוגית + מזרן', 'מיטת יחיד', 'מיטת יחיד + מזרן', 'ארון בגדים', 'שולחן כתיבה', 'שולחן אוכל', 'שולחן אוכל + כיסאות', 'ספה', 'סלון', 'כיריים חשמליות', 'כיריים גז', 'טלויזיה שטוחה', 'טלויזיה רחבה (לא שטוחה)', 'תנור חימום \\ רדיאטור', 'מאוורר', 'מיקרוגל', 'טוסטר אובן', 'ציוד למטבח', 'שטיח', 'שואב אבק', 'צעצועים וספרים לילדים', 'ציוד לילדים ולתינוקות', 'אחר'],
	mapLinkActive: function() {
		if (this.get('isNotEdited') && this.get('googleMapsUrl')) {
			return true;
		}
		return false;
	}.property('isNotEdited', 'googleMapsUrl'),
	mapLinkNotActive: Ember.computed.not('mapLinkActive'),
	googleMapsUrl: function() {
		if (this.get('model.address') && this.get('model.address.latitude')) {
			return 'http://maps.google.com/?q=' + this.get('model.address.latitude') + ',' + this.get('model.address.longitude');
		}
		return '';
	}.property('model.address'),

	initController: function() {
		this._super();

		// Initialize item and address if it is a new person
		var isNew = this.get('model.isNew');
		if (isNew) {
			this.set('address', {});
			this.set('item', {});
		}

	}.on('init')
});

App.ConsumerController = App.SinglePersonWithItemController.extend({
	initController: function() {
		this._super();
		this.set('modelName', 'consumer');
	}.on('init')
});

App.DonorController = App.SinglePersonWithItemController.extend({
	initController: function() {
		this._super();
		this.set('modelName', 'donor');
	}.on('init')
});