App.CarView = Ember.View.extend({
	templateName: 'carRowTemplate',
	tagName: 'tbody',

	doubleClick: function(event) {
		this.get('controller').send('editCar');
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