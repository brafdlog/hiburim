var monk = require("monk");

var db = monk('localhost:27017/mydb');

function getAllUsers(callback) {
	var userCollection = db.get("users");
	userCollection.find({}, callback);
}

function getUser(usrname, callback) {
	var userCollection = db.get("users");
	userCollection.find({username: usrname}, callback);
}

function createUser(userToCreate, callback) {
	console.log("Creating user " + userToCreate);
	var userCollection = db.get("users");
	userCollection.insert(userToCreate, function (err, createdUser) {
		callback(err, createdUser);
	});
}

exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.createUser = createUser;