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
				_setRegularIdFromDBId(element);
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
				_setRegularIdFromDBId(carFromDB);
				resp.send({car: carFromDB});
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
	var carToCreate = req.body.car;
	carDAO.createCar(carToCreate, function(err, createdCar) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			_setRegularIdFromDBId(createdCar);
			resp.send({car: createdCar});
			resp.end();
		}
	});
});

// Update car
router.put('/:carId', function(req, resp) {
	var updatedCar = req.body.car;
	// This should be handled in ember's level, not here
	updatedCar._id = req.params.carId;
	carDAO.updateCar(updatedCar, function(err) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			_setRegularIdFromDBId(updatedCar);
			resp.send({car: updatedCar}).end();
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
			// The status 204 is required in order for ember to not consider the deletion a failure
			// Alternativley, can respond with 200 and and empty object - {}
			resp.status(204).end();
		}
	});
});

// This should be handled in ember's level, not here
function _setRegularIdFromDBId(car) {
	if (car.car) {
		console.log("In car car. Should not happen");
		car.car.id = car.car._id;
	} else {
		car.id = car._id;	
	}
}

module.exports = router;
