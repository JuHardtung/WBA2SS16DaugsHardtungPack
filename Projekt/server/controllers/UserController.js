var redis = require('redis');
var redisClient = redis.createClient();
var Response = require('../helper/ResponseHelper');
var expressValidator = require('express-validator');

var USERS = 'users'; //die DB-Liste mit den IDs aller Benutzer
//Benutzer einzeln als key unter user:*id* gespeichert (Inhalt in JSON-Format)

function errorInDatabase(res, err) {
    if (err !== null) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        return true;
    } else {
        return false;
    }

}

function isValidUser(user) {
    if (user == undefined) {
        return false;
    }
    if (user.id === undefined) {
        return false;
    }
    if (user.vorname === undefined) {
        return false;
    }
    if (user.nachname === undefined) {
        return false;
    }
    if (user.email === undefined) {
        return false;
    }
    if (user.passwort === undefined) {
        return false;
    }
    return true;
}

//überprüfe, ib ein User mit bestimmter ID existiert
function userIdExists(userList, id) {
    var result = null;
    userList.forEach(function (entry) {
        if (entry == id) {
            result = entry;
        }
    });
    return result;
}

module.exports = {

    //gibt alle vorhandenen Benutzer aus
    getAll: function (req, res, next) {

        redisClient.lrange(USERS, 0, -1, function (err, obj) {
            if (obj.length === 0) {

                res.status(500).write("UserListe ist leer").end();
            } else {
                console.log(obj[1] + obj);

                var users = [];
                for (var item in obj) {
                    users[item] = "user:" + obj[item];
                    console.log(users[item]);
                }

                redisClient.mget(users, function (err, obj) {
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

    //gibt Benutzer mit bestimmter ID zurück
    //erreichbar unter http://localhost:3000/user/id?userId=
    getUser: function (req, res, next) {

        var _id = parseInt(req.query.userId);

        redisClient.lrange(USERS, 0, -1, function (err, reply) {
            console.log("Bekomme User mit der ID " + _id);

            var _userID = userIdExists(reply, _id);
            if (_userID === null) {
                res.status(404);
                res.end();
            } else {
                var _userById = 'user:' + _userID;
                redisClient.get(_userById, function (err, reply) {
                    res.status(200).json(reply);
                });
            }
        });
    },

    //füge neue User zur Datenbank hinzu (JSON im body angeben)
    //TODO UserID muss bis jetzt noch mit im Body angegeben werden,
    //damit die ID mit in den UserInfos gespeichert wird
    add: function (req, res, next) {

        redisClient.lrange(USERS, 0, -1, function (err, reply) {
            var _id;
            var laenge = reply.length;
            if (laenge == 0) {
                _id = 1;
            } else {
                _id = parseInt(laenge) + 1;
            }
            var newUser = req.body;

            if (isValidUser(newUser) === true) {
                redisClient.rpush(USERS, _id, function (err, reply) {
                    var user = "user:" + _id;
                    redisClient.set(user, JSON.stringify(newUser), function (err, reply) {
                        console.log("Neuen User mit ID " + _id + " erstellt.");
                        res.status(200).json(newUser);
                    });
                });
            }
        });
    },

    delete: function (req, res, next) {

        var _id = parseInt(req.query.userId);

        redisClient.lrange(USERS, 0, -1, function (err, reply) {
            console.log("Lösche User mit der ID " + _id);

            var _userID = userIdExists(reply, _id);
            if (_userID === null) {
                res.status(404);
                res.write("User existiert nicht");
                res.end();

            } else {
                var _userById = 'user:' + _userID;
                redisClient.lrem(USERS, 0, _userID, function (err) {
                    if (err) {
                        res.status(404);
                        res.write("User konnte nicht gelöscht werden");
                        res.end();
                    }
                });
                redisClient.del(_userById, function (err, reply) {
                    res.status(200).json(reply);
                });
            }
        });
    }
};