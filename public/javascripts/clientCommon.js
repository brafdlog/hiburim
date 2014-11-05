$.hib = {};

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

/*
	Makes the table editable if:
		1. The table has the following classes in the right places:  
			iconsTd
			finishedEditingIcon
			deleteIcon
			editIcon
			nonHeaderTableRow
		2. Each table row has the id of the element it represents
		3. Has a td that has the three icons for delete, edit and approve changes
 */
$.hib.makeTableRowsEditable = function(modelName) {
	$('.finishedEditingIcon').hide();

	$('.deleteIcon').off('click').on('click', function() {
		var parentRowElement = $(this).closest('tr');
		bootbox.confirm('האם למחוק?', function(userWantsToDelete) {
			if (userWantsToDelete) {
				var objectToDeleteId = parentRowElement.attr('id');
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
		rowElement.children('td').not('.iconsTd').attr('contenteditable', true);
		_detectClickOutsideRowAndMakeItNotEditable(rowElement);
	}

	function _makeRowNotEditable(rowElement) {
		rowElement.removeClass("rowBeingEdited");
		rowElement.children('td').not('.iconsTd').removeAttr('contenteditable');
	}

	// When clicking outside a row we want to make it not editable
	function _detectClickOutsideRowAndMakeItNotEditable(rowElement) {
		$(document).off('click').on('click', function(event) { 
			var rowId = rowElement.attr('id');
			// If event target is not a child of the row, make row uneditable
			if(!$(event.target).closest('#' + rowId).length) {
				rowElement.find('.finishedEditingIcon').click();
				$(document).unbind('click');
			}      
		});
	}
};