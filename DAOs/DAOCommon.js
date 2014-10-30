
function isFunction(varToCheck) {
	return (typeof(varToCheck) == "function");
}

function logMsg(err, successMsg, errorMsg) {
	if (err) {
		console.log(errorMsg + err);
	} else {
		console.log(successMsg);
	}
}

exports.isFunction = isFunction;
exports.logMsg = logMsg;