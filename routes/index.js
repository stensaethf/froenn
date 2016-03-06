var express = require('express');
var router = express.Router();

module.exports = function() {
  // index.
  router.get('/', function(req, res) {
    res.render('index', {});
  });

  // contact.
  router.get('/contact/', function(req, res) {
    res.render('contact', {});
  });

  // contact -- redirect
  router.get('/contact', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  router.post('/contact/', function(req, res) {
    // code.
  });

  // about.
  router.get('/about/', function(req, res) {
    res.render('about', {});
  });

  // about -- redirect
  router.get('/about', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  // blog.
  router.get('/blog/', function(req, res) {
    res.redirect('/blog/all/');
  });

  // blog -- redirect
  router.get('/blog', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  return router;
};
