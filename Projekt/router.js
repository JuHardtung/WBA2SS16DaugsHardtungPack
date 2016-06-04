var express = require('express');
var router = express.Router();
var Response = require('./helper/ResponseHelper.js');

var ArticlesController = require('./controllers/ArticlesController');
var AuthController = require('./controllers/AuthController');
var CartController = require('./controllers/CartController');
var CartController = require('./controllers/UserController');

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
router.route('/cart/:id')
    .get(CartController.getCart);

router.route('/cart/:id/add')
    .get(CartController.addItem);

router.route('/cart/:id/delete')
    .get(CartController.deleteItem);

//User
router.route('/user/all')
    .get(UserController.getAll);

router.route('/user/:id')
    .get(UserController.getUser);

router.route('/user/add')
    .get(UserController.add);

router.route('/user/delete')
    .get(UserController.delete);

// Finally export the router
module.exports = router;
