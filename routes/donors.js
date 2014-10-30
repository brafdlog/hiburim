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
			resp.send(allDonorsArray);
			resp.end();
			//resp.render('donors', {'layout': 'generalLayout', donors: allDonorsArray});
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
				resp.send(donorFromDB);
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
	var donorToCreate = _createDonorObject(req.body.name, req.body.phoneNumber, req.body.convenientDates, req.body.itemDetails, req.body.addressDetails);
	donorDAO.createDonor(donorToCreate, function(err, createdDonor) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			resp.send(createdDonor);
			resp.end();
		}
	});
});

function _createDonorObject(name, phoneNumber, convenientDates, itemDetails, addressDetails) {
	return {name: name, phoneNumber: phoneNumber, convenientDates: convenientDates, item: itemDetails, address: addressDetails};
}

module.exports = router;


/*
	Donor object:
	 {
		name: "Moshe " + randDriverName, 
		phoneNumber: "057-456732",
		convenientDates: [456345634564],
		item: {
			category: "ארון",
			color: "כחול",
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