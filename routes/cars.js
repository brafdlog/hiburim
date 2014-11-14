var routesCommon = require("./routesCommon");
var carDAO = require("../DAOs/carDAO");
var express = require('express');
var _ = require("underscore");
var router = express.Router();

// Get all cars
router.get('/render', function(req, resp) {	
	carDAO.getAllCars(function(err, allCarsArray) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			// Set flag for handlebars to know which icon to display
			_.each(allCarsArray, function(element, index, list) {
				element.van = element.carType === 'van';
			});

			// Add an empty element so we will have an empty hidden row at the end of the table
			allCarsArray.push({});

			resp.render('cars', {'layout': 'generalLayout', cars: allCarsArray});
		}
	});
});

// Get all cars
router.get('/', function(req, resp) {	
	carDAO.getAllCars(function(err, allCarsArray) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			_.each(allCarsArray, function(element, index, list) {
				element.id = element._id;
			});

			resp.json({cars: allCarsArray});
			resp.end();
		}
	});
});

// Get specific car
router.get('/:carId', function(req, resp) {
	var carId = req.params.carId;
	carDAO.getCar(carId, function(err, carFromDB) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			if (carFromDB) {
				carFromDB.id = carFromDB._id;
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
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send(createdCar);
			resp.end();
		}
	});
});

// Update car
router.put('/:carId', function(req, resp) {
	var updatedCar = req.body;
	carDAO.updateCar(updatedCar, function(err) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send(updatedCar).end();
		}
	});
});

// Delete specific car
router.delete('/:carId', function(req, resp) {
	var carId = req.params.carId;
	carDAO.deleteCar(carId, function(err) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.status(200).end();
		}
	});
});

function _createCarObject(carType, driverName, driverNumber, availableFrom, availableUntil) {
	return {carType: carType, driverName: driverName, driverNumber: driverNumber, availableFrom: availableFrom, availableUntil: availableUntil};
}

module.exports = router;
