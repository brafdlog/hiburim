App = Ember.Application.create();

// This is for using fictures
// App.ApplicationAdapter = DS.FixtureAdapter;

// This should allow using _id instead of id in models but doesn't work
// App.ApplicationSerializer = DS.RESTSerializer.extend({
//   primaryKey: '_id'
// });