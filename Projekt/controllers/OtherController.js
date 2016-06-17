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

    redisClient.rpush(paramsArticle, function (err, reply) {
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

    redisClient.rpush('USER', JSON.stringify(user0), JSON.stringify(user1), function (err, reply) {

        console.log("Benutzer hinzugefügt! Reply: " + reply);
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