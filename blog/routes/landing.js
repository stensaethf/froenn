var express = require('express');
var router = express.Router();

module.exports = function() {
	/* GET home page. */
  router.get('/', function(req, res) {
    // code.
  });

	// contact.
	router.get('/contact/', function(req, res) {
    // code.
  });

  // contact -- redirect
  router.get('/contact', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  // about.
	router.get('/about/', function(req, res) {
    // code.
  });

  // about -- redirect
  router.get('/about', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

	return router;
};