App.CarsView = Ember.View.extend({
	didInsertElement: function() {
		$('.datePicker').pickadate({
			format: $.hib.consts.pickATimeDateFormat // dd-mm-yyyy
		});
		$('.timePicker').pickatime({
			min: [6,0],
			max: [23,0],
			format: $.hib.consts.pickATimeTimeFormat // 23:30 or 9:40
		});
	}
});