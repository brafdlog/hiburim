var express = require('express');
var handlebars = require('handlebars');
var nodemailer = require('nodemailer');
var config = require('../config').Config;
var fs = require('fs-extra');

var router = express.Router();

var mailTemplates = {
	sendCarTemplate: ''
};

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
		return {body: mailTemplates.sendCarTemplate(mailParams), subject: 'הודעה מחיבורים - רכב פנוי להובלה'};
	} else {
		return false;
	}
}

// Init email templates
(function() {
	var emailTemplateFolderPath = process.env.PWD + '/views/emailTemplates';
	fs.readFile(emailTemplateFolderPath + '/carAvailable.hbs', 'utf8', function (err,templateSource) {
		if (err) {
			console.log("Failed loading template for sendCar email");
		} else {
			mailTemplates.sendCarTemplate = handlebars.compile(templateSource);
		}
	});
})();

module.exports = router;