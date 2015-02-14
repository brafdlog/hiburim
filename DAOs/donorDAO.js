var DAOCommon = require("./DAOCommon");

function getAllDonors(callback) {
	DAOCommon.getAllElementsOfCollection("donors", callback);
}

function getDonorByDonationStatus(status, callback) {
	if (!status) {
		status = 'available';
	}
	var statusQueryObject = {donationStatus: status};
	
	// Nulls are considered available
	if (status === 'available') {
		var statusNullQuery = { donationStatus: { $exists: false } };
		statusQueryObject = {$or: [statusQueryObject, statusNullQuery]};		
	}

	DAOCommon.getElementsOfCollectionByQuery("donors", statusQueryObject, callback);
}

function getDonor(donorId, callback) {
	DAOCommon.getSingleElementOfCollection("donors", donorId, callback);
}

function createDonor(donorToCreate, callback) {
	DAOCommon.createElement("donors", donorToCreate, callback);
}

function updateDonor(donorObjectToUpdate, callback) {
	DAOCommon.updateElement("donors", donorObjectToUpdate, callback);
}

function deleteDonor(donorIdToDelete, callback) {
	DAOCommon.deleteElement("donors", donorIdToDelete, callback);
}

exports.getAllDonors = getAllDonors;
exports.getDonor = getDonor;
exports.createDonor = createDonor;
exports.deleteDonor = deleteDonor;
exports.updateDonor = updateDonor;
exports.getDonorByDonationStatus = getDonorByDonationStatus;