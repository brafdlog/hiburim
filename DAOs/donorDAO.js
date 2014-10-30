var DAOCommon = require("./DAOCommon");

function getAllDonors(callback) {
	DAOCommon.getAllElementsOfCollection("donors", callback);
}

function getDonor(donorId, callback) {
	DAOCommon.getSingleElementOfCollection("donors", donorId, callback);
}

function createDonor(donorToCreate, callback) {
	DAOCommon.createElement("donors", donorToCreate, callback);
}

function deleteDonor(donorIdToDelete, callback) {
	DAOCommon.deleteElement("donors", donorIdToDelete, callback);
}

exports.getAllDonors = getAllDonors;
exports.getDonor = getDonor;
exports.createDonor = createDonor;
exports.deleteDonor = deleteDonor;