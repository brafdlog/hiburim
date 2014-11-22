App = Ember.Application.create();

// This is for using fixtures
App.ApplicationAdapter = DS.FixtureAdapter;

// This should allow using _id instead of id in models
// App.ApplicationSerializer = DS.RESTSerializer.extend({
//   primaryKey: '_id',
//   // Default serialization of save doesn't pass in the id in the post body 
//   // so we add it here manually
//   serialize: function(record, options) {
//     var json = this._super.apply(this, arguments); // Get default serialization
//     json._id = record.id;  // tack on the id
//     return json;
//   }
// });