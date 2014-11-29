var development = {
  appAddress: '127.0.0.1:3000',
 ***REMOVED***
  env: global.process.env.NODE_ENV || 'development',

  mailSender: {
    authUsername: 'hiburimmailer@gmail.com',
    authPassword: 'hiburim2014',
    fromUsername: 'hiburimmailer@gmail.com'
  },

  uploadFolderPath: 'public/upload',

  uiExposedConfig: {
  	// as opposed to fixture data
  	useRealData: true,
    maxUploadImageSize: 3, //MB
  }
};

var production = {
  appAddress : 'hiburim.herokuapp.com',
 ***REMOVED***
  env: global.process.env.NODE_ENV || 'production',

  mailSender: {
    authUsername: 'hiburimmailer@gmail.com',
    authPassword: 'hiburim2014',
    fromUsername: 'hiburimmailer@gmail.com'
  },

  uploadFolderPath: 'public/upload',

  uiExposedConfig: {
  	// as opposed to fixture data
  	useRealData: true,
    maxUploadImageSize: 3, //MB
  }
};

exports.Config = global.process.env.NODE_ENV === 'production' ? production : development;