var LocalStrategy = require('passport-local').Strategy;
var userManager = require('./managers/userManager');

var authStrategy = new LocalStrategy(
  function(userEmail, password, done) {
    userManager.getUserByEmail(userEmail, function (err, user) {
      if (err) { 
        return done(err); 
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      userManager.isPasswordCorrect(userEmail, password, function(error, passCorrect) {
        if (error || !passCorrect) {
          return done(error, false, { message: 'Incorrect password.' });
        }
        // password is correct
        return done(null, user);
      });
    }, {retainPassword: true});
  }
  );

var requireAuth = function(req, res, next){
  // check if the user is logged in
  if(!req.isAuthenticated()){
    req.session.messages = "You need to login to view this page";
    res.status(401);
    res.end();
  } else {
    next();  
  }
};

var serializeUserForSession = function(user, done) {
  done(null, user._id);
};

var deserializeUserFromSession = function(id, done) {
  userManager.getUser(id, function(err, user) {
    done(err, user);
  });
};

exports.authStrategy = authStrategy;
exports.requireAuth = requireAuth;
exports.serializeUserForSession = serializeUserForSession;
exports.deserializeUserFromSession = deserializeUserFromSession;