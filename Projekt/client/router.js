var express 	= require('express');
var router    = express.Router();

var CartController = require("./controllers/CartController.js");
var ArticleController = require("./controllers/ArticleController.js");
var UserController = require("./controllers/UserController.js");



router.route('/cart')
    .get(CartController.getCart);

router.route('/cart/1')
    .post(CartController.addItem);

router.route('/')
    .get(ArticleController.getAll);

router.route('/login')
        .post(UserController.login);

router.route('/signup')
        .get(UserController.signup)
        .post(UserController.signuppost);


router.route('/logout')
        .get(UserController.logout);

//
// Finally export the router
module.exports = router;
