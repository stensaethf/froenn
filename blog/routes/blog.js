var express = require('express');
var router = express.Router();

// Models
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

module.exports = function() {
  // submit a new blog post.
  router.post('/new/', function(req, res) {
    if (!req.user || (req.user && !req.user.admin)) {
      console.log("Access denied");
      return res.send(401);
    }

    var q = new Question({
      title: req.body.title,
      body: req.body.body,
    });
    q.save(function(err, saved_q){
      if (err || !saved_q) {
        console.log(err);
      }
      return res.redirect('/blog/' + saved_q._id + '/');
    });
  });

  // edit a blog post.
  router.post('/edit/:p_id/', function(req, res) {
    if (!req.user || (req.user && !req.user.admin)) {
      console.log("Access denied");
      return res.send(401);
    }

    var update = {
      title: req.body.title,
      body: req.body.body,
    };

    Post.findOneAndUpdate({
      _id: req.params.p_id
    }, {
      $set : update
    }, function(err, post) {
      if (err || !post) {
        console.log(err);
      }

      return res.redirect('/blog/' + post._id + '/');
    });
  });

  router.get('/edit/:p_id/', function(req, res) {
    Post.findOne({
      _id: req.params.p_id
    }, function(err, post) {
      if (err || !post) {
        console.log(err);
      }

      var renderObj = {
        post: post,
        user: req.user,
      };

      res.render('edit_post', renderObj, function(err, html){
        if (err) {
          console.log(err);
        }
        res.send(html);
      });
    });
  });

  // edit a post -- redirect
  router.get('/edit/:p_id', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  router.post('delete/:p_id', function(req, res) {
    if (!req.user || (req.user && !req.user.admin)) {
      console.log("Access denied");
      return res.send(401);
    }

    Post.findOneAndRemove({
      _id: req.params.p_id
    }, function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

  // view a specific blog post.
  router.get('/:p_id/', function(req, res) {
    Post.findOne({
      _id: req.params.p_id
    }, function(err, post) {
      if (err || !post) {
        console.log(err);
      }

      var renderObj = {
        post: post,
        user: req.user,
      };

      res.render('post', renderObj, function(err, html){
        if (err) {
          console.log(err);
        }
        res.send(html);
      });
    });
  });

  // view a post -- redirect
  router.get('/:p_id', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  // view all blog posts.
  router.get('/all/', function(req, res) {
    Post.find({}, function(err, posts) {
      if (err || !posts) {
        console.log(err);

        var renderObj = {
          posts: posts
        };

        res.render('posts_all', renderObj, function(err, html){
          if (err) {
            console.log(err);
          }
          res.send(html);
        });
      }
    });
  });

  // view all posts -- redirect
  router.get('/all', function(req, res){
    res.redirect(req.originalUrl+'/');
  });
  return router;
};