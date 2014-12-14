App.Router.map(function() {
	this.route('login');
	this.resource('users');
	this.route('register');
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

// Add google analytics tracking on page change
App.Router.reopen({
  notifyGoogleAnalytics: function() {
    return ga('send', 'pageview', {
        'page': this.get('url'),
        'title': this.get('url')
      });
  }.on('didTransition')
});