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