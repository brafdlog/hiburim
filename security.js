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

var requireAccessPermission = function(req, res, next){
  if (_userHasPermission(req, "access")) {
      next();
  } else {
    res.status(401);
    res.end();
  }
};

var requireAdminPermission = function(req, res, next){
  if (_userHasPermission(req, "admin")) {
    next();
  } else {
    res.status(401);
    res.end();
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

function _userHasPermission(request, permissionToCheck) {
  // If isn't logged in has no permissions
  if (!request.isAuthenticated()) {
    return false;
  }
  return request.user.permissions[permissionToCheck];
}

exports.authStrategy = authStrategy;
exports.requireAccessPermission = requireAccessPermission;
exports.requireAdminPermission = requireAdminPermission;
exports.serializeUserForSession = serializeUserForSession;
exports.deserializeUserFromSession = deserializeUserFromSession;