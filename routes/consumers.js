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
			resp.send(allConsumersArray);
			resp.end();
			//resp.render('consumers', {'layout': 'generalLayout', consumers: allConsumersArray});
		}
	});
});

// Get all consumers
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
				resp.send(consumerFromDB);
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
	var consumerToCreate = req.body;
	consumerDAO.createConsumer(consumerToCreate, function(err, createdConsumer) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send(createdConsumer);
			resp.end();
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
			resp.status(200).end();
		}
	});
});

module.exports = router;

/*
	Consumer object:
	 {
		name: "Moshe ", 
		phoneNumber: "057-456732",
		convenientDates: [456345634564],
		item: {
			category: "ארון",
			requiresDismanteling: true,
			description: "זה ארון מאוד יפה"
		},
		address: {
			geoQueryString: "Even Shmuel 33, Jerusalem, Israel",
			geoDisplayString: "אבן שמואל 33, ירושלים",
			latitude: "4536364.534",
			longitude: "645645645.3423",
			floor: "3",
			flatNumber: "7",
			hasElavator: false,
			hasParking: true,
			description: "מקום יפה"
		}
	};

 */