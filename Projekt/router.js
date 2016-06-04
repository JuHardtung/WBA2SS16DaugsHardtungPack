var express = require('express');
var router = express.Router();
var Response = require('./helper/ResponseHelper.js');

var ArticlesController = require('./controllers/ArticlesController');
var AuthController = require('./controllers/AuthController');
var CartController = require('./controllers/CartController');

router.route('/*')
    .trace(function (req, res, next) {
        res.send(Response.successfull(200, req.body, null, null));
    })
    .options(function (req, res, next) {
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


//Articles
router.route('/article/all')
    .get(ArticleController.getArticles);

router.route('/article/id')
    .get(ArticleController.getArticleById);

router.route('/article/add')
    .post(ArticleController.addArticle);

router.route('/article/delete')
    .get(ArticleController.delArticle);


// Finally export the router
module.exports = router;