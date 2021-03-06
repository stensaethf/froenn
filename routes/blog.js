var express = require('express');
var router = express.Router();
var moment = require('moment');
var marked = require('marked');

// Models
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');

module.exports = function(passport) {
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

  // Setup login with regular auth
  router.post('/login/',
    passport.authenticate('user', {
      successRedirect: '/',
      failureRedirect: '/blog/login/',
      failureFlash: 'Invalid email or password.'
    })
  );

  // logout
  router.get('/logout/', function(req, res) {
    req.session.destroy();
    req.user = undefined;
    res.redirect('/');
  });

  // new user
  router.post('/user/new/', function(req, res) {
    User.find({}, function(err, users) {
      if (err) {
        console.log(err);
      }
      if (!users.length) {
        var u = new User({
          password: req.body.password,
          f_n: req.body.f_n,
          l_n: req.body.l_n,
          email: req.body.email,
          admin: true,
        });

        // save user
        u.save(function(err){
          if (err) {
            console.log(err);
            return res.render('register');
          }
          
          // automatically login user and redirect to homepage
          req.login(u, function(err) {
            if (err) {
              console.log(err);
            }
            return res.redirect('/');
          });
        });
      } else {
        console.log("A user already exists.");
        return res.redirect('/blog/login/');
      }
    });
  });

  // new user
  router.get('/user/new/', function(req, res) {
    if (req.user) {
      return res.redirect('/');
    }

    User.find({}, function(err, users) {
      if (err) {
        console.log(err);
      }
      if (users && users.length) {
        console.log("A \'" + users[0].f_n + "\' user already exists.");
        return res.redirect('/blog/login/');
      } else {
        res.render('register');
      }
    });
  });

  // new user -- redirect
  router.get('/user/new', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  // new blog post.
  router.post('/new/', function(req, res) {
    if (!req.user || (req.user && !req.user.admin)) {
      console.log("Access denied");
      return res.redirect('/blog/login/');
    }

    var q = new Post({
      title: req.body.title,
      body: req.body.body,
      author: req.user._id
    });
    q.save(function(err, saved_q){
      if (err || !saved_q) {
        console.log(err);
      }
      // return res.redirect('/blog/' + saved_q._id + '/');
      return res.send({'redirect': '/blog/' + saved_q._id + '/'});
    });
  });

  // view new post
  router.get('/new/', function(req, res) {
    if (!req.user || (req.user && !req.user.admin)) {
      console.log("Access denied");
      return res.redirect('/blog/login/');
    }

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
      return res.redirect('/blog/login/');
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

      // return res.redirect('/blog/' + post._id + '/');
      return res.send({'redirect': '/blog/' + post._id + '/'});
    });
  });

  // view edit a post
  router.get('/edit/:p_id/', function(req, res) {
    if (!req.user || (req.user && !req.user.admin)) {
      console.log("Access denied");
      return res.redirect('/blog/login/');
    }

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
      return res.redirect('/blog/login/');
    }

    // delete the post.
    Post.findOneAndRemove({
      _id: req.params.p_id
    }, function (err) {
      if (err) {
        console.log(err);
      }
    });

    // delete all comments associated with the post.
    Comment.remove({
      post: req.params.p_id
    }, function(err) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect('/');
  });

  // new blog post comment.
  router.post('/:p_id/comment/new/', function(req, res) {
    Post.findOne({
      _id: req.params.p_id
    }, function(err, post) {
      if (err || !post) {
        console.log(err);
      }
      var c = new Comment({
        body: req.body.body,
        author: req.body.author,
        post: post._id
      });
      c.save(function(err, saved_c){
        if (err || !saved_c) {
          console.log(err);
        }
        // return res.redirect('/blog/' + post._id + '/');
        return res.send({'redirect': '/blog/' + post._id + '/'});
      });
    });
  });

  // delete blog post comment.
  router.post('/comment/delete/:c_id/', function(req, res) {
    if (!req.user || (req.user && !req.user.admin)) {
      console.log("Access denied");
      return res.redirect('/blog/login/');
    }

    Comment.findOneAndRemove({
      _id: req.params.c_id
    }, function(err) {
      if (err) {
        console.log(err);
      }
    return res.redirect('/blog/' + req.body.p_id + '/');
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
      Comment.find({
        post: post._id
      })
      .sort('-ts')
      .exec(function(err, comments) {
        if (err) {
          console.log(err);
        }

        post.body = marked(post.body);
        comments = comments.map(function(el) {
          el.body = marked(el.body);
          return el;
        });

        var renderObj = {
          post: post,
          user: req.user,
          comments: comments,
          moment: moment
        };

        res.render('blog_post', renderObj, function(err, html){
          if (err) {
            console.log(err);
          }
          res.send(html);
        });
      });
    });
  });

  // view a post -- redirect
  router.get('/:p_id', function(req, res){
    res.redirect(req.originalUrl+'/');
  });

  return router;
};