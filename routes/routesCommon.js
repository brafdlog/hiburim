var formidable = require('formidable');
var fs = require('fs-extra');
var config = require('../config').Config;

function deleteFile(filePath, callback) {
	// don't let user delete anything he wants on the server
	if(filePath.indexOf(config.uploadFolderPath) !== -1) {
		fs.remove(filePath, callback);
	} else {
		console.log('Tried to delete a file in path ' + filePath + '. Cant delete from there');
		callback("'Tried to delete a file in path ' + filePath + '. Cant delete from there'");
	}
}

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
	 		// The ui accesses the files without the "public" in the path
	 		if (_strStartsWith(new_location, 'public/')) {
	 			new_location = new_location.substr('public/'.length);
	 		}  
	 		callback(err, new_location + file_name);
	 	});
	 });
}

function handleServerError(resp, error) {
	console.log("Error:" + error);
	resp.status(500).end(JSON.stringify(error));
}

// String ends with
function _endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function _strStartsWith(str, prefix) {
    return(str.indexOf(prefix) === 0);
}

exports.handleServerError = handleServerError;
exports.handleFileUpload = handleFileUpload;
exports.deleteFile = deleteFile;