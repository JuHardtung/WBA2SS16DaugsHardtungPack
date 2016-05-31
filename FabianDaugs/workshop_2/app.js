var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var redis = require('redis');

var app = express();
var jsonParser = bodyParser.json();
var	client	=	redis.createClient();
var auth = require('./config/auth');
app.use(cookieParser());
app.use(bodyParser());

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
    }
});

app.post('/users', jsonParser, function (req, res) {
    console.log(req.body);
    res.writeHead(200, "OK");
    res.write(req.body.user);
    res.end();
});


app.route('/login')
  .get(function(req, res) {
    var html = '<form action="/login" method="post">' +
             'Your name: <input type="text" name="user"><br>' +
             'Your Password: <input type="password" name="passwd"><br>' +
             '<button type="submit">Submit</button>' +
             '</form>';
    if (req.cookies.connect!==undefined) {
    html += '<br>Your username from your session is: ' + req.cookies.connect;
  }
  console.log('Cookies: ', req.cookies);
  res.send(html);

  })
  .post(function(req, res) {
    var userData = {id:1, firstname: req.body.user, lastname: req.body.passwd};

    auth.createAndStoreToken(userData, 60*60, function(err, token) {
      if (err) {
        console.log(err);

        return res.send(400);
      }



    res.cookie('connect.sid',token,{ maxAge: 900000, httpOnly: true, userName: "Fapsi" });
    res.redirect('/login');
    //res.send(200, token);
    res.end();
  });

});



app.listen(3000);
