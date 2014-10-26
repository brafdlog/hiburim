var _ = require("underscore");
var should = require("should");
var carDAO = require("../carDAO");

var carIdsToDelete = [];

describe("carDAO", function() {

	it("should ADD a car to the db", function(done) {
		var carToCreate = _createCarObject();

		carDAO.createCar(carToCreate, function (error, createdCar) {
			should.not.exist(error);
			should.exist(createdCar);
			createdCar.should.eql(carToCreate);

			carDAO.deleteCar(createdCar._id);

			done();
		});

	});

	it("should create a car and then LOAD it", function(done) {
		var carToCreate = _createCarObject();

		carDAO.createCar(carToCreate, function(error, createdCar) {
			should.not.exist(error);
			carDAO.getCar(createdCar._id, function(err, foundCar) {
				should.not.exist(err);	
				should.exist(foundCar);
				foundCar.should.eql(createdCar);

				carDAO.deleteCar(createdCar._id);

				done();
			});
		});

	});

	it("should create two cars and load them by running getAllCars", function(done) {
		var carToCreate1 = _createCarObject();
		var carToCreate2 = _createCarObject();

		carDAO.createCar(carToCreate1, function(error, createdCar1) {
			carDAO.createCar(carToCreate2, function(error, createdCar2) {
				carDAO.getAllCars(function(error, allCarsArray) {

					should.not.exist(error);
					should.exist(allCarsArray);

					var firstCar = _.find(allCarsArray, function(car) {
						return car.driverName === createdCar1.driverName;
					});

					should.exist(firstCar);

					var secondCar = _.find(allCarsArray, function(car) {
						return car.driverName === createdCar2.driverName;
					});

					should.exist(secondCar);

					carDAO.deleteCar(createdCar1._id);
					carDAO.deleteCar(createdCar2._id);
					done();
				});
			});
		});
	});

	it("should create a car and then DELETE it and verify it was deleted", function(done) {
		var carToCreate = _createCarObject();

		carDAO.createCar(carToCreate, function(error, createdCar) {
			carDAO.deleteCar(carToCreate._id, function(error) {
				should.not.exist(error);
				carDAO.getCar(createdCar._id, function(err, foundCar) {
					should.not.exist(err);
					should.not.exist(foundCar);
					done();
				});
			});
		});
	});
});

function _createCarObject() {
	var randDriverName = Math.random().toString(36).substring(7);
	return {carType: "van", driverName: "Moshe " + randDriverName, driverNumber: "052-5776933", availableFrom: 1414312088, availableUntil: 1414326488};
}