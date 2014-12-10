var should = require("should");
var userDAO = require("../DAOs/userDAO");
var _ = require("underscore");

describe("userDAO", function() {
	
	it("Should create a new user", function(done) {
		var userToCreate = _buildUserObject();
		var originalPassword = userToCreate.password;

		userDAO.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);

			// Password should be hashed
			createdUser.password.should.not.equal(originalPassword);
			
			userDAO.deleteUserById(createdUser._id, function() {
				done();	
			});
		});
	});

	it("Should delete a user", function(done) {
		var userToCreate = _buildUserObject();

		userDAO.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);
			should.exist(createdUser._id);
			
			userDAO.deleteUserById(createdUser._id, function() {
				userDAO.getUser(createdUser._id, function(err, userFromDB) {
					should.not.exist(err);
					should.not.exist(userFromDB);
					done();
				});
			});
		});
	});

	it("Should find user by username", function(done) {
		var userToCreate = _buildUserObject();

		userDAO.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);

			userDAO.getUserByEmail(userToCreate.email, function(error, userFromDB) {
				should.not.exist(error);
				should.exist(userFromDB);

				userFromDB.email.should.equal(createdUser.email);
				userFromDB.firstName.should.equal(createdUser.firstName);
				userFromDB.lastName.should.equal(createdUser.lastName);
				userFromDB.phoneNumber.should.equal(createdUser.phoneNumber);

				userDAO.deleteUserById(createdUser._id, function() {
					done();
				});
			});
		});
	});

	it("Should find user by id", function(done) {
		var userToCreate = _buildUserObject();

		userDAO.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);

			userDAO.getUser(userToCreate._id, function(error, userFromDB) {
				should.not.exist(error);
				should.exist(userFromDB);

				userFromDB.email.should.equal(createdUser.email);
				userFromDB.firstName.should.equal(createdUser.firstName);
				userFromDB.lastName.should.equal(createdUser.lastName);
				userFromDB.phoneNumber.should.equal(createdUser.phoneNumber);

				userDAO.deleteUserById(createdUser._id, function() {
					done();
				});
			});
		});
	});

	it("Should allow login by user password", function(done) {
		var userToCreate = _buildUserObject();
		var originalPassword = userToCreate.password;
		userDAO.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);

			userDAO.isPasswordCorrect(userToCreate.email, originalPassword, function(err, passwordCorrect) {
				should.not.exist(err);
				passwordCorrect.should.be.true;

				userDAO.deleteUserById(createdUser._id, function() {
					done();
				});
			});
		});
	});

});

function _buildUserObject() {
	var randEmailPrefix = Math.random().toString(36).substring(7);
	var userToCreate = {
		email: randEmailPrefix + '_moshe@dudu.com',
		firstName: 'moshe',
		lastName: 'ufnik',
		phoneNumber: '052-5463213',
		password: '123456'
	};

	return userToCreate;
}