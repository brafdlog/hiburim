var monk = require("monk");
var config = require('../config').Config;
var db = monk(config.mongoDbUri);

function getAllElementsOfCollection(collectionName, callback) {
	getElementsOfCollectionByQuery(collectionName, {}, callback);
}

function getElementsOfCollectionByQuery(collectionName, queryObject, callback) {
	var collection = db.get(collectionName);
	collection.find(queryObject, function(err, allElementsOfCollection) {
		_logMsg(err, "Loaded " + collectionName + " by query " + JSON.stringify(queryObject), "Failed loading " + collectionName + " by query " + JSON.stringify(queryObject));
		if (_isFunction(callback)) {
			callback(err, allElementsOfCollection);
		}
	});
}

function getSingleElementOfCollection(collectionName, elementId, callback) {
	var query = {_id: elementId};
	getSingleElementOfCollectionByQuery(collectionName, query, callback);
}

function getSingleElementOfCollectionByQuery(collectionName, queryObject, callback) {
	var collection = db.get(collectionName);
	collection.find(queryObject, function(err, foundElementsArray) {
		_logMsg(err, "Loaded element by query: " + queryObject + " from collection " + collectionName, 
			"Failed loading element by query: " + queryObject + " from collection " + collectionName + ". Error ");

		if (_isFunction(callback)) {
			if (foundElementsArray && foundElementsArray.length === 1) {
				callback(err, foundElementsArray[0]);	
				return;
			}
			if (foundElementsArray.length > 1) {
				err = "Found more than one element for query " + queryObject + " from collection " + collectionName;
				console.log(err);
				callback(err);
			} else { // if there is no element for the given query
				callback(err);	
			}
		}
	});
}

function createElement(collectionName, elementToCreate, callback) {
	var collection = db.get(collectionName);
	var now = new Date();
	elementToCreate.creationDate = now;
	elementToCreate.modificationDate = now;
	collection.insert(elementToCreate, function (err, createdElement) {
		_logMsg(err, "Created element with id " + createdElement._id + " in collection " + collectionName, 
			"Failed creating " + collectionName + ". Error ");

		if (_isFunction(callback)) {
			callback(err, createdElement);
		}
	});
}

function updateElement(collectionName, updatedElement, callback) {
	var collection = db.get(collectionName);
	var now = new Date();
	updatedElement.modificationDate = now;
	collection.updateById(updatedElement._id, updatedElement, function(err) {
		_logMsg(err, "Updated element with id " + updatedElement._id + " from collection " + collectionName, 
			"Failed updating element with id " + updatedElement._id + " from collection " + collectionName);
		if(_isFunction(callback)) {
			callback(err);
		}	
	});
}

function deleteElement(collectionName, elementIdToDelete, callback) {
	var collection = db.get(collectionName);

	getSingleElementOfCollection(collectionName, elementIdToDelete, function(err, elementToDelete) {
		// Need to check this. If elementToDelete is undefined the delete call will delete the whole collection!
		if (!elementToDelete) {
			var errorString = "Failed deleting element with id " + elementIdToDelete + " from collection " + collectionName + 
			". getElement on that id did not return an element";
			console.log(errorString);
			if (!err) {
				err = errorString;
			}
			callback(err);
			return;
		}
		collection.remove(elementToDelete, function (err) {
			_logMsg(err, "Deleted element with id " + elementIdToDelete + " from collection " + collectionName, 
				"Failed deleteing element with id " + elementIdToDelete + " from collection " + collectionName);
			if(_isFunction(callback)) {
				callback(err);
			}				
		});
	});
}

function _isFunction(varToCheck) {
	return (typeof(varToCheck) == "function");
}

function _logMsg(err, successMsg, errorMsg) {
	if (err) {
		console.log(errorMsg + err);
	} else {
		console.log(successMsg);
	}
}

exports.getAllElementsOfCollection = getAllElementsOfCollection;
exports.getSingleElementOfCollection = getSingleElementOfCollection;
exports.createElement = createElement;
exports.deleteElement = deleteElement;
exports.updateElement = updateElement;
exports.getSingleElementOfCollectionByQuery = getSingleElementOfCollectionByQuery;
exports.getElementsOfCollectionByQuery = getElementsOfCollectionByQuery;