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
	templateName: 'consumerRowTemplate'
});