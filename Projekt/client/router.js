var express 	= require('express');
var router    = express.Router();

var CartController = require("./controllers/CartController.js");



router.route('/cart')
    .get(CartController.getCart);

//
// Finally export the router
module.exports = router;
