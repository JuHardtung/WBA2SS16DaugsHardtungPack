var express = require('express');
var router = express.Router();
var Response = require('./helper/ResponseHelper.js');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var ArticleController = require('./controllers/ArticlesController');
var AuthController = require('./controllers/AuthController');
var CartController = require('./controllers/CartController');
var UserController = require('./controllers/UserController');
var OtherController = require('./controllers/OtherController');

router.route('/*')
    .trace(function(req, res, next) {
        res.send(Response.successfull(200, req.body, null, null));
    })
    .options(function(req, res, next) {
        res.send(Response.successfull(100));
    });


// Other
router.route('/db')
    .get(OtherController.resetDB);

// User
router.route('/user/new')
    .post(AuthController.signup);

router.route('/user')
    .post(AuthController.login);

router.route('/user/password')
    .patch(UserController.updatePWD);

router.route('/user/mail')
    .patch(UserController.updateMail);


//Shopping Cart
router.route('/cart/:id')
    .get(CartController.getCart)
    .post(CartController.addItem)
    .patch(CartController.deleteItem)
    .delete(CartController.deleteCart);

router.route('/cart/:id/checkout')
    .get(CartController.checkoutCart);




//Articles


router.route('/article/')
    .get(ArticleController.getArticles)
    .post(ArticleController.addArticle);

router.route('/article/:id')
    .get(ArticleController.getArticleById)
    .delete(ArticleController.delArticle);


// Finally export the router
module.exports = router;
