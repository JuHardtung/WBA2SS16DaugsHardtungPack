var ejs = require('ejs');
var session = require('express-session');
var rp = require('request-promise');



module.exports = {

    addArticle: function(req, res, next) {
      if(req.session.userName=='admin'){
        var data = {
            title: 'Artikel',
            session: req.session
        };
        res.render('articles/detailedit', data);
      }else{
      res.redirect('/404');
    }
    },

    deleteArticle: function(req, res, next) {
      if(req.session.userName=='admin'){
        var options = {
            method: 'DELETE',
            uri: 'http://127.0.0.1:3000/article/'+req.body.id,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function(response) {
                res.status(200);
                res.send('Artikel wurde gelöscht!');
                return;
            })
            .catch(function(err) {
              res.status(200);
              res.send('Es ist ein Fheler aufgetreten!');
              return;
            });

      }else{
            res.staus(200);
            res.send('Keine Berechtigung!');
    }
    },

    getAll: function(req, res, next) {

        var options = {
            uri: 'http://127.0.0.1:3000/article',
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function(response) {
                var data = {
                    title: 'Artikel',
                    articles: response,
                    session: req.session
                };

                res.render('articles/all', data);

            })
            .catch(function(err) {
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
