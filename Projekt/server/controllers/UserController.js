var redis = require('redis');
var client = redis.createClient();
var Response = require('../helper/ResponseHelper');
var httpStatus = require('http-status-codes');
var expressValidator = require('express-validator');

function errorInDatabase(res, err) {
    if (err !== null) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        return true;
    } else {
        return false;
    }

}

function getUserById(userList, id) {
    var result;
    userList.forEach(function (entry) {
        _json = JSON.parse(entry);
        if (parseInt(_json.id) == id) {
            result = JSON.stringify(_json);

        }
    });
    return result;
}


module.exports = {

    getAll: function (req, res, next) {
        client.lrange('USER', 0, -1, function (err, reply) {
            if (!errorInDatabase(res, err)) {
                console.log("Bekomme alle User!");
                if (reply === null) {
                    res.status(httpStatus.NOT_FOUND);
                } else {
                    res.status(httpStatus.OK).end(reply + "");
                }
            }
        });
    },

    getUser: function (req, res, next) {

        var _userId = parseInt(req.query.userId);

        client.lrange('USER', 0, -1, function (err, reply) {
            if (!errorInDatabase(res, err)) {
                console.log("Bekomme User mit der ID " + _userId);

                var _user = getUserById(reply, _userId);
                if (_user === null) {
                    res.status(httpStatus.NOT_FOUND);
                } else {
                    res.status(httpStatus.OK).json(_user);
                }
            }
        });
    },

    add: function (req, res, next) {
        req.checkBody('user.id', 'Invalid UserId').notEmpty().isInt();
        req.checkBody('user.vorname', 'Invalid Vorname').notEmpty().isString();
        req.checkBody('user.nachname', 'Invalid Nachname').notEmpty().isString();
        req.checkBody('user.email', 'Invalid email').notEmpty().isString();
        req.checkBody('user.passwort', 'Invalid password').notEmpty().isString();
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send('There have been validation errors: ' + util.inspect(errors));
            return 0;
        }
        client.llen('USER', function (err, reply) {
            if (!errorInDatabase(res, err)) {
                var _id;
                if (reply === null) {
                    _id = 0;
                } else {
                    _id = reply;
                }
                var newUSER = req.body;

                client.rpush('USER', JSON.stringify(newUSER), function (err, reply) {
                    if (!errorInDatabase(res, err)) {
                        if (reply !== _id) {
                            console.log("Neuen User mit ID " + _id + " erstellt.");
                            res.status(httpStatus.OK).json(newUSER);
                        }
                    }
                });
            }
        });
    },

    delete: function (req, res, next) {
        var _userId = parseInt(req.query.userId);
        console.log(_userId);

        client.lrange('USER', 0, -1, function (err, reply) {
            if (!errorInDatabase(res, err)) {
                console.log("Lösche User mit der ID: " + _userId);

                var _user = getUserById(reply, _userId);
                if (_user === null) {
                    res.status(httpStatus.NOT_FOUND);
                } else {
                    client.lrem('USER', 1, _user);
                }
            }
        });
        res.end();
    }

};