var monk = require("monk");
var db = monk('localhost:27017/mydb');

function getAllElementsOfCollection(collectionName, callback) {
	var collection = db.get(collectionName);
	collection.find({}, function(err, allElementsOfCollection) {
		_logMsg(err, "Loaded all " + collectionName, "Failed loading all " + collectionName +". ");
		if (_isFunction(callback)) {
			callback(err, allElementsOfCollection);
		}
	});
}

function getSingleElementOfCollection(collectionName, elementId, callback) {
	var collection = db.get(collectionName);
	collection.find({_id: elementId}, function(err, foundElementsArray) {
		_logMsg(err, "Loaded element with id: " + elementId + " from collection" + collectionName, 
			"Failed loading element with id: " + elementId + " from collection" + collectionName + ". Error ");

		if (_isFunction(callback)) {
			if (foundElementsArray && foundElementsArray.length === 1) {
				callback(err, foundElementsArray[0]);	
				return;
			}
			if (foundElementsArray.length > 1) {
				err = "Found more than one element with id " + elementId + " from collection " + collectionName;
				console.log(err);
				callback(err);
			} else { // if there is no element with the given id
				callback(err);	
			}
		}
	});
}

function createElement(collectionName, elementToCreate, callback) {
	var collection = db.get(collectionName);
	collection.insert(elementToCreate, function (err, createdElement) {
		_logMsg(err, "Created element with id " + createdElement._id + " in collection " + collectionName, 
			"Failed creating " + collectionName + ". Error ");

		if (_isFunction(callback)) {
			callback(err, createdElement);
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