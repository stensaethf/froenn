var express = require('express');
var router = express.Router();

var config = require('../config');
var email   = require("emailjs");
var server  = email.server.connect({
   user:    config.email.username,
   password: config.email.password,
   host:    config.email.host,
   ssl:     true
});

module.exports = function() {
  // index.
  router.get('/', function(req, res) {
    Post.find({}, function(err, posts) {
      if (err || !posts) {
        console.log(err);
      }

      var renderObj = {
        posts: posts,
        user: req.user
      };

      res.render('index', renderObj, function(err, html){
        if (err) {
          console.log(err);
        }
        res.send(html);
      });
    });
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
    var email = req.body.email;
    var email_text = req.body.text;
    email_text = email_text.replace(/\n/g, '\r\n');
    email_text = email_text.replace(/\r\n/g, '<br/>');

    var sendEmail = function() {
      var e_text = util.format("<html><body style='font-family: Verdana'><table align='center' border='0' cellpadding='0' cellspacing='0' width='600'>" +
                               email_text +
                               "</body></html>",
                               email_text);

      var message = {
        text: "Froenn email from " + email,
        from: "Froenn <" + email + ">",
        to: "frederikstensaeth@gmail.com",
        subject: "Froenn email from " + email,
        attachment:
        [
          {data: e_text, alternative: true}
        ]
      };
      server.send(message, function(err, message) {
        console.log(err || message);
      });
    };

    sendEmail();
    res.redirect(req.originalUrl);
  });

  // about.
  router.get('/about/', function(req, res) {
    res.render('about', {});
  });

  // about -- redirect
  router.get('/about', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  return router;
};
