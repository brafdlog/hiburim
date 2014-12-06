var express = require('express');
var handlebars = require('handlebars');
var nodemailer = require('nodemailer');
var config = require('../config').Config;
var fs = require('fs-extra');

var router = express.Router();

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
	var emailSubject = req.body.emailSubject;
	var emailBody = req.body.emailBody;

	transporter.sendMail({
		from: config.mailSender.fromUsername,
		to: toEmail,
		subject: emailSubject,
		text: emailBody
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

module.exports = router;