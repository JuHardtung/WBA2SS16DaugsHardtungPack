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
                res.status(200);
                res.send(response.body);
            })
            .catch(function (err) {
                res.status(500);
                res.send(err.response.body);
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
            var options = {
                method: 'DELETE',
                uri: 'http://127.0.0.1:3000/article/' + req.body.id,
                headers: {
                    'User-Agent': 'Request-Promise'
                    , 'Content-Type': 'application/json; charset=utf-8'
                },
                json: true // Automatically parses the JSON string in the response
            };

            rp(options)
                .then(function (response) {
                res.status(200);
                res.send(response);
                })
                .catch(function (err) {
                res.status(500);
                res.send(err.response.body);
                });
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
                res.status(200);
                res.render('articles/all', data);

            })
            .catch(function (err) {
                res.render('error',  err.response);
            });


    },

    getArticle: function (req, res, next) {

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
                res.status(200);
                res.render('articles/detail', data);

            })
            .catch(function (err) {
                res.render('error',  err.response);
            });


    }
};
