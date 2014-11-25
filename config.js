var development = {
  appAddress: '127.0.0.1:3000',
 ***REMOVED***
  env : global.process.env.NODE_ENV || 'development',

  uiExposedConfig: {
  	// as opposed to fixture data
  	useRealData: true
  }
};

var production = {
  appAddress : 'hiburim.herokuapp.com',
 ***REMOVED***
  env : global.process.env.NODE_ENV || 'production',

  uiExposedConfig: {
  	// as opposed to fixture data
  	useRealData: true
  }
};

exports.Config = global.process.env.NODE_ENV === 'production' ? production : development;