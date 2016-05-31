var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var redis = require('redis');

var app = express();
var jsonParser = bodyParser.json();
var client = redis.createClient(),
    multi;
//var auth = require('./config/auth');
var authhelper = require('./config/authhelper');
var warenkorbhelper = require('./config/shoppingcarthelper');
app.use(cookieParser());
app.use(bodyParser());

var lager = [{
    artikel: "Ball",
    anzahl: 11,
    preis: 9.99
}, {
    artikel: "Zahnbürste",
    anzahl: 45,
    preis: 2.50
}, {
    artikel: "Schreibtisch",
    anzahl: 2,
    preis: 79.99
}, {
    artikel: "Schreibtischlampe",
    anzahl: 19,
    preis: 14.99
}];

app.use(bodyParser.json());


app.use(express.static('./public'));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.end(err.status + ' ' + err.messages);
});

app.use(function(req, res, next) {
    console.log('Time: %d ' + ' Request-Pfad: ' + req.path, Date.now());
    next();
});

app.get('/lager', function(req, res) {
    authhelper.checksid(req.cookies.connect, function(err, status) {
        if (status == 1 && req.cookies.connect !== undefined) {
            if (req.query.anzahl !== undefined) {

                var filteredData = lager.filter(function(value, index, arr) {
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
        } else {
            res.status(404).send("Kein Zugriff").end();
        }

    });

});

app.post('/users', jsonParser, function(req, res) {
    console.log(req.body);
    res.writeHead(200, "OK");
    res.write(req.body.user);
    res.end();
});

app.get('/login/fehler', function(req, res) {
    var html = '<p>Anmeldung fehlgeschlagen!</p>';
    //res.writeHead(200, "OK");
    res.status(200);
    res.send(html);
    res.end();
});

app.get('/logout', function(req, res) {
    if (req.cookies.connect !== undefined) {
        authhelper.logout(req.cookies.connect, function(err, status) {
            if(status==1){
            res.clearCookie('connect');
            res.status(200);
            res.send("done");
            res.end();
          }else{
            res.status(501);
            res.send("Internal Server Error");
            res.end();
          }
        });
    }else{
      res.status(200);
      res.send("Keine aktive Session!");
      res.end();
    }
});


app.route('/signup')
    .get(function(req, res) {
        var html = '<form action="/signup" method="post">' +
            'Your name: <input type="text" name="user"><br>' +
            'Your Password: <input type="password" name="passwd"><br>' +
            '<button type="submit">Submit</button>' +
            '</form>';
        //res.writeHead(200, "OK");
        res.send(html);
        //res.end();
    })
    .post(function(req, res) {
        authhelper.signup(req.bod.user, req.body.passwd);
        res.send(200);
        res.end();

    });

app.route('/login')
    .get(function(req, res) {
        var html = '<form action="/login" method="post">' +
            'Your name: <input type="text" name="user"><br>' +
            'Your Password: <input type="password" name="passwd"><br>' +
            '<button type="submit">Submit</button>' +
            '</form>';

        //res.writeHead(200, "OK");
        res.send(html);
        //res.end();

    })
    .post(function(req, res) {
        authhelper.login(req.body.user, req.body.passwd, function(err, status, token) {
            if (err) {
                res.redirect('/login/fehler');
                return res.end();
            }
            res.cookie('connect', token, {
                maxAge: 900000,
                httpOnly: true
            });
            res.redirect('/lager');
            res.end();


        });

    });



app.listen(3000);
