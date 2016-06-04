var express 	= require('express');
var router 		= express.Router();
var Response  = require('./helper/ResponseHelper.js');

var ArticlesController    = require('./controllers/ArticlesController');
var AuthController   = require('./controllers/AuthController');

router.route('/*')
  .trace(function(req, res, next) {
    res.send(Response.successfull(200, req.body, null, null));
  })
  .options(function(req, res, next) {
    res.send(Response.successfull(100));
  });

// Articles
router.route('/signup')
    .get(AuthController.signupGet)
    .post(AuthController.signup);



// Finally export the router
module.exports = router;
