App.Router.map(function() {
	this.route('login');
	this.resource('users');
	this.route('createUser', {path: '/users/create'});
	this.resource('cars', function() {
		this.resource('car', {path: ':car_id'});
	});
	this.route('carEmail', {path: '/cars/:car_id/email'});
	this.resource('consumers', function() {
		this.resource('consumer', {path: ':consumer_id'});
	});
	this.resource('donors', function() {
		this.resource('donor', {path: ':donor_id'});
	});
	this.route('donorItemImages', {path: '/donors/:donor_id/images'});
});