var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 'layout': 'generalLayout', 'title': 'moo' });
});

module.exports = router;
