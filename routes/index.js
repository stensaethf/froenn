var express = require('express');
var router = express.Router();
var moment = require("moment");

// Models
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');

module.exports = function() {
  // index.
  router.get('/', function(req, res) {
    Post.find({}
    )
    .sort('-ts')
    .exec(function(err, posts) {
      if (err || !posts) {
        console.log(err);
      }

      var renderObj = {
        posts: posts,
        user: req.user,
        moment: moment
      };

      res.render('index', renderObj, function(err, html){
        if (err) {
          console.log(err);
        }
        res.send(html);
      });
    });
  });

  return router;
};
