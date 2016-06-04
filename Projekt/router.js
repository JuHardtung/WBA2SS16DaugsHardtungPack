var express 	= require('express');
var router 		= express.Router();
var Response  = require('./helper/ResponseHelper.js');

var ArticlesController    = require('./controllers/ArticlesController');
var AuthController   = require('./controllers/AuthController');
var CartController   = require('./controllers/CartController');

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

router.route('/login')
    .get(AuthController.loginGet)
    .post(AuthController.login);



//Shopping Cart
router.route('/shoppingcart/:id')
    .get(CartController.getCart);

router.route('/shoppingcart/:id/add')
    .get(CartController.addItem);

router.route('/shoppingcart/:id/delete')
    .get(CartController.deleteItem);


// Finally export the router
module.exports = router;
