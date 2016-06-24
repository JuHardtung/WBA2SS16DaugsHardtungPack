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

        redisClient.HGETALL("cart:" + req.params.id , function (err, obj) {

            if (err) {
                res.status(500);
                res.end();
            }
            if (obj === null) {
                res.status(200);
                res.write('{ "cart":[]}');
                res.end();
            } else {
                var i = 0;
                var articles = [];
                var qty = [];
                for (var item in obj) {
                    articles[i] = "article:" + item;
                    qty[i]=obj[item];
                    i++;
                }
                 redisClient.mget(articles, function (err, obj) {
                    if (err) {
                        res.status(500);

                    }
                   var cart;
                    for (var j in obj) {
                        var article = JSON.parse(obj[j]);
                        article.qty=qty[j];
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
        redisClient.hgetall("cart:" + req.params.id, function (err, obj) {
            if (obj === null) {
                return res.status(500).send('{"Errormsg":"Cart Empty.","Errcode": 500}');
            } else {

              var i = 0;
              var articles = [];
              var quantity = [];
              for (var item in obj) {
                  articles[i] = "article:" + item;
                  quantity[i]=obj[item];
                  i++;
              }


                redisClient.mget(articles, function (err, reply) {
                    var ids = [];
                    for (var item in reply) {

                        var qty = quantity[item];
                        console.log(reply+" "+qty);
                        jsonArticle = JSON.parse(reply[item]);
                        var id = jsonArticle.id;
                        if (qty > jsonArticle.storage) {
                            res.status(500);
                            return res.send('{"Errormsg":"Menge hoeher als vorhanden bei: ' + jsonArticle.name + '","Errcode": 500}');
                        } else {
                            jsonArticle.storage = jsonArticle.storage - qty;
                            updateArray.push("article:" + id);
                            updateArray.push(JSON.stringify(jsonArticle));
                            ids.push(id);
                        }
                    }
                    redisClient.mset(updateArray, function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                    redisClient.hdel("cart:" + req.params.id, ids);
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
            redisClient.hset("cart:" + req.params.id, json.id ,json.qty);
            res.status(200);
            res.write('Item added.');
            res.end();

        } else {
            res.status(400);
            res.write('JSON Format Error');
            res.end();
        }

    },

    /**
     * Deletes an item to the shopping cart with user id
     * @param [int] index
     */
    deleteItem: function (req, res, next) {
        var itemid = req.query.itemid;

        redisClient.HDEL("cart:" + req.params.id, itemid, function (err) {

            if (err) {
                res.status(500);
            }else{
                res.status(200);
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
