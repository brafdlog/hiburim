App.Router.map(function() {
	this.resource('cars', function() {
		this.resource('car', {path: ':car_id'});
	});
	this.resource('consumers');
});