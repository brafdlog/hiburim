var DAOCommon = require("./DAOCommon");
var bcrypt = require('bcrypt');

function getAllUsers(callback) {
	DAOCommon.getAllElementsOfCollection("users", callback);
}

function getUser(userId, callback) {
	DAOCommon.getSingleElementOfCollection("users", userId, callback);
}

function getUserByEmail(email, callback) {
	DAOCommon.getSingleElementOfCollectionByQuery("users", { email: email }, callback);
}

function createUser(userToCreate, callback) {
	bcrypt.genSalt(function(err1, salt) {
		bcrypt.hash(userToCreate.password, salt, function(err2, hashedPassword) {
			if (err1 || err2) {
				callback(err1 || err2);
			} else {
				userToCreate.password = hashedPassword;
				DAOCommon.createElement("users", userToCreate, callback);    
			}
    	});
	});
}

function deleteUserById(userIdToDelete, callback) {
	DAOCommon.deleteElement("users", userIdToDelete, callback);
}

function updateUser(userObjectToUpdate, callback) {
	DAOCommon.updateElement("users", userObjectToUpdate, callback);
}

function isPasswordCorrect(email, passwordToCheck, callback) {
	getUserByEmail(email, function(err, userFromDb) {
		if (err || !userFromDb) {
			callback("Error loading user with email " + email + ". Error is " + err);
		} else {
			bcrypt.compare(passwordToCheck, userFromDb.password, callback);	
		}
	});
}

exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.createUser = createUser;
exports.deleteUserById = deleteUserById;
exports.updateUser = updateUser;
exports.getUserByEmail = getUserByEmail;
exports.isPasswordCorrect = isPasswordCorrect;