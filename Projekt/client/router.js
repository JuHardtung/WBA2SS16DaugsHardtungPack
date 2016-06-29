var express = require('express');
var router = express.Router();

var CartController = require("./controllers/CartController.js");
var ArticleController = require("./controllers/ArticleController.js");
var UserController = require("./controllers/UserController.js");
var ImpressumController = require("./controllers/ImpressumController.js");

// Eigene Middleware
// =========================================================
var isLoggedIn = function (req, res, next) {
    if (req.session.userName) {
        next();
    } else {
        var data = {
            session: req.session
        };
        res.status(401);
        res.render('401', data);
    }
};

var isAdmin = function (req, res, next) {
    if (req.session.userName == "admin") {
        next();
    } else {
        var data = {
            session: req.session
        };
        res.status(401);
        res.render('401', data);
    }
};

router.route('/cart')
    .get(isLoggedIn, CartController.getCart)
    .post(CartController.addItem)
    .patch(CartController.deleteItem);

router.route('/cart/checkout')
    .get(isLoggedIn, CartController.checkout);

router.route('/')
    .get(ArticleController.getAll);

router.route('/push')
    .get(isAdmin, UserController.push);

router.route('/login')
    .post(UserController.login);

router.route('/article')
    .get(ArticleController.getArticle)
    .delete(ArticleController.deleteArticle)
    .post(ArticleController.addArticle);

router.route('/articleedit')
    .get(isAdmin, ArticleController.editArticle);

router.route('/signup')
    .get(UserController.signup)
    .post(UserController.signuppost);

router.route('/logout')
    .get(isLoggedIn, UserController.logout);

router.route('/settings')
    .get(isLoggedIn, UserController.settings)
    .post(UserController.changeData);

router.route('/impressum')
    .get(ImpressumController.impressum);

router.route('/user')
    .get(isAdmin, UserController.getUsers)
    .patch(isAdmin, UserController.deleteUser);


//
// Finally export the router
module.exports = router;
