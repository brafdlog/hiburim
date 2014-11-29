var formidable = require('formidable');
var fs = require('fs-extra');
var config = require('../config').Config;

function handleFileUpload(req, relativePath, callback) {
	 var form = new formidable.IncomingForm();

	 form.parse(req, function(err, fields, files) {
	 	console.log('Uploaded files: ' + files);
	 });

	 form.on('end', function(fields, files) {
	 	/* Temporary location of our uploaded file */
	 	var temp_path = this.openedFiles[0].path;
	 	/* The file name of the uploaded file */
	 	var file_name = this.openedFiles[0].name;
	 	/* Location where we want to copy the uploaded file */
	 	var new_location = config.uploadFolderPath + '/' + relativePath;

	 	// This is to prevent problems with duplicate names
	 	// var epochString = (new Date()).getTime();
	 	// file_name = file_name + '_' + epochString;

	 	if (!_endsWith(new_location, '/')) {
	 		new_location = new_location + '/';
	 	}

	 	fs.copy(temp_path, new_location + file_name, function(err) {  
	 		callback(err, new_location + file_name);
	 	});
	 });
}

function handleServerError(resp, error) {
	console.log("Error:" + error);
	resp.status(500).end(error);
}

// String ends with
function _endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

exports.handleServerError = handleServerError;
exports.handleFileUpload = handleFileUpload;