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
router.route('/resetdb')
    .get(OtherController.resetDB);

// Articles
router.route('/signup')
    .get(AuthController.signupGet)
    .post(AuthController.signup);

router.route('/login')
    .get(AuthController.loginGet)
    .post(AuthController.login);



//Shopping Cart
router.route('/cart/:id')
    .get(CartController.getCart)
    .post(CartController.addItem)
    .patch(CartController.deleteItem)
    .delete(CartController.deleteCart);

//User
router.route('/user')
    .get(UserController.getAll)
    .post(UserController.add);

router.route('/user/:id')
    .get(UserController.getUser)
    .delete(UserController.delete);

//Articles
router.route('/article/')
    .get(ArticleController.getArticles);

router.route('/article/:id')
    .get(ArticleController.getArticleById)
    .post(ArticleController.addArticle)
    .delete(ArticleController.delArticle);


// Finally export the router
module.exports = router;
