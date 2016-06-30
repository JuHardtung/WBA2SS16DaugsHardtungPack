var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var ArticleController = require('./controllers/ArticlesController');
var AuthController = require('./controllers/AuthController');
var CartController = require('./controllers/CartController');
var UserController = require('./controllers/UserController');
var OtherController = require('./controllers/OtherController');




// Other
router.route('/db')
    .get(OtherController.resetDB);


// User

router.route('/user')
    .post(AuthController.signup)
    .get(AuthController.getUser);


router.route('/user/:id')
    .get(AuthController.getUserById)
    .delete(AuthController.deleteUser);


router.route('/user/:id/password')
    .patch(AuthController.updatePWD);

router.route('/user/:id/mail')
    .patch(AuthController.updateMail);


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

router.route('/category')
    .get(ArticleController.getCategorys);


// Finally export the router
module.exports = router;
