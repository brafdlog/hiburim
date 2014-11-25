var express = require('express');
var router = express.Router();
var config = require('../config').Config;

// Get configuration that is exposed to ui
router.get('/', function(req, resp) {	
	resp.json(config.uiExposedConfig);
	resp.end();
});

module.exports = router;