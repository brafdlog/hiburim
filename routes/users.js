var userDAO = require("../userDAO");
var express = require('express');
var router = express.Router();

// Get all users
router.get('/', function(req, res) {
	userDAO.getAllUsers(function(err, data) {
		res.send(data);	
	});
});

module.exports = router;
