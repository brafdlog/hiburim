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

		var allElements = this.get('arrangedContent');

		// Don't run filter for just one or two letters
		if (filter.length < 3) {
			return allElements;
		}

		// Regex for contains ignore case
		var regEx = new RegExp(filter, 'gi');
		var filteredProperties = this.get('filteredProperties');

		if (!filter || filteredProperties.length === 0) {
			return allElements;
		}
		return allElements.filter(function(element) {
			for (var i=0; i<filteredProperties.length; i++) {
				var filteredProperty = filteredProperties[i];
				var match = element.get(filteredProperty) && element.get(filteredProperty).match(regEx);
				if (match) {
					return true;
				}
			}
			return false;
		});
	}.property('filter', 'arrangedContent', 'arrangedContent.@each'),

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
	areas: $.hib.areas,
	itemCategories: $.hib.itemCategories,
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

App.CarController = App.SingleModelController.extend({
	// Allows access to the CarsController
	needs: ['cars', 'application'],
	carsController: Ember.computed.alias("controllers.cars"),
	loggedInUser: Ember.computed.alias("controllers.application.loggedInUser"),

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
			var dateStr = $.hib.toDateStr(availableFromDateTime);
			this.set('availableFromDateStr', dateStr);
			var timeStr = $.hib.toTimeStr(availableFromDateTime);
			this.set('availableFromTimeStr', timeStr);
		}
	}.on('init'),
		
	availableFromDateStr: "",
	availableFromTimeStr: "",
	
	updateAvailableFromDateFromStr: function() {
		var dateStr = this.get('availableFromDateStr');
		var timeStr = this.get('availableFromTimeStr');
		var date = $.hib.toDateTime(dateStr, timeStr);
		if (date) {
			this.set('availableFromDateTime', date);
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
		return $.hib.carTypeImgUrls[this.get('model.carType')] + '?dim=40x40';
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
	queryParams: ['isCreation'],
	// If true it means that the user got here from the create donor form
	isCreation: null,
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
		finishAddingImages: function() {
			var that = this;
			bootbox.dialog({
				message: "פרטי התרומה נקלטו בהצלחה",
				title: "תודה!",
				buttons: {
					success: {
						label: "תרומה נוספת",
						className: "btn-success",
						callback: function() {
							var donorId = that.get('model.id');
							// Save the previous donor id to prepopulate the new donor form
							that.transitionTo('newDonor', {queryParams: {previousDonorId: donorId}});
						}
					},
					main: {
						label: "סיום",
						className: "btn-default",
						callback: function() {
							// Go to the hiburim website
							window.location.href = 'http://www.hiburim1.co.il';	
						}
					}
				}
			});
		},
		imageAdded: function(file, fileServerUrl) {
			var donorModel = this.get('model');
			var images = donorModel.get('item.images');
			if (!images) {
				images = [];
			}
			images.addObject({url: fileServerUrl});
			donorModel.set('item.images', images);
			donorModel.save().then(function() {
				console.log('Image uploaded successfully');
			}, function() {
				alert("Failed uploading image");
			});
		},
		deleteImage: function(imageToDelete) {
			var that = this;
			bootbox.confirm('האם למחוק?', function(userWantsToDelete) {
				if (userWantsToDelete) {
					var donorModel = that.get('model');

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
							var images = donorModel.get('item.images');
							images.removeObject(imageToDelete);
							donorModel.set('item.images', images);
							donorModel.save().then(function() {
								console.log('Image removed from model successfully');
							}, function() {
								alert("Failed removing image from model");
							});
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

App.CarEmailController = Ember.ObjectController.extend({
	emailAddress: "",
	emailSubject: "הודעה מחיבורים - רכב פנוי להובלה",
	emailBody: "",
	actions: {
		sendEmail: function(car) {
			if (!this.get('emailAddress')) {
				bootbox.alert('אנא מלאו כתובת מייל');
				return;
			}

			var postData = {
				emailAddress: this.get('emailAddress'),
				emailSubject: this.get('emailSubject'),
				emailBody: this.get('emailBody')
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
					bootbox.alert('failed sending email');
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
		filteredProperties.pushObject('area');
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
		filteredProperties.pushObject('area');
		this.set('modelName', "consumer");
	}.on('init')
});

App.DonorsController = Ember.SortableAndFilterableController.extend({
	sortProperties: ['creationDate'],
  	sortAscending: false,
	queryParams: ['donationStatus'],
	donationStatus: 'זמין',
	headerText: 'תרומות',
	newModelText: 'תרומה חדשה',
	statusTypes: $.hib.donationStatusTypes.hebrew,
	hideTableOnMobile: false,
	initController: function() {
		this._super();
		var filteredProperties = this.get('filteredProperties');
		filteredProperties.pushObject('name');
		filteredProperties.pushObject('item.category');
		filteredProperties.pushObject('item.description');
		filteredProperties.pushObject('address.geoDisplayString');
		filteredProperties.pushObject('area');
		this.set('modelName', "donor");
	}.on('init'),
	actions: {
		// Override the parent implementation to transfer to new donor route
		createModel: function() {
			this.transitionToRoute('newDonor');
		}
	}
});

App.UsersController = Ember.SortableAndFilterableController.extend({
	headerText: 'משתמשים',
	newModelText: 'משתמש חדש',
	hideTableOnMobile: false,
	initController: function() {
		this._super();
		var filteredProperties = this.get('filteredProperties');
		filteredProperties.pushObject('email');
		filteredProperties.pushObject('firstName');
		filteredProperties.pushObject('lastName');
		this.set('modelName', "user");
	}.on('init'),
	actions: {
		// Override the parent implementation to transfer to register route
		createModel: function() {
			this.transitionToRoute('register');
		}
	}
});

App.SinglePersonWithItemController = App.SingleModelController.extend({
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

App.DonorController = Ember.ObjectController.extend({
	itemCategories: $.hib.itemCategories,
	statusTypes: $.hib.donationStatusTypes.hebrew,
	areas: $.hib.areas,
	actions: {
		updateDonor: function(donor) {
			var that = this;
			$.hib.updateModel(donor, 'donor', function() {
				$('#updateDonorOkIcon').show();
				setTimeout(function(){ $('#updateDonorOkIcon').hide(); }, 2000);
				// that.transitionToRoute('donors');
			});
		},
		deleteDonor: function(donor) {
			var that = this;
			$.hib.deleteModel(donor, 'donor', function() {
				that.transitionToRoute('donors');
			});
		}	
	}
});

App.NewDonorController = Ember.Controller.extend({
	queryParams: ['previousDonorId'],
	previousDonorId: null,
	itemCategories: $.hib.itemCategories,
	actions: {
		createDonor: function() {
			var that = this;

			var missingFieldNames = [];

			if (!this.get('model.address.geoDisplayString')) {
				missingFieldNames.push('כתובת');
			}

			if (!this.get('model.name')) {
				missingFieldNames.push('שם');
			}

			if (!this.get('model.phoneNumber')) {
				missingFieldNames.push('טלפון');
			}

			if (!this.get('model.item.description')) {
				missingFieldNames.push('תיאור הפריט');
			}

			if (missingFieldNames && missingFieldNames.length) {
				$.each($('.requiredField'), function(index, inputField) {
					$.hib.runFormValidation.call(inputField);
				});
				alert('נא למלא את הפרטים הבאים: \n' + missingFieldNames.join('\n'));
				return;
			}

			var donorAddress = $('#newDonorAddress').val();
			// Ember doesn't detect the geocomplete autofill so I get it here manually
			this.get('model.address').set('geoDisplayString', donorAddress);
			this.get('model').save().then(
				function() {
					that.transitionToRoute('donorItemImages', that.get('model'), {queryParams: {isCreation: true}});
				},
				function() {
					alert('ארעה תקלה בשמירת פרטי התרומה. אנא נסו שנית');
				}
			);
		}
	}
});

App.UserRowController = App.SingleModelController.extend({
	// Allows access to the CarsController
	needs: "users",
	usersController: Ember.computed.alias("controllers.users"),

	adminHasAccessObserver: function() {
		// An admin always has access to the system
		if (this.get('model.permissions.admin') && !this.get('model.permissions.access')) {
			this.set('model.permissions.access', true);
		}
	}.observes('model.permissions.admin'),

	initController: function() {
		this._super();
		this.set('modelName', 'user');
	}.on('init')
});

App.RegisterController = Ember.Controller.extend({
	initController: function() {
		this._super();
		var newUserModel = this.store.createRecord('user', {});
		this.set('model', newUserModel);
	}.on('init'),
	actions: {
		register: function() {
			var that = this;
			this.get('model').save().then(
				function() {
					bootbox.alert('המשתמש נוצר בהצלחה');
					that.transitionToRoute('cars');
				},
				function() {
					alert('An error occured');
				}
			);
		}
	}
});

App.LoginController = Ember.Controller.extend({
	needs: ['application'],
	reset: function() {
		this.setProperties({
			email: "",
			password: ""
		});
	},
	actions: {
		login: function() {
			var that = this;
			$.ajax({
				type: "POST",
				url: '/login',
				data: $('#loginForm').serialize(),
				success: function(data, status) {
					// Update the logged in user variable on the application controller
					Ember.$.getJSON('/users/current').then(function(loggedInUserJson) {
						if (loggedInUserJson) {
							var loggedInUser = Ember.Object.create(loggedInUserJson);
							that.get('controllers.application').set('loggedInUser', loggedInUser);
						}
					});
					
					that.transitionToRoute('donors');
				},
				error: function(jqXHR, status, errorThrown) {
					bootbox.alert('הפרטים שהוזנו אינם נכונים. אנא נסו שנית');
				}
			});
		}
	}
});