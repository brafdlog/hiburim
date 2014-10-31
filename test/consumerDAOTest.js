var should = require("should");
var consumerDAO = require("../DAOs/consumerDAO");
var _ = require("underscore");

describe("consumerDAO", function() {

	it("should ADD a consumer to the db", function(done) {
		var consumerToCreate = _createConsumerObject();

		consumerDAO.createConsumer(consumerToCreate, function (error, createdConsumer) {
			should.not.exist(error);
			should.exist(createdConsumer);
			createdConsumer.should.eql(consumerToCreate);

			consumerDAO.deleteConsumer(createdConsumer._id);

			done();
		});

	});

	it("should create a consumer and then LOAD it", function(done) {
		var consumerToCreate = _createConsumerObject();

		consumerDAO.createConsumer(consumerToCreate, function(error, createdConsumer) {
			should.not.exist(error);
			consumerDAO.getConsumer(createdConsumer._id, function(err, foundConsumer) {
				should.not.exist(err);	
				should.exist(foundConsumer);
				foundConsumer.should.eql(createdConsumer);

				consumerDAO.deleteConsumer(createdConsumer._id);

				done();
			});
		});

	});

	it("should create two consumers and load them by running getAllConsumers", function(done) {
		var consumerToCreate1 = _createConsumerObject();
		var consumerToCreate2 = _createConsumerObject();

		consumerDAO.createConsumer(consumerToCreate1, function(error, createdConsumer1) {
			consumerDAO.createConsumer(consumerToCreate2, function(error, createdConsumer2) {
				consumerDAO.getAllConsumers(function(error, allConsumersArray) {

					should.not.exist(error);
					should.exist(allConsumersArray);

					var firstConsumer = _.find(allConsumersArray, function(consumer) {
						return consumer.name === createdConsumer1.name;
					});

					should.exist(firstConsumer);

					var secondConsumer = _.find(allConsumersArray, function(consumer) {
						return consumer.name === createdConsumer2.name;
					});

					should.exist(secondConsumer);

					consumerDAO.deleteConsumer(createdConsumer1._id);
					consumerDAO.deleteConsumer(createdConsumer2._id);
					done();
				});
			});
		});
	});

	it("should create two consumers, DELETE one and verify that it (and only it) was deleted", function(done) {
		var consumerToCreate1 = _createConsumerObject();
		var consumerToCreate2 = _createConsumerObject();

		consumerDAO.createConsumer(consumerToCreate1, function(error, createdConsumer1) {
			consumerDAO.createConsumer(consumerToCreate2, function(error, createdConsumer2) {
				should.exist(createdConsumer1);
				should.exist(createdConsumer1._id);
				should.exist(createdConsumer2);
				should.exist(createdConsumer2._id);
				consumerDAO.deleteConsumer(createdConsumer1._id, function(error) {
					should.not.exist(error);
					consumerDAO.getConsumer(createdConsumer1._id, function(err, foundConsumer1) {
						should.not.exist(err);
						should.not.exist(foundConsumer1);
						consumerDAO.getConsumer(createdConsumer2._id, function(err, foundConsumer2) {
							should.not.exist(err);
							// This was not yet deleted so it should exist
							should.exist(foundConsumer2, "This consumer was not deleted yet and should exist in the DB");
							consumerDAO.deleteConsumer(foundConsumer2._id, function(error) {
								done();
							});
						});
					});
				});
			});
		});
	});

it("should call delete with non existing consumer Id and verify that not all consumers are deleted", function(done) {
	var consumerToCreate = _createConsumerObject();

	consumerDAO.createConsumer(consumerToCreate, function(error, createdConsumer) {
		should.not.exist(error);
		should.exist(createdConsumer);
			// Calling delete with a null parameter should be an error and should NOT delete all the consumers
			consumerDAO.deleteConsumer(null, function(error) {
				should.exist(error);
				consumerDAO.getConsumer(createdConsumer._id, function(err, foundConsumer) {
					should.not.exist(err);	
					should.exist(foundConsumer);

					consumerDAO.deleteConsumer(createdConsumer._id);
					done();
				});
			});
		});
});
});

function _createConsumerObject() {
	var randString = Math.random().toString(36).substring(7);
	
	return {
		name: "Moshe " + randString, 
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
}