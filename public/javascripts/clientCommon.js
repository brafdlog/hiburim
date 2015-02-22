$.hib = {};

$.hib.consts = {
	pickATimeDateFormat: "dd-mm-yyyy",
	pickATimeTimeFormat: "H:i",
	momentDateFormat: "DD-MM-YYYY",
	momentTimeFormat: "H:mm"
};

$.hib.toDateStr = function(date) {
	return moment(date).format($.hib.consts.momentDateFormat);
};

$.hib.toTimeStr = function(date) {
	return moment(date).format($.hib.consts.momentTimeFormat);
};

$.hib.toDateTime = function(dateStr, timeStr) {
	if (dateStr) {
		var date = moment(dateStr, $.hib.consts.momentDateFormat);
		if (timeStr) {
			var time = moment(timeStr, $.hib.consts.momentTimeFormat);
			date.hours(time.hours());
			date.minutes(time.minutes());
		}
		return date.toDate();
	}
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

$.hib.donationStatusTypes = {};

$.hib.donationStatusTypes.englishToHebrew = {
	'available': 'זמין',
	'given': 'משוריין',
	'promised': 'נמסר', 
	'notRelevant': 'לא רלוונטי'
};

$.hib.runFormValidation = function() {
	var formGroupParent = $(this).closest('.form-group');
	if ($(this).val()) {
		formGroupParent.removeClass('has-error');
	} else {
		formGroupParent.addClass('has-error');
	}
};

$.hib.donationStatusTypes.hebrewToEnglish = function() {
	var donationStatusTypesHebrewToEnglish = {};
	Object.keys($.hib.donationStatusTypes.englishToHebrew).forEach(function(englishStatus) {
		var hebrewStatus = $.hib.donationStatusTypes.englishToHebrew[englishStatus];
		donationStatusTypesHebrewToEnglish[hebrewStatus] = englishStatus;
	});
	return donationStatusTypesHebrewToEnglish;
}();

$.hib.donationStatusTypes.hebrew = Object.keys($.hib.donationStatusTypes.hebrewToEnglish);

$.hib.itemCategories = [
	'כיסאות', 'מיטה זוגית', 'מיטה זוגית + מזרן', 'מיטת יחיד', 'מיטת יחיד + מזרן', 'ארון בגדים', 'שולחן כתיבה', 'שולחן אוכל', 'שולחן אוכל + כיסאות', 'ספה', 'סלון', 'כיריים חשמליות', 'כיריים גז', 'טלויזיה שטוחה', 'טלויזיה רחבה (לא שטוחה)', 'תנור חימום \\ רדיאטור', 'מאוורר', 'מיקרוגל', 'טוסטר אובן', 'ציוד למטבח', 'שטיח', 'שואב אבק', 'צעצועים וספרים לילדים', 'ציוד לילדים ולתינוקות', 'אחר'
];

$.hib.areas = [
	'ירושלים', 'שאר הארץ'
];

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

$.hib.spinnerOptions = {
	lines: 11, // The number of lines to draw
	length: 0, // The length of each line
	width: 7, // The line thickness
	radius: 17, // The radius of the inner circle
	corners: 1, // Corner roundness (0..1)
	rotate: 63, // The rotation offset
	direction: 1, // 1: clockwise, -1: counterclockwise
	color: '#000', // #rgb or #rrggbb or array of colors
	speed: 1, // Rounds per second
	trail: 53, // Afterglow percentage
	shadow: false, // Whether to render a shadow
	hwaccel: false, // Whether to use hardware acceleration
	className: 'spinner', // The CSS class to assign to the spinner
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	top: '50%', // Top position relative to parent
	left: '50%' // Left position relative to parent
};

$.hib.spinnerObjectCache = {};

$.hib.displaySpinner = function(idOfSpinnerElement) {
	var spinner = $.hib.spinnerObjectCache[idOfSpinnerElement];
	if (!spinner) {
		spinner = new Spinner($.hib.spinnerOptions);
		$.hib.spinnerObjectCache[idOfSpinnerElement] = spinner;
	}
	var target = document.getElementById(idOfSpinnerElement);
	spinner.spin(target);
};

$.hib.hideSpinner = function(idOfSpinnerElement) {
	var spinner = $.hib.spinnerObjectCache[idOfSpinnerElement];
	if (spinner) {
		spinner.stop();
		delete $.hib.spinnerObjectCache[idOfSpinnerElement];
	}
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