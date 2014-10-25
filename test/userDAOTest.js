var _ = require("underscore");
var should = require("should");
var userDAO = require("../userDAO");

var usernamesToDelete = [];

describe("UserDAO", function() {

	after(function () {
		_.each(usernamesToDelete, function(usernameToDelete) {
			userDAO.deleteUser(usernameToDelete);
		});
		usernamesToDelete = [];
	});

	it("should add a user to the db", function(done) {
		var randUsername = _generateRandomUsername();
		var userToCreate = {username: randUsername, password: '123456'};

		userDAO.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);
			createdUser.should.eql(userToCreate);

			done();
		});

	});

	it("should create a user and get then load it", function(done) {
		var randUsername = _generateRandomUsername();
		var userToCreate = {username: randUsername, password: '123456'};

		userDAO.createUser(userToCreate, function(error, createdUser) {
			userDAO.getUser(randUsername, function(foundUsersArray) {
				should.not.exist(error);
				should.exist(foundUsersArray);
				foundUsersArray.should.have.length(1);
				foundUsersArray[0].should.eql(createdUser);

				done();
			});
		});

	});

	it("should create two users and load them by running getAllUsers", function(done) {
		var randUsername1 = _generateRandomUsername();
		var randUsername2 = _generateRandomUsername();
		var userToCreate1 = {username: randUsername1, password: '123456'};
		var userToCreate2 = {username: randUsername2, password: '123456'};

		userDAO.createUser(userToCreate1, function(error, createdUser) {
			userDAO.createUser(userToCreate2, function(error, createdUser) {
				userDAO.getAllUsers(function(error, allUsersArray) {
					
					should.not.exist(error);
					should.exist(allUsersArray);
					
					var firstUser = _.find(allUsersArray, function(user) {
						return user.username === randUsername1;
					});

					should.exist(firstUser);

					var secondUser = _.find(allUsersArray, function(user) {
						return user.username === randUsername2;
					});

					should.exist(secondUser);

					done();
				});
			});
		});

	});
});

function _generateRandomUsername() {
	var randUsername = Math.random().toString(36).substring(7);
	usernamesToDelete.push(randUsername);
	return randUsername;
}