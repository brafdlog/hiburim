var development = {
  appAddress: '127.0.0.1:3000',
 ***REMOVED***
  env: global.process.env.NODE_ENV || 'development',
  serverProvider: global.process.env.SERVER_PROVIDER,
  serverConfig: getSevrerConfig(serverProvider),
  hostIp: serverConfig.hostIp,
  serverPort: serverConfig.port,

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
  }
};

var production = {
  appAddress : 'hiburim.herokuapp.com',
 ***REMOVED***
  env: global.process.env.NODE_ENV || 'production',
  serverProvider: global.process.env.SERVER_PROVIDER,
  serverConfig: getSevrerConfig(serverProvider),
  hostIp: serverConfig.hostIp,
  serverPort: serverConfig.port,

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

function getSevrerConfig(serverProvider) {
  if (!serverProvider) {
    console.log('Using local server config');
    return local_server_config;
  }
  if (serverProvider === 'heroku') {
    console.log('Using heroku server config');
    return heroku_server_config;
  }
  if (serverProvider === 'openshift') {
    console.log('Using openshift server config');
    return openshift_server_config;
  }
  console.log('Server provider ' + serverProvider + ' does not fit any sevrer config!!');
}

var local_server_config = {
  hostIp: '127.0.0.1',
  port: 3000
};

var heroku_server_config = {
  hostIp: '127.0.0.1',
  port: process.env.PORT
};

var openshift_server_config = {
  hostIp: process.env.OPENSHIFT_NODEJS_IP,
  port: process.env.OPENSHIFT_NODEJS_PORT
};

exports.Config = global.process.env.NODE_ENV === 'production' ? production : development;