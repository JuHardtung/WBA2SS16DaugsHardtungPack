var redis = require('redis');
var redisClient = redis.createClient();
var expressValidator = require('express-validator');
var util = require('util');

function checkCartId() {
    return true;
}

function checkValidItem() {
    return true;
}


module.exports = {

    /**
     * Returns all items in the shopping cart from user id
     * @param {int} id
     * @return {application/json} CartItems
     */
    getCart: function(req, res, next) {

        if (checkCartId()) {
            redisClient.lrange("cart:" + req.params.id, 0, -1, function(err, obj) {
                if (obj.length === 0) {
                    res.status(500);
                    res.write('Cart empty!');
                    res.end();
                } else {


                    jsonObj = JSON.parse('{ "cart":[' + obj.toString() + ']}');


                    var articles = [];
                    for (var item in jsonObj.cart) {
                        articles[item] = "article:" + jsonObj.cart[item].id;
                    }

                    redisClient.mget(articles, function(err, obj) {
                        var cart;

                        for (var j in obj) {
                            if(j==0&&obj.length==1){
                              cart =obj[j];
                            }else if(j==0){
                              cart =obj[j] + ", ";
                            }else if (j < obj.length - 1) {
                                cart = cart + obj[j] + ", ";
                            } else {
                                cart = cart + obj[j];
                            }
                        }

                        res.status(200);
                        res.setHeader('Content-Type', 'application/json');
                        res.send('[' + cart + ']');
                        res.end();
                    });



                }
            });
        } else {
            res.write('User not found.');
            res.end();

        }
    },


    /**
     * Adds an item to the shopping cart from user id
     * @param {int} itemid
     * @param {int} quantity
     */
    addItem: function(req, res, next) {
        req.checkBody('id', 'Invalid ArticleID').notEmpty().isInt();
        req.checkBody('quantity', 'Invalid quantity').notEmpty().isInt();
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send('There have been validation errors: ' + util.inspect(errors));
            return;
        }


        var json = req.body;
        json.quantity = parseInt(json.quantity);

        if (!isNaN(parseInt(json.quantity)) && checkValidItem(json.itemid)) {
            if (checkCartId()) {
                console.log(JSON.stringify(json));
                redisClient.rpush("cart:" + req.params.id, JSON.stringify(json));
                res.write('Item added.');
                res.end();
            } else {
                res.write('User not found.');
                res.end();
            }

        } else {
            res.write('JSON Format Error');
            res.end();
        }

    },

    /**
     * Deletes an item to the shopping cart from user id
     * @param {int} index
     */
    deleteItem: function(req, res, next) {
        var itemindex = req.query.index;
        if (checkCartId()) {

            redisClient.lindex("cart:" + req.params.id, itemindex, function(err, obj) {
                if (obj !== null) {
                    res.status(200);
                    redisClient.lrem("cart:" + req.params.id, 0, obj);
                    res.write('Item deleted.');
                } else {
                    res.status(400);
                    res.write('Item not found.');
                }
                res.end();
            });
        } else {
            res.write('User not found.');
            res.end();
        }
    },

    deleteCart: function(req, res, next) {
        redisClient.del("cart:" + req.params.id, function(err, obj) {
            if (err) {
                res.status(404);
                res.write('Cart not found.');
            } else {
                res.status(200);
                res.write('Cart deleted.');
            }
            res.end();

        });
    }
};
