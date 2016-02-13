var express = require('express');
var router = express.Router();

// Models
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

module.exports = function() {
	// submit a new blog post.
	router.post('/new/', function(req, res) {
		if (!req.user) {
			console.log("Access denied");
			return res.send(401);
		}

		var q = new Question({
      title: req.body.title,
      body: req.body.body,
    });
    q.save(function(err, saved_q){
      if (err) {
        console.log(err);
      }
      return res.redirect('/blog/' + saved_q._id + '/');
    });
	});

	// edit a blog post.
	router.post('/edit/:p_id/', function(req, res) {
		// code.
	});

	// view a specific blog post.
	router.get('/:p_id/', function(req, res) {
		// code.
	});

	// view all blog posts.
	router.get('/all/', function(req, res) {
		// code.
	});
	return router;
};