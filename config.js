var development = {
  appAddress: '127.0.0.1:3000',
 ***REMOVED***
  env: process.env.NODE_ENV || 'development',
  serverProvider: process.env.SERVER_PROVIDER,
  hostIp: getServerConfig(process.env.SERVER_PROVIDER).hostIp,
  serverPort: getServerConfig(process.env.SERVER_PROVIDER).port,

  session: {
   ***REMOVED***
  },

  cookie: {
   ***REMOVED***
  },

  // What permissions a user gets when created
  defaultUserPermissions: {
    access: true
  },

  s3Bucket: 'hiburim-test',

  mailSender: {
    authUsername: 'hiburimmailer@gmail.com',
    authPassword: 'hiburim2014',
    fromUsername: 'hiburimmailer@gmail.com'
  },

  uploadFolderPath: 'public/upload',

  uiExposedConfig: {
  	// as opposed to fixture data
  	useRealData: true,
    maxUploadImageSize: 5, //MB
    // This is not a real id - don't want tracking on development
   ***REMOVED***
  }
};

var production = {
  appAddress : 'hiburim.herokuapp.com',
 ***REMOVED***
  env: process.env.NODE_ENV || 'production',
  serverProvider: process.env.SERVER_PROVIDER,
  hostIp: getServerConfig(process.env.SERVER_PROVIDER).hostIp,
  serverPort: getServerConfig(process.env.SERVER_PROVIDER).port,
  s3Bucket: 'hiburim',

  session: {
   ***REMOVED***
  },

  cookie: {
   ***REMOVED***
  },

  // What permissions a user gets when created
  defaultUserPermissions: {
    access: true
  },

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
   ***REMOVED***
  }
};

function getServerConfig(serverProvider) {
  if (!serverProvider) {
    console.log('Using local server config');
    return {
      hostIp: '127.0.0.1',
      port: 3000
    };
  }
  if (serverProvider === 'heroku') {
    console.log('Using heroku server config');
    return {
      port: process.env.PORT
    };
  }
  if (serverProvider === 'openshift') {
    console.log('Using openshift server config');
    return {
      hostIp: process.env.OPENSHIFT_NODEJS_IP,
      port: process.env.OPENSHIFT_NODEJS_PORT
    };
  }
  console.log('Server provider ' + serverProvider + ' does not fit any sevrer config!!');
}

exports.Config = process.env.NODE_ENV === 'production' ? production : development;