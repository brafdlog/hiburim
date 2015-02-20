var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
 	res.redirect("/ember.html#/donors");
});

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect("/ember.html#/cars");
});

router.get('/logout', function logout(req, res){
  if(req.isAuthenticated()){
    req.logout();
  }
  res.redirect('/');
});

module.exports = router;
