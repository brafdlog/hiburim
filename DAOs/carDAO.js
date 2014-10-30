var DAOCommon = require("./DAOCommon");

function getAllCars(callback) {
	DAOCommon.getAllElementsOfCollection("cars", callback);
}

function getCar(carId, callback) {
	DAOCommon.getSingleElementOfCollection("cars", carId, callback);
}

function createCar(carToCreate, callback) {
	DAOCommon.createElement("cars", carToCreate, callback);
}

function deleteCar(carIdToDelete, callback) {
	DAOCommon.deleteElement("cars", carIdToDelete, callback);
}

exports.getAllCars = getAllCars;
exports.getCar = getCar;
exports.createCar = createCar;
exports.deleteCar = deleteCar;