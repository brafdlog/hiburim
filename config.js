var development = {
  appAddress: '127.0.0.1:3000',
 ***REMOVED***
  env : global.process.env.NODE_ENV || 'development'
};

var production = {
  appAddress : 'hiburim.herokuapp.com',
 ***REMOVED***
  env : global.process.env.NODE_ENV || 'production'
};

exports.Config = global.process.env.NODE_ENV === 'production' ? production : development;