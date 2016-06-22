var redis = require('redis');
var redisClient = redis.createClient();

var ARTICLES = 'articles'; //die DB-Liste mit den IDs aller Artikel
//Artikel einzeln als key unter article:*id* gespeichert (Inhalt in JSON-Format)

var USERS = 'users'; //die DBlListe mit den IDs aller User
//User einzeln als key unter user:*id* gespeichert (Inhalt in JSON-Format)


//Datenbank säubern (nur zur eigenen Hilfe und NICHT für den späteren Gebrauch)
function cleanDB() {
    redisClient.flushall(function (err, reply) {
        if (err) {
            console.log("Fehler beim Leeren der Datenbank aufgetreten");
        } else {
            console.log("Datenbank wurde geleert!");
        }
    });
}
//Datenbank Grunddaten erstellen
function initDB() {

    //Artikel 1, 2, 3
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


    redisClient.rpush([ARTICLES, '1', '2', '3'], function (err, reply) {
        if (err) {
            console.log("Fehler beim Erstellen der ArticleList aufgetreten");
        }
    });

    redisClient.mset("article:1", JSON.stringify(article1), "article:2", JSON.stringify(article2), "article:3", JSON.stringify(article3), function (err, reply) {
        if (err) {
            console.log("Ein Fehler beim Erstellen der einzelnen Artikel aufgetreten");
        } else {
            console.log("Artikel hinzugefügt! Reply: " + reply);

        }
    });

    //User 1, 2
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

    redisClient.rpush([USERS, '1', '2'], function (err, reply) {
        if (err) {
            console.log("Fehler beim Erstellen der UserList aufgetreten");
        }
    });

    redisClient.mset("user:1", JSON.stringify(user1), "user:2", JSON.stringify(user2), function (err, reply) {
        if (err) {
            console.log("Ein Fehler beim Erstellen der einzelnen User aufgetreten");
        } else {
            console.log("User hinzugefügt! Reply: " + reply);
        }
    });


    //Warenkorb für User 1
    var cart1 = [
        {
            "id": 1,
            "quantity": 5
        }, {
            "id": 3,
            "quantity": 7

        }
    ]
    redisClient.mset("cart:1", JSON.stringify(cart1), function (err, reply) {
        if (err) {
            console.log("Es ist ein Fehler beim Erstellen des Warenkorbes aufgetreten!");
        } else {
            console.log("Warenkorb für User 1 erstellt: Reply: " + reply);
        }
    });

}

//Aufrufen um die Datenbank zu säubern und mit den Standartdaten zu befüllen
module.exports = {

    resetDB: function (req, res) {
        cleanDB();
        initDB();
        res.status(200).end();
    }
};