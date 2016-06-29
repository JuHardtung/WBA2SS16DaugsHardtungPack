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

        redisClient.HGETALL("cart:" + req.params.id, function (err, obj) {

            if (err) {
                res.status(500).setHeader('Content-Type', 'application/json');
                res.send({
                    "code": 500
                    , "msg": "Fehler in der Datenbank."
                });
                return;
            }
            if (obj === null) {
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.write('{ "cart":[]}');
                res.end();
            } else {
                var i = 0;
                var articles = [];
                var qty = [];
                for (var item in obj) {
                    articles[i] = "article:" + item;
                    qty[i] = obj[item];
                    i++;
                }
                redisClient.mget(articles, function (err, obj) {
                    if (err) {
                        res.status(500);

                    }
                    var cart = [];

                    for (var j in obj) {
                        if (obj[j] !== null) {

                            var article = JSON.parse(obj[j]);
                            article.qty = qty[j];
                            article = JSON.stringify(article);
                            cart.push(article);
                        }
                    }
                    /*  for (var j in obj) {
                          if (obj[j] !== null) {

                              var article = JSON.parse(obj[j]);
                              console.log(article);
                              article.qty = qty[j];
                              article = JSON.stringify(article);
                              if (j == 0 && obj.length == 1) {
                                  cart = article;
                              } else if (j == 0) {
                                  cart = article + ", ";
                              } else if (j < obj.length - 1) {
                                  cart = cart + article + ", ";
                              } else if (cart === undefined) {
                                  cart = article;
                              } else {
                                  cart = cart + article;
                              }
                          }
                      }

                      if (cart === undefined) {
                          res.status(200);
                          res.setHeader('Content-Type', 'application/json');
                          res.write('{ "cart":[]}');
                          res.end();
                      } else {*/
                    res.status(200);
                    res.setHeader('Content-Type', 'application/json');
                    res.send('[' + cart.join(',') + ']');
                    //  }
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
            res.status(400).setHeader('Content-Type', 'application/json');
            res.send({
                "code": 400
                , "msg": util.inspect(errors)
            });
            return;
        }
        redisClient.hgetall("cart:" + req.params.id, function (err, obj) {
            if (obj === null) {
                res.status(500).setHeader('Content-Type', 'application/json');
                res.send({
                    "code": 500
                    , "msg": "Warenkorb leer."
                });
                return;
            } else {

                var i = 0;
                var articles = [];
                var quantity = [];
                for (var item in obj) {
                    if (obj !== null) {
                        articles[i] = "article:" + item;
                        quantity[i] = obj[item];
                        i++;
                    }
                }

                redisClient.mget(articles, function (err, obj) {
                    var reply = [];
                    for (var j in obj) {
                        if (obj[j] !== null) {
                            reply.push(obj[j]);
                        }
                    }

                    var ids = [];
                    for (var item in reply) {

                        var qty = quantity[item];
                        console.log(reply + " " + qty);
                        jsonArticle = JSON.parse(reply[item]);
                        var id = jsonArticle.id;
                        if (qty > jsonArticle.storage) {
                            res.status(500).setHeader('Content-Type', 'application/json');
                            res.send({
                                "code": 500
                                , "msg": "Bestellte Menge höher als im Storage."
                            });
                            return;
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
                    res.write('{"msg":"Checked Out."}');
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
            res.status(400).setHeader('Content-Type', 'application/json');
            res.send({
                "code": 400
                , "msg": util.inspect(errors)
            });
            return;
        }

        var json = req.body;
        json.qty = parseInt(json.qty);
        if (!isNaN(parseInt(json.qty)) && 0 < parseInt(json.qty)) {
            redisClient.hset("cart:" + req.params.id, json.id, json.qty);
            redisClient.expire("cart:" + req.params.id, 3600);
            res.status(200);
             res.write('{"msg":"Item added."}');
            res.end();

        } else {
            res.status(400).setHeader('Content-Type', 'application/json');
            res.send({
                "code": 400
                , "msg": "Ungültige Anzahl."
            });
            return;
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
                res.status(400).setHeader('Content-Type', 'application/json');
                res.send({
                    "code": 400
                    , "msg": "Fehler in der Datenbank."
                });
                return;
            } else {
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
                res.status(400).setHeader('Content-Type', 'application/json');
                res.send({
                    "code": 400
                    , "msg": "Fehler in der Datenbank."
                });
                return;
            } else {
                res.status(200);
                 res.write('{"msg":"Cart deleted"}');
            }
            res.end();

        });
    }
};