var monk = require("monk");

var db = monk('localhost:27017/mydb');

function getAllUsers(callback) {
	var userCollection = db.get("users");
	userCollection.find({}, function(err, allUsers) {
		logMsg(err, "Loaded all users", "Failed loading all users. ");
		if (_isFunction(callback)) {
			callback(err, allUsers);
		}
	});
}

function getUser(usrname, callback) {
	var userCollection = db.get("users");
	userCollection.find({username: usrname}, function(err, foundUsersArray) {
		logMsg(err, "Loaded user " + usrname, "Failed loading user " + usrname + ". Error ");
		
		if (_isFunction(callback)) {
			callback(foundUsersArray);
		}
	});
}

function createUser(userToCreate, callback) {
	var userCollection = db.get("users");
	userCollection.insert(userToCreate, function (err, createdUser) {
		logMsg(err, "Created user " + createdUser.username, "Failed creating user. Error ");
		
		if (_isFunction(callback)) {
			callback(err, createdUser);
		}
	});
}

function deleteUser(usernameToDelete, callback) {
	var userCollection = db.get("users");
	userCollection.remove({username: usernameToDelete}, function (err) {
		logMsg(err, "Deleted user " + usernameToDelete, "Failed deleteing user " + usernameToDelete + ". ");
		
		if(_isFunction(callback)) {
			callback(err);
		}
		
	});
}

function _isFunction(varToCheck) {
	return (typeof(varToCheck) == "function");
}

function logMsg(err, successMsg, errorMsg) {
	if (err) {
		console.log(errorMsg + err);
	} else {
		console.log(successMsg);
	}
}

exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.createUser = createUser;
exports.deleteUser = deleteUser;