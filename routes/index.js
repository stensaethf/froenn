var express = require('express');
var router = express.Router();

module.exports = function() {
    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('index');
    });

    return router;
};
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index');
// });

// module.exports = router;
