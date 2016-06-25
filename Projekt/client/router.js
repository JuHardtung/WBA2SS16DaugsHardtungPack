var express = require('express');
var router = express.Router();

var CartController = require("./controllers/CartController.js");
var ArticleController = require("./controllers/ArticleController.js");
var UserController = require("./controllers/UserController.js");
var ImpressumController = require("./controllers/ImpressumController.js");


router.route('/cart')
    .get(CartController.getCart)
    .post(CartController.addItem)
    .patch(CartController.deleteItem);


router.route('/')
    .get(ArticleController.getAll);

router.route('/push')
    .get(UserController.push);

router.route('/login')
    .post(UserController.login);

router.route('/article')
    .get(ArticleController.getArticle)
    .delete(ArticleController.deleteArticle);

router.route('/articleedit')
    .get(ArticleController.addArticle);

router.route('/signup')
    .get(UserController.signup)
    .post(UserController.signuppost);

router.route('/logout')
    .get(UserController.logout);

router.route('/settings')
    .get(UserController.settings)
    .post(UserController.changePwd);

router.route('/impressum')
    .get(ImpressumController.impressum);



//
// Finally export the router
module.exports = router;
