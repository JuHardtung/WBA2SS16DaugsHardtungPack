var ejs = require('ejs');
var session = require('express-session');
var rp = require('request-promise');

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

module.exports = {

    addArticle: function (req, res, next) {


            var name = req.body.name;
            var descr = req.body.descr;
            var price = req.body.price;
            var storage = req.body.storage;
            var category = req.body.category.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue").replace(/ß/g, "ss");

            console.log("Name: " + name + " Descr: " + descr + " Price: " + price + " Storage: " +
                storage);

            var options = {
                uri: 'http://127.0.0.1:3000/article?category='+category.toLowerCase(),
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

      var options = {
          uri: 'http://127.0.0.1:3000/category',
          headers: {
              'User-Agent': 'Request-Promise'
          },
          json: true // Automatically parses the JSON string in the response
      };

      rp(options)
          .then(function (response) {
            categorys = response;

            for(var i = 0; i < categorys.length; i++){
              categorys[i] = toTitleCase( categorys[i]);
            }
            var data = {
                title: 'Artikel',
                session: req.session,
                categorys : categorys
            };
            res.render('articles/addarticle', data);
          })
          .catch(function (err) {
              res.render('error',  err.response);
          });
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
      var categorys = [];
      var options1 = {
          uri: 'http://127.0.0.1:3000/category',
          headers: {
              'User-Agent': 'Request-Promise'
          },
          json: true // Automatically parses the JSON string in the response
      };

      rp(options1)
          .then(function (response) {
            categorys = response;

            for(var i = 0; i < categorys.length; i++){
              categorys[i] = toTitleCase( categorys[i]);
            }

//============================================================================================//

        var uri;
        if(req.query.category){
          uri = 'http://127.0.0.1:3000/article?category='+req.query.category.toLowerCase();
          console.log('mit');
        }else{
          uri = 'http://127.0.0.1:3000/article';
          console.log('ohne');
        }
        var options = {
            uri: uri,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };


        rp(options)
            .then(function (response) {
                var data = {
                    title: 'Artikel',
                    categorys : categorys,
                    articles: response,
                    session: req.session
                };
                res.status(200);
                res.render('articles/all', data);

            })
            .catch(function (err) {
                res.render('error',  err.response);
            });

          })
          .catch(function (err) {
              res.render('error',  err.response);
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
                res.status(200);
                res.render('articles/detail', data);

            })
            .catch(function (err) {
                res.render('error',  err.response);
            });


    }
};
