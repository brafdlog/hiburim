
function handleServerError(resp, error) {
	console.log("Error:" + error);
	resp.status(500).end(error);
}

exports.handleServerError = handleServerError;