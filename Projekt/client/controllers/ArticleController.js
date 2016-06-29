var ejs = require('ejs');
var session = require('express-session');
var rp = require('request-promise');



module.exports = {

    addArticle: function (req, res, next) {


            var name = req.body.name;
            var descr = req.body.descr;
            var price = req.body.price;
            var storage = req.body.storage;

            console.log("Name: " + name + " Descr: " + descr + " Price: " + price + " Storage: " +
                storage);

            var options = {
                uri: 'http://127.0.0.1:3000/article',
                method: 'POST',
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': {
                        "name": name,
                        "description": descr,
                        "price": price,
                        "storage": storage
                    }.length
                },
                body: {
                    "name": name,
                    "description": descr,
                    "price": price,
                    "storage": storage
                },
                json: true // Automatically parses the JSON string in the response
            };


        rp(options)
            .then(function (response) {
                res.send("OK");
            })
            .catch(function (err) {
                res.send("Fail");
            });

    },

    editArticle: function (req, res) {
        if (req.session.userName == 'admin') {
            var data = {
                title: 'Artikel',
                session: req.session
            };
            res.render('articles/addarticle', data);
        } else {
            res.redirect('/404');
        }
    },

    deleteArticle: function (req, res, next) {
        if (req.session.userName == 'admin') {
            var options = {
                method: 'DELETE',
                uri: 'http://127.0.0.1:3000/article/' + req.body.id,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };

            rp(options)
                .then(function (response) {
                    res.status(200);
                    res.send('Artikel wurde gelöscht!');
                    return;
                })
                .catch(function (err) {
                    res.status(200);
                    res.send('Es ist ein Fheler aufgetreten!');
                    return;
                });

        } else {
            res.staus(200);
            res.send('Keine Berechtigung!');
        }
    },

    getAll: function (req, res, next) {

        var options = {
            uri: 'http://127.0.0.1:3000/article',
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function (response) {
                var data = {
                    title: 'Artikel',
                    articles: response,
                    session: req.session
                };

                res.render('articles/all', data);

            })
            .catch(function (err) {
                var data = {
                    message: "Artikel konnten nicht angezeigt werden!",
                    code: res.statusCode,
                    validation: res.validation
                };
                res.render('error', err);
                console.log(err);
            });


    },

    getArticle: function (req, res, next) {
      if(req.query.id==undefined){
      var data = {
            session: req.session
          };
      res.status(404);
      res.render('404', data);}

        var options = {
            uri: 'http://127.0.0.1:3000/article/' + req.query.id,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        rp(options)
            .then(function (response) {
                console.log(response);
                var data = {
                    title: 'Artikel',
                    article: response,
                    session: req.session
                };

                res.render('articles/detail', data);

            })
            .catch(function (err) {
                var data = {
                    message: "Artikel konnte nicht angezeigt werden!",
                    code: res.statusCode,
                    validation: res.validation
                };
                res.render('error', err);
                console.log(err);
            });


    }
};
