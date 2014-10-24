var mongo = require("mongodb");
var monk = require("monk");

function getAllUsers(callback) {
	var db = _getDBConnection();
	var userCollection = db.get("users");
	userCollection.find({}, callback);
}

function _getDBConnection() {
	return monk('localhost:27017/mydb');
}

exports.getAllUsers = getAllUsers;