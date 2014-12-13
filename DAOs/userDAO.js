var DAOCommon = require("./DAOCommon");

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
	DAOCommon.createElement("users", userToCreate, callback);
}

function deleteUser(userIdToDelete, callback) {
	DAOCommon.deleteElement("users", userIdToDelete, callback);
}

function updateUser(userObjectToUpdate, callback) {
	// Prevent resetting by mistake the user's password. UI doesn't have the password
	// so if by mitake updating user from UI could delete the user's password
	if (!userObjectToUpdate.password) {
		callback('Tried to update user with empty password!!. Update failed');
	} else {
		DAOCommon.updateElement("users", userObjectToUpdate, callback);	
	}
}

exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getUserByEmail = getUserByEmail;