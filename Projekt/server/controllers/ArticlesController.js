
var expressValidator = require('express-validator');
var Faye = require('faye');
var util = require('util');
//var Faye = require('faye');


var ARTICLES = 'articles'; //die DB-Liste mit den IDs aller Artikel
//Artikel einzeln als key unter article:*id* gespeichert (Inhalt in JSON-Format)
//var client = new Faye.Client("http://localhost:10000/faye");
/*
 * check if article with given ID exists
 * @param {array} articleList
 * @param {int} id
 * @return {int} existing id
 */
function articleIdExists(articleList, id) {
    var result = null;
    articleList.forEach(function (entry) {
        if (entry == id) {
            result = entry;
        }
    });
    return result;
}





module.exports = {
    /**
     * return all articles from database
     * @return {application/json} Article
     */
    getArticles: function (req, res, next) {
        redisClient.lrange(ARTICLES, 0, -1, function (err, obj) {
            if (err) {
                res.status(500);
                res.end();
            }
            if (obj.length === 0) {
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.write('[]');
                res.end();
            } else {

                var articles = [];
                for (var item in obj) {
                    articles[item] = "article:" + obj[item];
                }

                redisClient.mget(articles, function (err, obj) {
                    if (err) {
                        res.status(500).setHeader('Content-Type', 'application/json');
                        res.send({
                            "code": 500
                            , "msg": "Fehler beim auslesen der Artikel!"
                            , "type": "err"
                        });
                    }
                    var list;

                    for (var j in obj) {
                        if (j == 0 && obj.length == 1) {
                            list = obj[j];
                        } else if (j == 0) {
                            list = obj[j] + ", ";
                        } else if (j < obj.length - 1) {
                            list = list + obj[j] + ", ";
                        } else {
                            list = list + obj[j];
                        }
                    }

                    res.status(200);
                    res.setHeader('Content-Type', 'application/json');
                    res.send('[' + list + ']');
                    res.end();
                });
            }
        });
    },

    /**
     * return article with given id
     * @param {int} id
     * @return {application/json} Article
     */
    getArticleById: function (req, res, next) {

        var _id = parseInt(req.params.id);

        redisClient.lrange(ARTICLES, 0, -1, function (err, reply) {
            console.log("Bekomme Artikel mit der ID " + _id);
            if (err) {
                res.status(500).setHeader('Content-Type', 'application/json');
                res.send({
                    "code": 500
                    , "msg": "Fehler beim auslesen des Artikels!"
                    , "type": "err"
                });
            }

            var _articleID = articleIdExists(reply, _id);
            if (_articleID === null) {
                res.status(400).setHeader('Content-Type', 'application/json');
                res.send({
                    "code": 400
                    , "msg": "Kein Artikel mit der gesuchten ID gefunden."
                    , "type": "err"
                });
            } else {
                var _articleById = 'article:' + _articleID;
                redisClient.get(_articleById, function (err, reply) {
                    if (err) {
                        res.status(500).setHeader('Content-Type', 'application/json');
                        res.send({
                            "code": 500
                            , "msg": "Fehler beim auslesen des Artikels!"
                            , "type": "err"
                        });
                    }
                    res.status(200).json(JSON.parse(reply));
                });
            }
        });
    },

    /**
     * add a new article to database (in JSON-format)
     * @param {int} id
     * @param {string} name
     * @param {string} description
     * @param {float} price
     * @param {int} storage
     */
    //TODO ArtikelID muss bis jetzt noch mit im Body angegeben werden,
    //damit die id mit in den Artikelinfos gespeichert wird

    addArticle: function (req, res, next) {
        req.checkBody('name', '-Ungültiger Artikelname').notEmpty();
        req.checkBody('description', '-Ungültiger Artikelbeschreibung').notEmpty();
        req.checkBody('price', '-Ungültiger Artikelpreis').isFloat();
        req.checkBody('storage', '-Ungültige Artikelmenge').isInt();

        var errors = req.validationErrors();
        if (errors) {
            res.status(500).setHeader('Content-Type', 'application/json');
            var errstr="";
            for (par in errors) {
                errstr = errstr + errors[par].message + "\n";
            }
            res.send({
                "code": 500
                , "msg": errstr
            });
            return;
        }


            redisClient.get("next_article_id", function (err, next) {
                if (err) {
                    res.status(500).setHeader('Content-Type', 'application/json');
                res.send({"code":500, "msg":"Fehler beim auslesen des Artikelzählers!", "type":"err"});
                }

                var newArticle = req.body;
                if (next == undefined) {
                    newArticle.id = 1;
                    redisClient.incr("next_article_id");
                } else {
                    newArticle.id = next;
                }
                redisClient.incr("next_article_id");

                redisClient.rpush(ARTICLES, newArticle.id, function (err, reply) {
                    if (err) {
                         res.status(500).setHeader('Content-Type', 'application/json');
                res.send({"code":500, "msg":"Fehler beim hinzufügen des Artikels!", "type":"err"});
                    }

                    var article = "article:" + newArticle.id;
                    redisClient.set(article, JSON.stringify(newArticle), function (err, reply) {
                        console.log("Neuen Artikel mit ID " + newArticle.id + " erstellt.");
                        res.status(200).json(newArticle);
                        res.end();
                    });
                });

            });
    },

    /**
     * delete an article with given id from database
     * @param {int} id
     */
    delArticle: function (req, res, next) {

        var _id = parseInt(req.params.id);

        redisClient.lrange(ARTICLES, 0, -1, function (err, reply) {
            console.log("Lösche Artikel mit der ID " + _id);
            if (err) {
                res.status(500).setHeader('Content-Type', 'application/json');
                res.send({"code":500, "msg":"Fehler beim löschen des Artikels!", "type":"err"});
            }
            var _articleID = articleIdExists(reply, _id);
            if (_articleID === null) {
                res.status(500).setHeader('Content-Type', 'application/json');
                res.send({"code":500, "msg":"Zu löschender Artikel existiert nicht.", "type":"err"});
            } else {
                var _articleById = 'article:' + _articleID;
                redisClient.lrem(ARTICLES, 0, _articleID, function (err) {
                    if (err) {
                        res.status(500).setHeader('Content-Type', 'application/json');
                res.send({"code":500, "msg":"Fehler beim Löschen des Artikels!", "type":"err"});
                    }
                });
                redisClient.del(_articleById, function (err, reply) {
                    if (err) {
                       res.status(500).setHeader('Content-Type', 'application/json');
                res.send({"code":500, "msg":"Fehler beim Löschen des Artikels!", "type":"err"});
                    }
                    res.status(200);
                    res.setHeader('Content-Type', 'application/json');
                    res.write('{"msg":"Artikel gelöscht."}');
                    res.end();
                });
            }
        });
    }
};