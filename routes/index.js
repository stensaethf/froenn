var express = require('express');
var router = express.Router();

module.exports = function() {
  // index.
  router.get('/', function(req, res) {
    res.render('index', {
      user: req.user
    });
  });

  // contact.
  router.get('/contact/', function(req, res) {
    res.render('contact', {
      user: req.user
    });
  });

  // contact -- redirect
  router.get('/contact', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  // about.
  router.get('/about/', function(req, res) {
    res.render('about', {
      user: req.user
    });
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
