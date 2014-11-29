var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var config = require('../config').Config;

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: config.mailSender.authUsername,
		pass: config.mailSender.authPassword
	}
});

// Send an email
router.post('/email', function(req, resp) {	
	var toEmail = req.body.emailAddress;
	var mailParams = req.body.mailParams;
	var mailConfig = _getMailConfigByType(mailParams);
	if (!mailConfig) {
		console.log("Could not build mail config. Mail not sent");
		resp.status(500).end();
	}
	transporter.sendMail({
		from: config.mailSender.fromUsername,
		to: toEmail,
		subject: mailConfig.subject,
		text: mailConfig.body
	}, function(error, info) {
		if (error) {
			console.log("Failed sending email. Error: " + error);
			resp.status(500).end();
		} else {
			console.log("Sent email");
			resp.status(204).end();
		}
	});
});

function _getMailConfigByType(mailParams) {
	if (mailParams.mailType === 'sendCar') {
		return {
			subject: 'רכב פנוי להובלה',
			body: 'שלום, יש רכב פנוי להובלה. אנא כנס לאתר של חיבורים כדי להתעדכן. תודה!'
		};
	} else {
		return false;
	}
}

module.exports = router;