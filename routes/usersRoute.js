var routesCommon = require("./routesCommon");
var userManager = require("../managers/userManager");
var express = require('express');
var _ = require("underscore");
var router = express.Router();

// Get all users
router.get('/', function(req, resp) {
	userManager.getAllUsers(function(err, allUsersArray) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.json({users: allUsersArray});
			resp.end();
		}
	});
});

// Get specific user
router.get('/:userId', function(req, resp) {
	var userId = req.params.userId;
	userManager.getUser(userId, function(err, userFromDB) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			if (userFromDB) {
				resp.send({user: userFromDB});
			} else {
				resp.send("User with id " + userId + " was not found");
			}
			resp.end();
		}
	});
});

// Create user
router.post('/', function(req, resp) {
	console.log("Got request to create user");
	var userToCreate = req.body.user;
	userManager.createUser(userToCreate, function(err, createdUser) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send({user: createdUser});
			resp.end();
		}
	});
});

// Update user
router.put('/:userId', function(req, resp) {
	var updatedUser = req.body.user;
	userManager.updateUser(updatedUser, function(err) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send({user: updatedUser}).end();
		}
	});
});

// Delete specific user
router.delete('/:userId', function(req, resp) {
	var userId = req.params.userId;

	userManager.deleteUser(userId, function(err) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			// The status 204 is required in order for ember to not consider the deletion a failure
			// Alternativley, can respond with 200 and and empty object - {}
			resp.status(204).end();
		}
	});
});

module.exports = router;