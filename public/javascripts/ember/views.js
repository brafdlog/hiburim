App.ApplicationView = Ember.View.extend({

	didInsertElement: function() {
		this._super();
		// Make the mobile navigation menu close after selection
		$(document).on('click','.navbar-collapse.in',function(e) {
			if($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
				$(this).collapse('hide');
			}
		});
    }
});

App.DonorItemImagesView = Ember.View.extend({
	imagesForView: function() {
		return this.get('controller.model.item.images');
	}.observes('controller.model.item.images').on('init'),
	didInsertElement: function() {
		this._super();
		var controller = this.get('controller');
		var dropzone =  new Dropzone("#donorItemImageUploadForm", { 
			url: this.get('controller.uploadUrl'),
			maxFilesize: $.hibConfig.maxUploadImageSize, // MB,
			init: function() {
				this.on('success', function(file, fileServerUrl) {
					controller.send('imageAdded', file, fileServerUrl);
				});
			}
		});

		// // remove images from dropzone when they are done
		// dropzone.on("complete", function(file) {
		// 	dropzone.removeFile(file);
		// });

		$('#donor-item-image-carousel').carousel({
			// Don't automatically cycle
			interval: false
		});
    }
});

App.TableRowView = Ember.View.extend({
	tagName: 'tbody',

	doubleClick: function(event) {
		this.get('controller').send('editModel');
	},

	didInsertElement: function() {
		this._super();
		var viewElementId = this.get('elementId');

		// Init date and time pickers in the row if there are any
		var datePickerElements = $('#' + viewElementId + ' .datePicker');
		var timePickerElements = $('#' + viewElementId + ' .timePicker');

		if (datePickerElements.length) {
			datePickerElements.pickadate({
				format: $.hib.consts.pickATimeDateFormat // dd-mm-yyyy
			});
		}
		if (timePickerElements.length) {
			timePickerElements.pickatime({
				min: [6,0],
				max: [23,0],
				format: $.hib.consts.pickATimeTimeFormat // 23:30 or 9:40
			});
		}
	}
});

App.CarView = App.TableRowView.extend({
	templateName: 'carRowTemplate'
});

App.CarEmailView = Ember.View.extend({
	availableFromDateStr: function() {
		var availableFromDateTime = this.get('controller.model.availableFromDateTime');
		return $.hib.toDateStr(availableFromDateTime);
	}.property('controller.model.availableFromDateTime'),
	availableFromTimeStr: function() {
		var availableFromDateTime = this.get('controller.model.availableFromDateTime');
		return $.hib.toTimeStr(availableFromDateTime);
	}.property('controller.model.availableFromDateTime'),
	didInsertElement: function() {
		this._super();
		var carEmailBodyTemplateSource = $("#carEmailBodyTemplate").html();
		var carEmailBodyTemplate = Handlebars.compile(carEmailBodyTemplateSource);
		var carModel = this.get('controller.model');
		var handlebarsContext = {
			availableFromDateStr: this.get('availableFromDateStr'),
			availableFromTimeStr: this.get('availableFromTimeStr'),
			availableDurationInHours: carModel.get('availableDurationInHours'),
			driverName: carModel.get('driverName'),
			driverNumber: carModel.get('driverNumber')
		};
		var emailBodyText = carEmailBodyTemplate(handlebarsContext);
		emailBodyText = emailBodyText.trim();
		this.set('controller.emailBody', emailBodyText);
    }
});

App.PersonWithItemView = App.TableRowView.extend({
	didInsertElement : function(){
		var that = this;
		this._super();
		var tbodyElement = this.get('element');
		var addressInput = $(tbodyElement).find('input.addressInput');
		Ember.run.scheduleOnce('afterRender', this, function(){
			addressInput.geocomplete()
			.bind("geocode:result", function(event, result){
				var lat = result.geometry.location.lat();
				var lon = result.geometry.location.lng();
				var geoCompleteAddress = result.formatted_address;
				that.set('controller.model.address.latitude', lat);
				that.set('controller.model.address.longitude', lon);
				that.set('controller.model.address.geoQueryString', geoCompleteAddress);
			});
		});
	}
});

App.ConsumerView = App.PersonWithItemView.extend({
	templateName: 'consumerRowTemplate',
});

App.NewDonorView = Ember.View.extend({
	didInsertElement : function(){
		var that = this;
		this._super();
		var addressInput = $('#newDonorAddress');
		Ember.run.scheduleOnce('afterRender', this, function(){
			$('.requiredField').off('blur').on('blur', $.hib.runFormValidation);

			addressInput.geocomplete()
			.bind("geocode:result", function(event, result){
				var lat = result.geometry.location.lat();
				var lon = result.geometry.location.lng();
				var geoCompleteAddress = result.formatted_address;
				that.set('controller.model.address.latitude', lat);
				that.set('controller.model.address.longitude', lon);
				that.set('controller.model.address.geoQueryString', geoCompleteAddress);
			});
		});
	}
});

App.UserRowView = App.TableRowView.extend({
	templateName: 'userRowTemplate'
});