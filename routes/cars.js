var carDAO = require("../carDAO");
var express = require('express');
var router = express.Router();

// Get all cars
router.get('/', function(req, resp) {	
	carDAO.getAllCars(function(err, allCarsArray) {
		if (err) {
			_handleServerError(resp, err);
		} else {
			resp.render('cars', {'layout': 'generalLayout', cars: allCarsArray});
		}
	});
});

// Get specific car
router.get('/:carId', function(req, resp) {
	var carId = req.params.carId;
	carDAO.getCar(carId, function(err, carFromDB) {
		if (err) {
			_handleServerError(resp, err);
		} else {
			if (carFromDB) {
				resp.send(carFromDB);
			} else {
				resp.send("Car with id " + carId + " was not found");
				resp.end();
			}
		}
	});
});

// Create car
router.post('/', function(req, resp) {
	console.log("Got request to create car");
	var carToCreate = _createCarObject(req.body.carType, req.body.driverName, req.body.driverNumber, req.body.availableFrom, req.body.availableUntil);
	carDAO.createCar(carToCreate, function(err, createdCar) {
		if (err) {
			_handleServerError(resp, err);
		} else {
			resp.send(createdCar);
			resp.end();
		}
	});
});

function _handleServerError(resp, error) {
	console.log("Error:" + error);
	resp.status(500).end(error);
}

function _createCarObject(carType, driverName, driverNumber, availableFrom, availableUntil) {
	return {carType: carType, driverName: driverName, driverNumber: driverNumber, availableFrom: availableFrom, availableUntil: availableUntil};
}

module.exports = router;
