  $(function(){
    // When page loads attach the table sorter to the table.
    // It is possible to pass parameters to decide which columns he will sort by in the beginning.
    //$("#carsTable").tablesorter();

    var datePickerElements = $('.datePicker');
    $.each(datePickerElements, function(index, element) {
      _setUpDatePicker(element);
    });

    var timePickerElements = $('.timePicker');
    $.each(timePickerElements, function(index, element) {
      _setUpTimePicker(element);
    });

    $.hib.makeTableRowsEditable("car", _buildObjectToUpdateFunc, _makeRowEditableAdditionalActions, _makeRowNonEditableAdditionalActions);

    $('#addCarButton').off('click').on('click', _addEmptyRow);
    
  });

  function _buildObjectToUpdateFunc(rowElement) {
    var dateString = rowElement.attr('date');
    var timeString = rowElement.attr('time');

    var carToUpdate = {
      _id: rowElement.attr('id'),
      carType: rowElement.attr('carType'), 
      driverName: $.trim(rowElement.find('.nameTd').text()), 
      driverNumber: $.trim(rowElement.find('.phoneNumberTd').text()), 
      availableFromDate: dateString,
      availableFromTime: timeString,
      availableDurationInHours: rowElement.find('.availableDuration').val()
    };

    // If this is just an empty row, no need to update server
    if (_isCarObjectEmpty(carToUpdate)) {
      return undefined;
    }

    return carToUpdate;
  }

  function _makeRowEditableAdditionalActions(rowElement) {
    rowElement.find('.datePicker').attr('disabled', false);
    rowElement.find('.timePicker').attr('disabled', false);
    rowElement.find('.availableDuration').attr('disabled', false);
  }

  function _makeRowNonEditableAdditionalActions(rowElement) {
    rowElement.find('.datePicker').attr('disabled', true);
    rowElement.find('.timePicker').attr('disabled', true);
    rowElement.find('.availableDuration').attr('disabled', true);
  }

  function _addEmptyRow() {
    var hiddenRow = $('.hiddenRow');
    // parameter true for also cloning data and events
    var newRow = hiddenRow.clone(true);
    newRow.removeClass('hiddenRow');
    newRow.insertBefore('.hiddenRow');
  }

  function _setUpDatePicker(datePickerElement) {
    $(datePickerElement).pickadate({ 
      onClose: _updateRowDateAttribute,
      format: $.hib.consts.pickATimeDateFormat // dd-mm-yyyy
    });
    var dateString = $(datePickerElement).closest('tr').attr('date');
    if (dateString) {
      var date = moment(dateString, $.hib.consts.momentDateFormat); // dd-mm-yyyy
      $(datePickerElement).pickadate('picker').set('select', [date.year(), date.month(), date.date()]); 
    }
  }

  function _setUpTimePicker(timePickerElement) {
    var jqueryElement = $(timePickerElement);
    jqueryElement.pickatime({
      min: [6,0],
      max: [23,0],
      onSet: _updateRowTimeAttribute,
      format: $.hib.consts.pickATimeTimeFormat // 23:30 or 9:40
    });
    var timeString = jqueryElement.closest('tr').attr('time');
    if (timeString) {
      var time = moment(timeString, $.hib.consts.momentTimeFormat);
      jqueryElement.pickatime('picker').set('select', [time.hours(), time.minutes()]);
    }
  }

  function _updateRowDateAttribute() {
    var dateString = this.get();
    var dateInputElementId = this.get('id');
    var dateInputElement = $('#'+dateInputElementId);
    var rowElement = dateInputElement.closest('tr');
    rowElement.attr('date', dateString);
  }

  function _updateRowTimeAttribute(selectElement) {
    var minutesSinceMidnight = selectElement.select;
    var parentRow = $('#' + this.get('id')).closest('tr');
    var hours = Math.floor(minutesSinceMidnight / 60);
    var minutes = minutesSinceMidnight % 60;
    var timeString = hours + ":" + minutes;
    parentRow.attr("time", timeString);
  }

  function _isCarObjectEmpty(car) {
    return !car._id && !car.driverName && !car.driverNumber;
  }