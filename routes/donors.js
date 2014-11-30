var routesCommon = require("./routesCommon");
var donorDAO = require("../DAOs/donorDAO");
var express = require('express');
var _ = require("underscore");
var router = express.Router();
var fs = require('fs-extra');
var config = require('../config').Config;

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

// Get all item images
router.get('/:donorId/images', function(req, resp) {
	var donorId = req.params.donorId;
	console.log("Got request to get all item images of donor with id " + donorId);

	var imagesDirectoryAbsolutePath = _buildeItemImagesDirectoryAbsolutePath(donorId);
	fs.readdir(imagesDirectoryAbsolutePath, function(err, files) {
		if (err) {
			routesCommon.handleServerError(resp, err);
		} else {
			var toReturn = files.map(function(fileName){
				var imageRelativePath = _buildItemImageRelativePath(donorId) + fileName;
				return {url: imageRelativePath};
			});
			resp.json(toReturn).end();
		}
	});

});

// Upload item image
router.post('/:donorId/images', function(req, resp) {
	console.log("Got request to upload a donor's item image");
	var donorId = req.params.donorId;

	var relativeUploadPath = _buildItemImageRelativePath(donorId);
	routesCommon.handleFileUpload(req, relativeUploadPath, function(err, newfilePath) {
		if (err) {
			console.error('Failed uploading image. Error:' + err);
			routesCommon.handleServerError(resp, 'Failed uploading image');
		} else {
			console.log('Uploaded donor item image successfully');
			resp.status(200).send(newfilePath).end();
		}
	});
});

// Delete item image
router.delete('/:donorId/images/:imagePathEncoded', function(req, resp) {
	console.log("Got request to upload a donor's item image");
	var donorId = req.params.donorId;
	var imageToDeletePath = req.params.imagePathEncoded;
	// The image path is url encoded, need to decode it
	imageToDeletePath = decodeURIComponent(imageToDeletePath);
	imageToDeletePath = 'public/' + imageToDeletePath;
	
	routesCommon.deleteFile(imageToDeletePath, function(err) {
		if (err) {
			console.error('Failed deleting image. Error:' + err);
			routesCommon.handleServerError(resp, 'Failed deleting image');
		} else {
			resp.status(204).end();
		}
	});
	
});

function _buildItemImageRelativePath(donorId) {
	return 'donors/' + donorId + '/itemImages/';
}

function _buildeItemImagesDirectoryAbsolutePath(donorId) {
	return process.env.PWD + '/' + config.uploadFolderPath + '/' + _buildItemImageRelativePath(donorId);
}

module.exports = router;