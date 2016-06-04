var redis = require('redis');
var redisClient = redis.createClient();

//Kann benutzt werden, um einen Error der Datenbank abzufragen
function errorInDatabase(res, err) {
    if (err !== null) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        return true;
    } else {
        return false;
    }

}

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
    if (article.beschreibung === undefined) {
        return false;
    }
    if (article.preis === undefined) {
        return false;
    }
    if (article.lageranzahl === undefined) {
        return false;
    }
    return true;
}

//Filtert alle Artikel in der Datenbank nach einer bestimmten ID
function getArticelById(articleList, id) {
    var result;
    articleList.forEach(function (entry) {
        _json = JSON.parse(entry);
        if (parseInt(_json.id) == id) {
            result = JSON.stringify(_json);

        }
    });
    return result;
}

module.exports = {

    //gibt alle vorhandenen Artikel aus
    getArticles: function (req, res, next) {
        client.lrange('ARTICLE', 0, -1, function (err, reply) {
            if (!errorInDatabase(res, err)) {
                console.log("Bekomme alle Artikel!");
                if (reply === null) {
                    res.status(httpStatus.NOT_FOUND);
                } else {
                    res.status(httpStatus.OK).json(reply);
                }
            }
        });
    },

    //gibt Artikel mit bestimmter ID zurück
    //erreichbar über http://localhost:3000/article/id?articleId=
    getArticleById: function (req, res, next) {

        var _articleId = parseInt(req.query.articleId);

        client.lrange('ARTICLE', 0, -1, function (err, reply) {
            if (!errorInDatabase(res, err)) {
                console.log("Bekomme Artikel mit der ID " + _articleId);

                var _article = getArticelById(reply, _articleId);
                if (_article === null) {
                    res.status(httpStatus.NOT_FOUND);
                } else {
                    res.status(httpStatus.OK).json(_article);
                }
            }
        });
    },

    //füge neue Artikel zur Datenbank hinzu (JSON im body angeben)
    addArticle: function (req, res, next) {
        client.llen('ARTICLE', function (err, reply) {
            if (!errorInDatabase(res, err)) {
                var _id;
                if (reply === null) {
                    _id = 0;
                } else {
                    _id = reply;
                }
                var newArticle = req.body;

                if (isValidArticle(newArticle) === true) {
                    client.rpush('ARTICLE', JSON.stringify(newArticle), function (err, reply) {
                        if (!errorInDatabase(res, err)) {
                            if (reply !== _id) {
                                console.log("Neuen Artikel mit ID " + _id + " erstellt.");
                                res.status(httpStatus.OK).json(newArticle);
                            }
                        }
                    });
                }
            }
        });
    },

    //entferne Artikel mit angegebener ID
    delArticle: function (req, res, next) {
        var _articleId = parseInt(req.query.articleId);
        console.log(_articleId);

        client.lrange('ARTICLE', 0, -1, function (err, reply) {
            if (!errorInDatabase(res, err)) {
                console.log("Lösche Artikel mit der ID: " + _articleId);

                var _article = getArticelById(reply, _articleId);
                if (_article === null) {
                    res.status(httpStatus.NOT_FOUND);
                } else {
                    client.lrem('ARTICLE', 1, _article);
                }
            }
        });
        res.end();
    }
};
