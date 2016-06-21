var express 	= require('express');
var router    = express.Router();

var CartController = require("./controllers/CartController.js");
var ArticleController = require("./controllers/ArticleController.js");



router.route('/cart')
    .get(CartController.getCart);

router.route('/cart/1')
    .post(CartController.addItem);

router.route('/')
    .get(ArticleController.getAll);

//
// Finally export the router
module.exports = router;
