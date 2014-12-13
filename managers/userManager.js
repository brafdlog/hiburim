var userDAO = require("../DAOs/userDAO");
var DAOCommon = require("../DAOs/DAOCommon");
var bcrypt = require('bcrypt');

function getAllUsers(callback) {
	// Delete the passwords from the user objects
	userDAO.getAllUsers(function (err, allUsersArray) {
		if (err) {
			callback(err);
		} else {
			allUsersArray.forEach(function(user) {
				// Don't return password to the client!!
				delete user.password;
			});
			callback(err, allUsersArray);
		}
	});
}

function getUser(userId, callback) {
	// Delete the password from the user object
	userDAO.getUser(userId, function(err, userFromDb) {
		if (err) {
			callback(err);
		} else {
			if (userFromDb) {
				// Don't return password to the client!!
				delete userFromDb.password;
			}
			callback(err, userFromDb);
		}
	});
}

function getUserByEmail(email, callback, options) {
	// Delete the password from the user object unless options.retainPassword is true
	userDAO.getUserByEmail(email, function(err, userFromDb) {
		if (err) {
			callback(err);
		} else {
			var shouldDeletePassword = !(options && options.retainPassword);
			if (userFromDb && shouldDeletePassword) {
				// Don't return password to the client!!
				delete userFromDb.password;
			}
			callback(err, userFromDb);
		}
	});
}

function createUser(userToCreate, callback) {
	// Hash the user's password before saving user to db
	bcrypt.genSalt(function(err1, salt) {
		bcrypt.hash(userToCreate.password, salt, function(err2, hashedPassword) {
			if (err1 || err2) {
				callback(err1 || err2);
			} else {
				userToCreate.password = hashedPassword;
				userDAO.createUser(userToCreate, callback);
			}
    	});
	});
}

function deleteUser(userIdToDelete, callback) {
	// Don't allow deleting super admins
	getUser(userIdToDelete, function(err, userFromDb) {
		if (err) {
			callback(err);
		} else if (!userFromDb) {
			callback("Failed deleting user with id " + userIdToDelete + ". Didn't find user in DB");
		} else {
			if (userFromDb.permissions.superadmin) {
				callback("Can't delete superadmin users");
			} else {
				userDAO.deleteUser(userIdToDelete, callback);			
			}
		}
	});
}

function updateUser(userObjectToUpdate, callback) {
	// Don't update password to empty and 
	// Don't allow updating permissions of super admin
	getUserByEmail(userObjectToUpdate.email, function(err, userFromDb) {
		if (err || !userFromDb) {
			callback(err);
		} else {
			// UI doesn't have access to password. Don't want update to delete the existing
			// hashed password
			userObjectToUpdate.password = userFromDb.password;

			// don't let client update superadmin's permissions
			if (userFromDb.permissions && userFromDb.permissions.superadmin) {
				userObjectToUpdate.permissions = userFromDb.permissions;
			}

			userDAO.updateUser(userObjectToUpdate, callback);
		}
	}, {retainPassword: true});
}

function isPasswordCorrect(email, passwordToCheck, callback) {
	getUserByEmail(email, function(err, userFromDb) {
		if (err || !userFromDb) {
			callback("Error loading user with email " + email + ". Error is " + err);
		} else {
			bcrypt.compare(passwordToCheck, userFromDb.password, callback);	
		}
	}, {retainPassword: true});
}

exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getUserByEmail = getUserByEmail;
exports.isPasswordCorrect = isPasswordCorrect;