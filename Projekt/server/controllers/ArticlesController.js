var redis = require('redis');
var redisClient = redis.createClient();
var expressValidator = require('express-validator');

var ARTICLES = 'articles'; //die DB-Liste mit den IDs aller Artikel
//Artikel einzeln als key unter article:*id* gespeichert (Inhalt in JSON-Format)

/*
 * check if article with given ID exists
 * @param {array} articleList
 * @param {int} id
 * @return {int} existing id
 */
function articleIdExists(articleList, id) {
    var result = null;
    articleList.forEach(function(entry) {
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
    getArticles: function(req, res, next) {

        redisClient.lrange(ARTICLES, 0, -1, function(err, obj) {
            if (obj.length === 0) {
                res.status(500);
                res.write("ArtikelListe ist leer");
                res.end();
            } else {

                var articles = [];
                for (var item in obj) {
                    articles[item] = "article:" + obj[item];
                    console.log(articles[item]);
                }

                redisClient.mget(articles, function(err, obj) {
                    if (err) {
                        res.status(500);
                        res.write("Fehler beim Bekommen von Artikeln");
                        res.end;
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
    getArticleById: function(req, res, next) {

        var _id = parseInt(req.params.id);

        redisClient.lrange(ARTICLES, 0, -1, function(err, reply) {
            console.log("Bekomme Artikel mit der ID " + _id);
            if (err) {
                console.log(err);
                res.status(500);
                res.end();
            }

            var _articleID = articleIdExists(reply, _id);
            if (_articleID === null) {
                console.log("Es existiert kein Artikel mit ID: " + _id);
                res.status(404);
                res.end();
            } else {
                var _articleById = 'article:' + _articleID;
                redisClient.get(_articleById, function(err, reply) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.end();
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
    addArticle: function(req, res, next) {
        console.log("afaf");
        req.checkBody('id', 'Invalid ArticleID').notEmpty().isInt();
        req.checkBody('name', 'Invalid ArticleName').notEmpty();
        req.checkBody('description', 'Invalid ArticleDescription').notEmpty();
        req.checkBody('price', 'Invalid ArticlePrice').notEmpty().isFloat();
        req.checkBody('storage', 'Invalid ArticleStorage').notEmpty().isInt();
        var errors = req.validationErrors();
        if (errors) {
            console.log(errors);
            res.status(400).write('There have been validation errors!');
            res.end();
        } else {

            redisClient.get("next_article_id", function(err, next) {
                if(err){
                  console.log(err);
                }
                var newArticle = req.body;

                redisClient.rpush(ARTICLES, next, function(err, reply) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.end();
                    }

                    var article = "article:" + next;
                    redisClient.set(article, JSON.stringify(newArticle), function(err, reply) {
                        console.log("Neuen Artikel mit ID " + next + " erstellt.");
                        res.status(200).json(newArticle);
                        res.end();
                    });
                });
            redisClient.incr("next_article_id");
            });
        }
    },

    /**
     * delete an article with given id from database
     * @param {int} id
     */
    delArticle: function(req, res, next) {

        var _id = parseInt(req.params.id);

        redisClient.lrange(ARTICLES, 0, -1, function(err, reply) {
            console.log("Lösche Artikel mit der ID " + _id);
            if (err) {
                res.status(500);
                res.end();
            }
            var _articleID = articleIdExists(reply, _id);
            if (_articleID === null) {
                res.status(404);
                res.write("Artikel existiert nicht");
                res.end();
            } else {
                var _articleById = 'article:' + _articleID;
                redisClient.lrem(ARTICLES, 0, _articleID, function(err) {
                    if (err) {
                        res.status(500);
                        res.end();
                    }
                });
                redisClient.del(_articleById, function(err, reply) {
                    if (err) {
                        res.status(500);
                        res.end();
                    }
                    res.status(200).json(reply);
                });
            }
        });
    }
};
