var routesCommon = require("./routesCommon");
var donorDAO = require("../DAOs/donorDAO");
var express = require('express');
var _ = require("underscore");
var router = express.Router();

// Get all donors
router.get('/', function(req, resp) {	
	donorDAO.getAllDonors(function(err, allDonorsArray) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send({donors: allDonorsArray});
			resp.end();
		}
	});
});

// Get specific donor
router.get('/:donorId', function(req, resp) {
	var donorId = req.params.donorId;
	donorDAO.getDonor(donorId, function(err, donorFromDB) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			if (donorFromDB) {
				resp.send({donor: donorFromDB});
			} else {
				resp.send("Donor with id " + donorId + " was not found");
			}
			resp.end();
		}
	});
});

// Create donor
router.post('/', function(req, resp) {
	console.log("Got request to create a donor");
	var donorToCreate = req.body.donor;
	donorDAO.createDonor(donorToCreate, function(err, createdDonor) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send({donor: createdDonor});
			resp.end();
		}
	});
});

// Update donor
router.put('/:donorId', function(req, resp) {
	var updatedDonor = req.body.donor;
	donorDAO.updateDonor(updatedDonor, function(err) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send({donor: updatedDonor}).end();
		}
	});
});

// Delete specific donor
router.delete('/:donorId', function(req, resp) {
	var donorId = req.params.donorId;
	donorDAO.deleteDonor(donorId, function(err) {
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