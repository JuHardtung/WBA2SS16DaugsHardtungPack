var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var redis = require('redis');
var httpStatus = require('http-status-codes');

var app = express();
var jsonParser = bodyParser.json();
var client = redis.createClient(),
    multi;
//var auth = require('./config/auth');
var authhelper = require('./config/authhelper');
//var warenkorbhelper = require('./config/shoppingcarthelper');
app.use(cookieParser());
//app.use(bodyParser());

app.use(bodyParser.json());
app.use(express.static('./public'));


//Datenbank säubern
function cleanDB() {
    client.del(['ARTICLE', 'USER'], function (err, reply) {
        console.log("Datenbank wurde geleert! " + reply);
    });
}

//Datenbank initialisieren, damit jeder mit den gleichen Daten arbeiten kann
//########################################################
//### rufe am Anfang http://localhost:3000/resetDB auf ###
//########################################################

function initDB() {
    var article0 = {
        "id": 0,
        "name": "Ball",
        "beschreibung": "Das ist ein runder und ganz toller Ball!",
        "preis": 9.99,
        "lageranzahl": 45
    };
    var article1 = {
        "id": 1,
        "name": "Auto",
        "beschreibung": "Das ist ein rotes Spielzeugauto!",
        "preis": 14.99,
        "lageranzahl": 14
    };
    var article2 = {
        "id": 2,
        "name": "Hammer",
        "beschreibung": "Das ist ein toller Hammer!",
        "preis": 19.99,
        "lageranzahl": 3
    };

    var paramsArticle = ['ARTICLE', JSON.stringify(article0), JSON.stringify(article1), JSON.stringify(article2)];

    client.rpush(paramsArticle, function (err, reply) {
        console.log("Artikel hinzugefügt! Reply: " + reply);
    });

    var user0 = {
        "id": 0,
        "vorname": "Max",
        "nachname": "Mustermann",
        "email": "m.mustermann@muster.de",
        "passwort": "musterpwd123"
    };

    var user1 = {
        "id": 1,
        "vorname": "Karl",
        "nachname": "Karlsson",
        "email": "k.karlsson@gmx.de",
        "passwort": "karlpasswort"
    };

    client.rpush('USER', JSON.stringify(user0), JSON.stringify(user1), function (err, reply) {

        console.log("Benutzer hinzugefügt! Reply: " + reply);
    });

}

//Aufrufen um die Datenbank zu säubern und mit den Standartdaten zu befüllen
app.get('/resetDB', jsonParser, function (req, res) {
    cleanDB();
    initDB();
    res.status(httpStatus.OK).end();
});


app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.end(err.status + ' ' + err.messages);
});

app.use(function (req, res, next) {
    console.log('Time: %d ' + ' Request-Pfad: ' + req.path, Date.now());
    next();
});

