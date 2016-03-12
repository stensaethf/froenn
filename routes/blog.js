var express = require('express');
var router = express.Router();

// Models
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');

module.exports = function() {
  // login
  router.get('/login/', function(req, res) {
    var renderObj = {
      user: req.user
    };

    res.render('login', renderObj, function(err, html){
      if (err) {
        console.log(err);
      }
      res.send(html);
    });
  });

  // login -- redirect
  router.get('/login', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  // login
  router.post('/login/', function(req, res) {
    // code.
  });

  // logout
  router.post('/logout/', function(req, res) {
    req.session.destroy();
    req.user = undefined;
    res.redirect('/');
  });

  // view all blog posts.
  router.get('/all/', function(req, res) {
    Post.find({}, function(err, posts) {
      if (err || !posts) {
        console.log(err);
      }

      var renderObj = {
        posts: posts,
        user: req.user
      };

      res.render('blog', renderObj, function(err, html){
        if (err) {
          console.log(err);
        }
        res.send(html);
      });
    });
  });

  // view all posts -- redirect
  router.get('/all', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  // new blog post.
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

  // view new post
  router.get('/new/', function(req, res) {
    var renderObj = {
      user: req.user
    };

    res.render('blog_post_new', renderObj, function(err, html){
      if (err) {
        console.log(err);
      }
      res.send(html);
    });
  });

  // new post -- redirect
  router.get('/new', function(req, res){
    res.redirect(req.originalUrl+'/');
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

  // view edit a post
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

      res.render('blog_post_edit', renderObj, function(err, html){
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

  // delete a post.
  router.post('/delete/:p_id/', function(req, res) {
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

      res.render('blog_post', renderObj, function(err, html){
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

  router.get('/', function(req, res){
    res.redirect(req.originalUrl+'/all/');
  });

  return router;
};