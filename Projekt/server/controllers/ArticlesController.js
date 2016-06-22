var redis = require('redis');
var redisClient = redis.createClient();

//überprüfe, ob Inhalt eines Artikels valide ist
function isValidArticle(article) {
    if (article === undefined) {
        return false;
    }
    if (article.id === undefined) {
        return false;
    }
    if (article.name === undefined) {
        return false;
    }
    if (article.description === undefined) {
        return false;
    }
    if (article.price === undefined) {
        return false;
    }
    if (article.storage === undefined) {
        return false;
    }
    return true;
}

//überprüfe, ob ein Artikel mit bestimmter ID existiert
function articleIDexists(articleList, id) {
    var result = null;
    articleList.forEach(function (entry) {
        if (entry == id) {
            result = entry;
        }
    });
    return result;
}

module.exports = {

    //gibt alle vorhandenen Artikel aus
    getArticles: function (req, res, next) {

        redisClient.lrange("articles", 0, -1, function (err, obj) {
            if (obj.length === 0) {
                res.status(500);
                res.write('list empty!');
                res.end();
            } else {
                console.log(obj[1] + obj);

                var articles = [];
                for (var item in obj) {
                    articles[item] = "article:" + obj[item];
                    console.log(articles[item]);
                }

                redisClient.mget(articles, function (err, obj) {
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


    //gibt Artikel mit bestimmter ID zurück
    //erreichbar über http://localhost:3000/article/id?articleId=
    getArticleById: function (req, res, next) {

        var _id = parseInt(req.query.articleId);

        redisClient.lrange('articles', 0, -1, function (err, reply) {
            console.log("Bekomme Artikel mit der ID " + _id);

            var _articleID = articleIDexists(reply, _id);
            if (_articleID === null) {
                res.status(404);
                res.end();
            } else {
                _articleById = 'article:' + _articleID;
                redisClient.get(_articleById, function (err, reply) {
                    res.status(200).json(reply);
                });
            }
        });
    },

    //füge neue Artikel zur Datenbank hinzu (JSON im body angeben)
    //TODO Artikelid muss bis jetzt noch mit im Body angegeben werden,
    //damit die id mit in den Artikelinfos gespeichert wird
    addArticle: function (req, res, next) {
        redisClient.lrange('articles', 0, -1, function (err, reply) {
            var _id;
            var laenge = reply.length;
            if (laenge == 0) {
                _id = 1;
            } else {
                _id = parseInt(laenge) + 1;
            }
            var newArticle = req.body;

            if (isValidArticle(newArticle) === true) {
                redisClient.rpush('articles', _id, function (err, reply) {
                    var article = "article:" + _id;
                    redisClient.set(article, JSON.stringify(newArticle), function (err, reply) {
                        console.log("Neuen Artikel mit ID " + _id + " erstellt.");
                        res.status(200).json(newArticle);
                        res.end();
                    });
                });
            }
        });
    },

    //entferne Artikel mit angegebener ID
    delArticle: function (req, res, next) {

        var _id = parseInt(req.query.articleId);

        redisClient.lrange('articles', 0, -1, function (err, reply) {
            console.log("Lösche Artikel mit der ID " + _id);

            var _articleID = articleIDexists(reply, _id);
            if (_articleID === null) {
                res.status(404);
                res.write("Artikel existiert nicht");
                res.end();
            } else {
                _articleById = 'article:' + _articleID;
                redisClient.lrem('articles', 0, _articleID, function (err) {
                    if (err) {
                        throw err;
                    }
                });
                redisClient.del(_articleById, function (err, reply) {
                    res.status(200).json(reply);
                });
            }
        });
    }
};
