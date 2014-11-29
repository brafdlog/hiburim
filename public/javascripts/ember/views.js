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
		$("#donorItemImageUploadForm").dropzone({ 
			url: this.get('controller.uploadUrl'),
			maxFilesize: $.hibConfig.maxUploadImageSize, // MB,
			init: function() {
				this.on('success', function(file, fileServerUrl) {
					controller.send('imageAdded', file, fileServerUrl);
				});
			}
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
		$('#' + viewElementId + ' .datePicker').pickadate({
			format: $.hib.consts.pickATimeDateFormat // dd-mm-yyyy
		});
		$('#' + viewElementId + ' .timePicker').pickatime({
			min: [6,0],
			max: [23,0],
			format: $.hib.consts.pickATimeTimeFormat // 23:30 or 9:40
		});
	}
});

App.CarView = App.TableRowView.extend({
	templateName: 'carRowTemplate',
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

App.DonorView = App.PersonWithItemView.extend({
	templateName: 'donorRowTemplate',
});