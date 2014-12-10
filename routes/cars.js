var routesCommon = require("./routesCommon");
var carDAO = require("../DAOs/carDAO");
var express = require('express');
var _ = require("underscore");
var router = express.Router();

// Get all cars
router.get('/', function(req, resp) {
	if (req.session.marf) {
		console.log("!!!!!!!!!!!!!!!!!1Session: " + req.session.marf);
		req.session.marf = req.session.marf+1;
	} else {
		req.session.marf = 1;
	}
	carDAO.getAllCars(function(err, allCarsArray) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
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
				resp.send({car: carFromDB});
			} else {
				resp.send("Car with id " + carId + " was not found");
			}
			resp.end();
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
			resp.send({car: createdCar});
			resp.end();
		}
	});
});

// Update car
router.put('/:carId', function(req, resp) {
	var updatedCar = req.body.car;
	carDAO.updateCar(updatedCar, function(err) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
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

module.exports = router;
