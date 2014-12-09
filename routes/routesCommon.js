var formidable = require('formidable');
var fs = require('fs-extra');
var s3 = require('s3');
var config = require('../config').Config;

var s3Client = s3.createClient({
	s3Options: {
		***REMOVED***,
		***REMOVED***
	}
});

var bucketName = config.s3Bucket;

function deleteDirectory(dirPath, callback) {

	var params = {
		Bucket: bucketName,
		Prefix: dirPath
	};

	var deletion = s3Client.deleteDir(params);
	deletion.on('error', function(err) {
		console.error("Failed deleting:", err.stack);
		callback(err);
	});
	deletion.on('end', function() {
		callback();
	});
}

function deleteFile(filePath, callback) {
	var s3PartOfUrl = 'http://' + bucketName + '.s3.amazonaws.com/';
	filePath = filePath.substring(s3PartOfUrl.length);

	var params = {
		Bucket: bucketName,
		Delete: {
			Objects: [{Key: filePath}]
		}
	};

	var deletion = s3Client.deleteObjects(params);
	deletion.on('error', function(err) {
		console.error("Failed deleting:", err.stack);
		callback(err);
	});
	deletion.on('end', function() {
		callback();
	});
}

function handleFileUpload(req, relativePath, callback) {
	 var form = new formidable.IncomingForm();

	 form.parse(req, function(err, fields, files) {
	 	console.log('Got request to upload files: ' + JSON.stringify(files));
	 });

	 form.on('end', function(fields, files) {
	 	/* Temporary location of our uploaded file */
	 	var temp_path = this.openedFiles[0].path;
	 	/* The file name of the uploaded file */
	 	var file_name = this.openedFiles[0].name;


	 	var params = {
	 		localFile: temp_path,

	 		s3Params: {
	 			Bucket: bucketName,
	 			Key: relativePath + file_name,
	 			ACL: 'public-read'
	 		}
	 	};
	 	var uploader = s3Client.uploadFile(params);
	 	uploader.on('error', function(err) {
	 		console.error("unable to upload:", err.stack);
	 		callback(err);
	 	});
	 	// uploader.on('progress', function() {
	 	// 	console.log("progress", uploader.progressMd5Amount,
	 	// 		uploader.progressAmount, uploader.progressTotal);
	 	// });
	 	uploader.on('end', function() {
	 		callback(undefined, 'http://' + bucketName + '.s3.amazonaws.com/' + relativePath + file_name);
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
exports.deleteDirectory = deleteDirectory;