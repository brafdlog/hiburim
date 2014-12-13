var should = require("should");
var userManager = require('../managers/userManager');
var _ = require("underscore");

describe("userManager", function() {
	
	it("Should hash password when creating new user", function(done) {
		var userToCreate = _buildUserObject();
		var originalPassword = userToCreate.password;

		userManager.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);

			// Password should be hashed
			createdUser.password.should.not.equal(originalPassword);
			
			userManager.deleteUser(createdUser._id, function() {
				done();	
			});
		});
	});

	it("Should delete a user", function(done) {
		var userToCreate = _buildUserObject();

		userManager.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);
			should.exist(createdUser._id);
			
			userManager.deleteUser(createdUser._id, function() {
				userManager.getUser(createdUser._id, function(err, userFromDB) {
					should.not.exist(err);
					should.not.exist(userFromDB);
					done();
				});
			});
		});
	});

	it("Should not delete superadmins", function(done) {
		userManager.getUserByEmail("brafdlog@gmail.com", function(error, superAdminUserFromDb) {
			should.not.exist(error);
			should.exist(superAdminUserFromDb);
			superAdminUserFromDb.permissions.superadmin.should.be.true;

			userManager.deleteUser(superAdminUserFromDb._id, function(err) {
				should.exist(err);

				userManager.getUser(superAdminUserFromDb._id, function(err, userFromDB) {
					should.not.exist(err);
					should.exist(userFromDB);
					done();
				});
			});
		});
	});

	it("Should not return passwords when getting all users", function(done) {
		var userToCreate = _buildUserObject();

		userManager.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);

			userManager.getAllUsers(function(error, allUsersArray) {
				should.not.exist(error);
				should.exist(allUsersArray);
				allUsersArray.should.not.be.empty;

				allUsersArray.forEach(function (user) {
					should.not.exist(user.password);
				});

				userManager.deleteUser(createdUser._id, function() {
					done();
				});
			});
		});
	});

	it("Should not return password when finding user by username", function(done) {
		var userToCreate = _buildUserObject();

		userManager.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);

			userManager.getUserByEmail(userToCreate.email, function(error, userFromDB) {
				should.not.exist(error);
				should.exist(userFromDB);

				should.not.exist(userFromDB.password);

				userManager.deleteUser(createdUser._id, function() {
					done();
				});
			});
		});
	});

	it("Should return password when explicitly given retain password option", function(done) {
		var userToCreate = _buildUserObject();

		userManager.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);

			userManager.getUserByEmail(userToCreate.email, function(error, userFromDB) {
				should.not.exist(error);
				should.exist(userFromDB);

				should.exist(userFromDB.password);

				userManager.deleteUser(createdUser._id, function() {
					done();
				});
			}, {retainPassword: true});
		});
	});

	it("Should not return password when finding user by id", function(done) {
		var userToCreate = _buildUserObject();

		userManager.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);

			userManager.getUser(userToCreate._id, function(error, userFromDB) {
				should.not.exist(error);
				should.exist(userFromDB);

				should.not.exist(userFromDB.password);

				userManager.deleteUser(createdUser._id, function() {
					done();
				});
			});
		});
	});

	it("Should allow login by user password", function(done) {
		var userToCreate = _buildUserObject();
		var originalPassword = userToCreate.password;
		userManager.createUser(userToCreate, function (error, createdUser) {
			should.not.exist(error);
			should.exist(createdUser);

			userManager.isPasswordCorrect(userToCreate.email, originalPassword, function(err, passwordCorrect) {
				should.not.exist(err);
				passwordCorrect.should.be.true;

				userManager.deleteUser(createdUser._id, function() {
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
		password: '123456',
		permissions: {
			manageUsers: true,
			access: true
		}
	};

	return userToCreate;
}