$.hib = {};

$.hib.consts = {
	pickATimeDateFormat: "dd-mm-yyyy",
	pickATimeTimeFormat: "H:i",
	momentDateFormat: "DD-MM-YYYY",
	momentTimeFormat: "H:mm"
};

$.hib.post = function(url, data, success, error) {
	$.ajax({
		type: "POST",
		url: url,
		data: JSON.stringify(data),
		success: success,
		error: error,
		contentType: 'application/json;charset=UTF-8',
		dataType: 'json'
	});
};

$.hib.put = function(url, data, success, error) {
	$.ajax({
		type: "PUT",
		url: url,
		data: JSON.stringify(data),
		success: success,
		error: error,
		contentType: 'application/json;charset=UTF-8'
	});
};

$.hib.carTypeImgUrls = {
	'רכב מסחרי': '/images/van.png',
	'רכב פרטי': '/images/privateCar.png',
	'לא זמין': '/images/notAvailable.jpg'
};

// String ends with
$.hib.strEndsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

$.hib.strStartsWith = function(str, prefix) {
    return(str.indexOf(prefix) === 0);
};

$.hib.generateRandomNumber = function(upperLimit) {
	if (!upperLimit) {
		upperLimit = 10000000;
	}
	return Math.random() * upperLimit;
};

/*
	Makes the table editable if:
		1. The table has the following classes in the right places:  
			nonEditable
			finishedEditingIcon
			deleteIcon
			editIcon
			nonHeaderTableRow
		2. Each table row has the id of the element it represents
		3. Has a td that has the three icons for delete, edit and approve changes

	The two last parameters are functions for additional actions to run on rowEditable or rowNonEditable events
	*/
	$.hib.makeTableRowsEditable = function(modelName, buildObjectToUpdateFunc, makeRowEditableAdditionalActions, makeRowNonEditableAdditionalActions) {
		$('.finishedEditingIcon').hide();

		$('.deleteIcon').off('click').on('click', function() {
			var parentRowElement = $(this).closest('tr');
			bootbox.confirm('האם למחוק?', function(userWantsToDelete) {
				if (userWantsToDelete) {
					var objectToDeleteId = parentRowElement.attr('id');

					// If this element is not yet saved in the DB, just remove the row in UI.
					if (!objectToDeleteId) {
						parentRowElement.remove();
						return;
					}

					$.ajax({
					// e.g /consumers/72
					url: '/' + modelName + 's/' + objectToDeleteId,
					type: 'DELETE',
					success: function(result) {
						console.log("Deleted " + modelName + " with id " + objectToDeleteId);
						parentRowElement.remove();
					},
					error: function() {
						bootbox.alert("Failed deleting " + modelName);
					}
				});
				}
			});
		});

		$('.editIcon').off('click').on('click', function() {
			var editIconElement = $(this);
			var deleteIconElement = editIconElement.siblings('.deleteIcon');
			var finishedEditingIconElement = editIconElement.siblings('.finishedEditingIcon');

			editIconElement.hide();
			deleteIconElement.hide();
			finishedEditingIconElement.show();

			var parentRowElement = editIconElement.closest('tr');
			_makeRowEditable(parentRowElement);

		});

		$('.finishedEditingIcon').off('click').on('click', function() {
			var finishedEditingIconElement = $(this);
			var deleteIconElement = finishedEditingIconElement.siblings('.deleteIcon');
			var editIconElement = finishedEditingIconElement.siblings('.editIcon');

			finishedEditingIconElement.hide();
			deleteIconElement.show();
			editIconElement.show();

			var parentRowElement = finishedEditingIconElement.closest('tr');
			_makeRowNotEditable(parentRowElement);

			// Update server
			if (buildObjectToUpdateFunc) {
				var objectToUpdate = buildObjectToUpdateFunc(parentRowElement);
				if (!objectToUpdate) {
					return;
				}

				var objectToUpdateId = parentRowElement.attr('id');
				var url = '/' + modelName + 's';
				var success, error;
				
				// If object has id update, otherwise create
				if (objectToUpdateId) {
					url = url + '/' + objectToUpdateId;

					success = function() {
						console.log("Updated " + modelName + " with id " + objectToUpdateId);
						parentRowElement.removeClass('italicText');
					};
					error = function() {
						alert('failed updating ' + modelName + " with id " + objectToUpdateId);
					};

					parentRowElement.addClass('.italicText');
					$.hib.put(url, objectToUpdate, success, error);	
				} else {
					success = function(createdElement) {
						console.log("Created " + modelName);
						parentRowElement.removeClass('italicText');
						parentRowElement.attr('id', createdElement._id);
					};
					error = function() {
						alert('Failed creating ' + modelName);
					};

					parentRowElement.addClass('.italicText');
					$.hib.post(url, objectToUpdate, success, error);	
				}
			}
		});

	// Double click on row will be like clicking the edit icon of that row
	$('.nonHeaderTableRow').off('click').on('dblclick', function(event) {
		var tableRowElement = $(this);
		// If we are not already editing this row, make it editable
		if (!tableRowElement.hasClass('rowBeingEdited')) {
			tableRowElement.find('.editIcon').click();
		}
		// focus on the clicked cell in the table
		$(event.target).focus();
	});

	function _makeRowEditable(rowElement) {
		rowElement.addClass("rowBeingEdited");
		rowElement.children('td').not('.nonEditable').attr('contenteditable', true);
		_detectClickOutsideRowAndMakeItNotEditable(rowElement);
		if (makeRowEditableAdditionalActions) {
			makeRowEditableAdditionalActions(rowElement);
		}
	}

	function _makeRowNotEditable(rowElement) {
		rowElement.removeClass("rowBeingEdited");
		rowElement.children('td').not('.nonEditable').removeAttr('contenteditable');
		if (makeRowNonEditableAdditionalActions) {
			makeRowNonEditableAdditionalActions(rowElement);
		}
	}

	// When clicking outside a row we want to make it not editable
	function _detectClickOutsideRowAndMakeItNotEditable(rowElement) {
		var randomTempId = _generateRandomTempId();
		rowElement.attr('tempId', randomTempId);
		
		$(document).off('click').on('click', function(event) { 
			// If event target is not a child of the row, make row uneditable
			if(!$(event.target).closest('tr[tempId=' + randomTempId + ']').length) {
				rowElement.find('.finishedEditingIcon').click();
				$(document).unbind('click');
				rowElement.removeAttr('tempId');
			}      
		});
	}

	function _generateRandomTempId() {
		return Math.random() * 100000000;
	}
};