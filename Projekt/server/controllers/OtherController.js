var redis = require('redis');
var redisClient = redis.createClient();




//Datenbank säubern
function cleanDB() {
    redisClient.del(['ARTICLE', 'USER'], function (err, reply) {
        console.log("Datenbank wurde geleert! " + reply);
    });
}
//Datenbank Grunddaten erstellen
function initDB() {
    var article1 = {
        "id": 1,
        "name": "Ball",
        "beschreibung": "Das ist ein runder und ganz toller Ball!",
        "preis": 9.99,
        "lageranzahl": 45
    };
    var article2 = {
        "id": 2,
        "name": "Auto",
        "beschreibung": "Das ist ein rotes Spielzeugauto!",
        "preis": 14.99,
        "lageranzahl": 14
    };
    var article3 = {
        "id": 3,
        "name": "Hammer",
        "beschreibung": "Das ist ein toller Hammer!",
        "preis": 19.99,
        "lageranzahl": 3
    };


    redisClient.rpush(['ARTICLE', '1', '2', '3'], function (err, reply) {
        console.log(reply);
    });

    redisClient.mset("article:1", JSON.stringify(article1), "article:2", JSON.stringify(article2), "article:3", JSON.stringify(article3), function (err, reply) {
        console.log("Artikel hinzugefügt! Reply: " + reply);
    });

    var user1 = {
        "id": 1,
        "vorname": "Max",
        "nachname": "Mustermann",
        "email": "m.mustermann@muster.de",
        "passwort": "musterpwd123"
    };

    var user2 = {
        "id": 2,
        "vorname": "Karl",
        "nachname": "Karlsson",
        "email": "k.karlsson@gmx.de",
        "passwort": "karlpasswort"
    };

    redisClient.rpush(['USER', '1', '2'], function (err, reply) {
        console.log(reply);
    });

    redisClient.mset("user:1", JSON.stringify(user1), "user:2", JSON.stringify(user2), function (err, reply) {
        console.log("User hinzugefügt! Reply: " + reply);
    });

}

//Aufrufen um die Datenbank zu säubern und mit den Standartdaten zu befüllen
module.exports = {

    resetDB: function (req, res) {
        cleanDB();
        initDB();
        res.status(httpStatus.OK).end();
    }
};