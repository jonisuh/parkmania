var express = require('express');
var router = express.Router();

var ctrlHome = require('../controllers/home');

//Home
router.get('/', ctrlHome.angularApp);

module.exports = router;
