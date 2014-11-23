App.TableRowView = Ember.View.extend({
	tagName: 'tbody',

	doubleClick: function(event) {
		this.get('controller').send('editModel');
	},

	didInsertElement: function() {
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

App.ConsumerView = App.TableRowView.extend({
	templateName: 'consumerRowTemplate',

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