var DAOCommon = require("./DAOCommon");

function getAllConsumers(callback) {
	DAOCommon.getAllElementsOfCollection("consumers", callback);
}

function getConsumer(consumerId, callback) {
	DAOCommon.getSingleElementOfCollection("consumers", consumerId, callback);
}

function createConsumer(consumerToCreate, callback) {
	DAOCommon.createElement("consumers", consumerToCreate, callback);
}

function deleteConsumer(consumerIdToDelete, callback) {
	DAOCommon.deleteElement("consumers", consumerIdToDelete, callback);
}

function updateConsumer(consumerObjectToUpdate, callback) {
	DAOCommon.updateElement("consumers", consumerObjectToUpdate, callback);
}

exports.getAllConsumers = getAllConsumers;
exports.getConsumer = getConsumer;
exports.createConsumer = createConsumer;
exports.deleteConsumer = deleteConsumer;
exports.updateConsumer = updateConsumer;