//Kann benutzt werden, um einen Error der Datenbank abzufragen
function errorInDatabase(res, err) {
    if (err != null) {
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

//überprüfe, ob Inhalt eines User valide ist
function isValidUser(user) {
    if (user === undefined) {
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

function isAuthenticated(req, res, next) {
    if (req.cookies.connect !== undefined) {
        client.hexists("auths", req.cookies.connect, function (err, exits) {
            if (err) throw (err);
            if (exits == 1) {
                return next();
            }
        });

    } else {
        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.redirect('/login');
    }
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

//Filtert alle User in der Datenbank nach einer bestimmten ID
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


/*#####################################################################################
####                        	                                                   ####
####                                    ARTIKEL                                    #### 
####                                                                               #### 
#######################################################################################*/
//gibt alle vorhandenen Artikel aus
app.get('/article/all', function (req, res) {
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
});

//gibt Artikel mit bestimmter ID zurück
//erreichbar über http://localhost:3000/article/id?articleId=
app.get('/article/id', function (req, res) {

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
});

//füge neue Artikel zur Datenbank hinzu (JSON im body angeben)
app.post('/article/add', jsonParser, function (req, res) {
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
});

//entferne Artikel mit angegebener ID
app.get('/article/delete', function (req, res) {
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
});


/*#####################################################################################
####                        	                                                   ####
####                                    USER                                       #### 
####                                                                               #### 
#######################################################################################*/

//gibt alle vorhandenen User aus
app.get('/user/all', function (req, res) {
    client.lrange('USER', 0, -1, function (err, reply) {
        if (!errorInDatabase(res, err)) {
            console.log("Bekomme alle User!");
            if (reply === null) {
                res.status(httpStatus.NOT_FOUND);
            } else {
                res.status(httpStatus.OK).json(reply);
            }
        }
    });
});

//gibt User mit bestimmter ID zurück
//erreichbar über http://localhost:3000/user/id?userId=
app.get('/user/id', function (req, res) {

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
});

//füge neue USER zur Datenbank hinzu (JSON im body angeben)
app.post('/user/add', jsonParser, function (req, res) {
    client.llen('USER', function (err, reply) {
        if (!errorInDatabase(res, err)) {
            var _id;
            if (reply === null) {
                _id = 0;
            } else {
                _id = reply;
            }
            var newUSER = req.body;

            if (isValidUser(newUSER) === true) {
                client.rpush('USER', JSON.stringify(newUSER), function (err, reply) {
                    if (!errorInDatabase(res, err)) {
                        if (reply !== _id) {
                            console.log("Neuen User mit ID " + _id + " erstellt.");
                            res.status(httpStatus.OK).json(newUSER);
                        }
                    }
                });
            }
        }
    });
});

//entferne User mit angegebener ID
app.get('/user/delete', function (req, res) {
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
});


/*#####################################################################################
####                        	                                                   ####
####                                    PLATZHALTER                                #### 
####                                                                               #### 
#######################################################################################*/




app.get('/lager', isAuthenticated, function (req, res) {


    if (req.query.anzahl !== undefined) {

        var filteredData = lager.filter(function (value, index, arr) {
            return value.anzahl == req.query.anzahl;
        });

        if (filteredData.length >= 1) {
            res.status(200).send(filteredData);
        } else {
            res.status(404).send("Kein Artikel gefunden!").end();
        }
    } else {
        res.json(lager);
        res.end();
    }

});

app.post('/users', jsonParser, function (req, res) {
    console.log(req.body);
    res.writeHead(200, "OK");
    res.write(req.body.user);
    res.end();
});

app.get('/login/fehler', function (req, res) {
    var html = '<p>Anmeldung fehlgeschlagen!</p>';
    //res.writeHead(200, "OK");
    res.status(200);
    res.send(html);
    res.end();
});

app.get('/logout', function (req, res) {
    if (req.cookies.connect !== undefined) {
        authhelper.logout(req.cookies.connect, function (err, status) {
            if (status == 1) {
                res.clearCookie('connect');
                res.status(200);
                res.send("done");
                res.end();
            } else {
                res.status(501);
                res.send("Internal Server Error");
                res.end();
            }
        });
    } else {
        res.status(200);
        res.send("Keine aktive Session!");
        res.end();
    }
});


app.route('/signup')
    .get(function (req, res) {
        var html = '<form action="/signup" method="post">' +
            'Your name: <input type="text" name="user"><br>' +
            'Your Password: <input type="password" name="passwd"><br>' +
            '<button type="submit">Submit</button>' +
            '</form>';
        //res.writeHead(200, "OK");
        res.send(html);
        //res.end();
    })
    .post(function (req, res) {
        authhelper.signup(req.body.user, req.body.passwd);
        res.send(200);
        res.end();

    });

app.route('/login')
    .get(function (req, res) {
        var html = '<form action="/login" method="post">' +
            'Your name: <input type="text" name="user"><br>' +
            'Your Password: <input type="password" name="passwd"><br>' +
            '<button type="submit">Submit</button>' +
            '</form>';

        //res.writeHead(200, "OK");
        res.send(html);
        //res.end();

    })
    .post(function (req, res) {
        authhelper.login(req.body.user, req.body.passwd, function (err, status, token) {
            if (err) {
                res.redirect('/login/fehler');
                return res.end();
            }
            res.cookie('connect', token, {
                maxAge: 900000,
                httpOnly: true
            });
            res.send("Successfully logged in!");
            res.end();


        });

    });



app.listen(3000);