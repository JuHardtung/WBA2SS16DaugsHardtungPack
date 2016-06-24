var redis = require('redis');
var redisClient = redis.createClient();
var expressValidator = require('express-validator');
var util = require('util');


module.exports = {

    /**
     * Returns all items in the shopping cart from user id
     * @param [int] id
     * @return [application/json] all articles in cart as json
     */
    getCart: function (req, res, next) {

        redisClient.lrange("cart:" + req.params.id, 0, -1, function (err, obj) {
            if (err) {
                res.status(500);
                res.end();
            }
            if (obj.length === 0) {
                res.status(200);
                res.write('{ "cart":[]}');
                res.end();
            } else {

                jsonObj = JSON.parse('{ "cart":[' + obj.toString() + ']}');

                var articles = [];
                for (var item in jsonObj.cart) {
                    articles[item] = "article:" + jsonObj.cart[item].id;
                }

                var qty = [];
                for (var nr in jsonObj.cart) {
                    qty[nr] = jsonObj.cart[nr].qty;
                }

                redisClient.mget(articles, function (err, obj) {
                    if (err) {
                        res.status(500);

                    }
                    var cart;
                    for (var j in obj) {
                        var article = JSON.parse(obj[j]);
                        article.qty=qty[nr];
                        article=JSON.stringify(article);
                        if (j == 0 && obj.length == 1) {
                            cart = article;
                        } else if (j == 0) {
                            cart = article + ", ";
                        } else if (j < obj.length - 1) {
                            cart = cart + article + ", ";
                        } else {
                            cart = cart + article;
                        }
                    }

                    res.status(200);
                    res.setHeader('Content-Type', 'application/json');
                    res.send('[' + cart + ']');
                    res.end();
                });
            }
        });
    },


    /**
     * "Buys" the items in the cart
     * decreases storage and saves in db
     * TODO: FIX IF CART IS EMPTY
     */
    checkoutCart: function (req, res, next) {
        req.checkParams('id', 'Invalid UrlParam').notEmpty().isInt();
        var errors = req.validationErrors();
        var updateArray = [];
        if (errors) {
            res.status(400).send('There have been validation errors: ' + util.inspect(errors));
            return;
        }
        redisClient.lrange("cart:" + req.params.id, 0, -1, function (err, obj) {
            if (obj.length === 0) {
                return res.status(500).send('{"Errormsg":"Cart Empty.","Errcode": 500}');
            } else {

                jsonObj = JSON.parse('{ "cart":[' + obj.toString() + ']}');
                var articlesCart = [];
                for (var item in jsonObj.cart) {
                    var id = jsonObj.cart[item].id;
                    articlesCart.push('article:' + id);
                }


                redisClient.mget(articlesCart, function (err, reply) {
                    for (var item in reply) {
                        var id = jsonObj.cart[item].id;
                        var qty = jsonObj.cart[item].qty;
                        jsonArticle = JSON.parse(reply[item]);
                        if (qty > jsonArticle.storage) {
                            res.status(500);
                            return res.send('{"Errormsg":"Menge hoeher als vorhanden bei: ' + jsonArticle.name + '","Errcode": 500}');
                        } else {
                            jsonArticle.storage = jsonArticle.storage - qty;
                            updateArray.push("article:" + id);
                            updateArray.push(JSON.stringify(jsonArticle));
                        }
                    }
                    redisClient.mset(updateArray, function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                    redisClient.lrem("cart:" + req.params.id, 0, obj);
                    res.status(200);
                    res.setHeader('Content-Type', 'application/json');
                    res.write('Checked Out.');
                    res.end();
                });

            }


        });

    },

    /**
     * Adds an item to the shopping cart from user id
     * @param json with id and qty
     * @sample {"id":1,"qty":2}
     */
    addItem: function (req, res, next) {
        req.checkBody('id', 'Invalid ArticleID').notEmpty().isInt();
        req.checkBody('qty', 'Invalid qty').notEmpty().isInt();
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send('There have been validation errors: ' + util.inspect(errors));
            return;
        }

        var json = req.body;
        json.qty = parseInt(json.qty);
        if (!isNaN(parseInt(json.qty))) {
            console.log(JSON.stringify(json));
            redisClient.rpush("cart:" + req.params.id, JSON.stringify(json));
            res.write('Item added.');
            res.end();

        } else {
            res.write('JSON Format Error');
            res.end();
        }

    },

    /**
     * Deletes an item to the shopping cart with user id
     * @param [int] index
     */
    deleteItem: function (req, res, next) {
        var itemindex = req.query.index;

        redisClient.lindex("cart:" + req.params.id, itemindex, function (err, obj) {

            if (err) {
                res.status(500);
            }
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
    },


    /**
     * Deletes a cart with user id
     * @param [int] index
     */
    deleteCart: function (req, res, next) {
        redisClient.del("cart:" + req.params.id, function (err, obj) {
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
