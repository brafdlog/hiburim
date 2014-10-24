var userDAO = require("../userDAO");
var express = require('express');
var router = express.Router();

// Get all users
router.get('/', function(req, resp) {
	userDAO.getAllUsers(function(err, data) {
		if (err) {
			_handleError(resp, err);
		} else {
			resp.send(data);
			resp.end();
		}
	});
});

// Get specific user
router.get('/:username', function(req, resp) {
	var username = req.params.username;
	userDAO.getUser(username, function(err, data) {
		if (err) {
			_handleError(resp, err);
		} else {
			resp.send(data);
			resp.end();
		}
	});
});

// Create user
router.post('/', function(req, resp) {
	console.log("Got request to create user");
	var userToCreate = {username: req.body.username, password: req.body.password};
	userDAO.createUser(userToCreate, function(err, createdUser) {
		if (err) {
			_handleError(resp, err);
		} else {
			console.log("Created user" + createdUser);
			resp.send(createdUser);
			resp.end();
		}
	});
});

function _handleError(resp, error) {
	console.log("Error:" + error);
	resp.status(500).end(error);
}

module.exports = router;
