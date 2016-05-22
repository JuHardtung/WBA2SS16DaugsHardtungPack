var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var jsonParser = bodyParser.json();

var lager = [
    {
        artikel: "Ball",
        anzahl: 11,
        preis: 9.99
        },
    {
        artikel: "Zahnbürste",
        anzahl: 45,
        preis: 2.50
        },
    {
        artikel: "Schreibtisch",
        anzahl: 2,
        preis: 79.99
        },
    {
        artikel: "Schreibtischlampe",
        anzahl: 19,
        preis: 14.99
        }
        ];

app.use(bodyParser.json());

app.use(express.static('./public'));

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.end(err.status + ' ' + err.messages);
});

app.use(function (req, res, next) {
    console.log('Time: %d ' + ' Request-Pfad: ' + req.path, Date.now());
    next();
});


app.get('/warenkorb', function (req, res) {

    res.writeHead(200, "OK");
    res.write('Dies ist der Warenkorb.');
    res.end();
});

app.get('/warenkorb/:id', function (req, res) {

    if (req.params.id == 42) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            a: 1
        }, null, 3));


    } else {
        res.write('User not found.');
    }


    res.end();
});

app.get('/lager', function (req, res) {

    if (req.query.anzahl != undefined) {

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
    }
});

app.post('/users', jsonParser, function (req, res) {
    console.log(req.body);
    res.writeHead(200, "OK");
    res.write(req.body.user);
    res.end();
});



app.listen(3000);