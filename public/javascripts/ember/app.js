App = Ember.Application.create();

if ($.hibConfig.useRealData) {
	// This should allow using _id instead of id in models
	App.ApplicationSerializer = DS.RESTSerializer.extend({
		primaryKey: '_id',
  		// Default serialization of save doesn't pass in the id in the post body 
  		// so we add it here manually
  		serialize: function(record, options) {
  			options = options ? options : {};
  			options.includeId = true;
    		return this._super.apply(this, [record, options]); // Get default serialization
    	},
    	// This allows defining non persistant model attributes
    	serializeAttribute: function(record, json, key, attribute) {
    		if (attribute.options.transient) {
    			return;
    		}
    		return this._super(record, json, key, attribute);
    	}
    });
} else {
	// This is for using fixtures
	App.ApplicationAdapter = DS.FixtureAdapter;	
}

// This transform allows attributes that are json objects.
// The transform will just leave them as they are
App.RawTransform = DS.Transform.extend({
	deserialize: function(serialized) {
		return serialized;
	},
	serialize: function(deserialized) {
		return deserialized;
	},
});

App.register("transform:raw", App.RawTransform);