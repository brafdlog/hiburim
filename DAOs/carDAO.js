var monk = require("monk");
var DAOCommon = require("./DAOCommon");

var db = monk('localhost:27017/mydb');

function getAllCars(callback) {
	var carCollection = db.get("cars");
	carCollection.find({}, function(err, allCars) {
		DAOCommon.logMsg(err, "Loaded all cars", "Failed loading all cars. ");
		if (DAOCommon.isFunction(callback)) {
			callback(err, allCars);
		}
	});
}

function getCar(carId, callback) {
	var carCollection = db.get("cars");
	carCollection.find({_id: carId}, function(err, foundCarsArray) {
		DAOCommon.logMsg(err, "Loaded car " + carId, "Failed loading car " + carId + ". Error ");

		if (DAOCommon.isFunction(callback)) {
			if (foundCarsArray && foundCarsArray.length === 1) {
				callback(err, foundCarsArray[0]);	
				return;
			}
			if (foundCarsArray.length > 1) {
				err = "Found more than one car for id " + carId;
				console.log(err);
				callback(err);
			} else { // if there is no car with the given id
				callback(err);	
			}
		}
	});
}

function createCar(carToCreate, callback) {
	var carCollection = db.get("cars");
	carCollection.insert(carToCreate, function (err, createdCar) {
		DAOCommon.logMsg(err, "Created car " + createdCar._id, "Failed creating car. Error ");

		if (DAOCommon.isFunction(callback)) {
			callback(err, createdCar);
		}
	});
}

function deleteCar(carIdToDelete, callback) {
	var carCollection = db.get("cars");

	getCar(carIdToDelete, function(err, carToDelete) {
		// Need to check this. If carToDelete is undefined the delete call will delete the whole collection!
		if (!carToDelete) {
			var errorString = "Failed deleting car with id " + carIdToDelete + ". Get car on that id did not return a car";
			console.log(errorString);
			if (!err) {
				err = "Failed deleting car with id " + carIdToDelete + ". Get car on that id did not return a car";
			}
			callback(err);
			return;
		}
		carCollection.remove(carToDelete, function (err) {
			DAOCommon.logMsg(err, "Deleted car with id " + carIdToDelete, "Failed deleteing car with id " + carIdToDelete + ". ");
			if(DAOCommon.isFunction(callback)) {
				callback(err);
			}				
		});
	});
}

exports.getAllCars = getAllCars;
exports.getCar = getCar;
exports.createCar = createCar;
exports.deleteCar = deleteCar;