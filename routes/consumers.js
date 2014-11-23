var routesCommon = require("./routesCommon");
var consumerDAO = require("../DAOs/consumerDAO");
var express = require('express');
var _ = require("underscore");
var router = express.Router();

// Get all consumers
router.get('/', function(req, resp) {	
	consumerDAO.getAllConsumers(function(err, allConsumersArray) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.json({consumers: allConsumersArray});
			resp.end();
		}
	});
});

// Get create consumer form
router.get('/createConsumerForm', function(req, resp) {	
	resp.render('addConsumer', {'layout': 'generalLayout'});
});

// Get specific consumer
router.get('/:consumerId', function(req, resp) {
	var consumerId = req.params.consumerId;
	consumerDAO.getConsumer(consumerId, function(err, consumerFromDB) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			if (consumerFromDB) {
				resp.send({consumer: consumerFromDB});
			} else {
				resp.send("Consumer with id " + consumerId + " was not found");
			}
			resp.end();
		}
	});
});

// Create consumer
router.post('/', function(req, resp) {
	console.log("Got request to create a consumer");
	var consumerToCreate = req.body.consumer;
	consumerDAO.createConsumer(consumerToCreate, function(err, createdConsumer) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send({consumer: createdConsumer});
			resp.end();
		}
	});
});

// Update consumer
router.put('/:consumerId', function(req, resp) {
	var updatedConsumer = req.body.consumer;
	consumerDAO.updateConsumer(updatedConsumer, function(err) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send({consumer: updatedConsumer}).end();
		}
	});
});

// Delete specific consumer
router.delete('/:consumerId', function(req, resp) {
	var consumerId = req.params.consumerId;
	consumerDAO.deleteConsumer(consumerId, function(err) {
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