var userDAO = require("../userDAO");
var express = require('express');
var router = express.Router();

// Get all users
router.get('/', function(req, resp) {	
	userDAO.getAllUsers(function(err, allUsersArray) {
		if (err) {
			_handleServerError(resp, err);
		} else {
			resp.render('users', {'layout': 'generalLayout', users: allUsersArray});
		}
	});
});

// Get specific user
router.get('/:username', function(req, resp) {
	var username = req.params.username;
	userDAO.getUser(username, function(err, userFromDb) {
		if (err) {
			_handleServerError(resp, err);
		} else {
			if (userFromDb) {
				resp.render('userDetails', {'layout': 'generalLayout', user: userFromDb});
			} else {
				resp.send("User with username " + username + " was not found");
				resp.end();
			}
		}
	});
});

// Create user
router.post('/', function(req, resp) {
	console.log("Got request to create user");
	var userToCreate = {username: req.body.username, password: req.body.password};
	userDAO.createUser(userToCreate, function(err, createdUser) {
		if (err) {
			_handleServerError(resp, err);
		} else {
			resp.send(createdUser);
			resp.end();
		}
	});
});

function _handleServerError(resp, error) {
	console.log("Error:" + error);
	resp.status(500).end(error);
}

module.exports = router;
