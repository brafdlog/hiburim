var should = require("should");
var donorDAO = require("../DAOs/donorDAO");
var _ = require("underscore");

describe("donorDAO", function() {

	it("should ADD a donor to the db", function(done) {
		var donorToCreate = _createDonorObject();

		donorDAO.createDonor(donorToCreate, function (error, createdDonor) {
			should.not.exist(error);
			should.exist(createdDonor);
			createdDonor.should.eql(donorToCreate);

			donorDAO.deleteDonor(createdDonor._id);

			done();
		});

	});

	it("should create a donor and then LOAD it", function(done) {
		var donorToCreate = _createDonorObject();

		donorDAO.createDonor(donorToCreate, function(error, createdDonor) {
			should.not.exist(error);
			donorDAO.getDonor(createdDonor._id, function(err, foundDonor) {
				should.not.exist(err);	
				should.exist(foundDonor);
				foundDonor.should.eql(createdDonor);

				donorDAO.deleteDonor(createdDonor._id);

				done();
			});
		});

	});

	it("should create two doners and load them by running getAllDonors", function(done) {
		var donorToCreate1 = _createDonorObject();
		var donorToCreate2 = _createDonorObject();

		donorDAO.createDonor(donorToCreate1, function(error, createdDonor1) {
			donorDAO.createDonor(donorToCreate2, function(error, createdDonor2) {
				donorDAO.getAllDonors(function(error, allDonorsArray) {

					should.not.exist(error);
					should.exist(allDonorsArray);

					var firstDonor = _.find(allDonorsArray, function(donor) {
						return donor.name === createdDonor1.name;
					});

					should.exist(firstDonor);

					var secondDonor = _.find(allDonorsArray, function(donor) {
						return donor.name === createdDonor2.name;
					});

					should.exist(secondDonor);

					donorDAO.deleteDonor(createdDonor1._id);
					donorDAO.deleteDonor(createdDonor2._id);
					done();
				});
			});
		});
	});

	it("should create two donors, DELETE one and verify that it (and only it) was deleted", function(done) {
		var donorToCreate1 = _createDonorObject();
		var donorToCreate2 = _createDonorObject();

		donorDAO.createDonor(donorToCreate1, function(error, createdDonor1) {
			donorDAO.createDonor(donorToCreate2, function(error, createdDonor2) {
				should.exist(createdDonor1);
				should.exist(createdDonor1._id);
				should.exist(createdDonor2);
				should.exist(createdDonor2._id);
				donorDAO.deleteDonor(createdDonor1._id, function(error) {
					should.not.exist(error);
					donorDAO.getDonor(createdDonor1._id, function(err, foundDonor1) {
						should.not.exist(err);
						should.not.exist(foundDonor1);
						donorDAO.getDonor(createdDonor2._id, function(err, foundDonor2) {
							should.not.exist(err);
							// This was not yet deleted so it should exist
							should.exist(foundDonor2, "This donor was not deleted yet and should exist in the DB");
							donorDAO.deleteDonor(foundDonor2._id, function(error) {
								done();
							});
						});
					});
				});
			});
		});
	});

it("should call delete with non existing donor Id and verify that not all donors are deleted", function(done) {
	var donorToCreate = _createDonorObject();

	donorDAO.createDonor(donorToCreate, function(error, createdDonor) {
		should.not.exist(error);
		should.exist(createdDonor);
			// Calling delete with a null parameter should be an error and should NOT delete all the donors
			donorDAO.deleteDonor(null, function(error) {
				should.exist(error);
				donorDAO.getDonor(createdDonor._id, function(err, foundDonor) {
					should.not.exist(err);	
					should.exist(foundDonor);

					donorDAO.deleteDonor(createdDonor._id);
					done();
				});
			});
		});
});
});

function _createDonorObject() {
	var randString = Math.random().toString(36).substring(7);
	
	return {
		name: "Moshe " + randString, 
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
}