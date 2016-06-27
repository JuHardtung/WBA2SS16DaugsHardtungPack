var ejs = require('ejs');
var session = require('express-session');
var rp = require('request-promise');



module.exports = {

  checkout: function (req, res, next) {
    var options = {

        uri: 'http://127.0.0.1:3000/cart/'+req.session.userId+'/checkout'
        , headers: {
            'User-Agent': 'Request-Promise',
            'Content-Type': 'application/json; charset=utf-8'
          },
          json: true // Automatically parses the JSON string in the response
    };

    rp(options)
        .then(function (response) {
            res.status(200);
            res.send(response.body);

        })
        .catch(function (err) {
            console.log(err.response.body.msg);
            res.status(500);
            res.send(err.response.body);
        });

    },


    getCart: function (req, res, next) {

        var options = {
            uri: 'http://127.0.0.1:3000/cart/' + req.session.userId
            , headers: {
                'User-Agent': 'Request-Promise'
            }
            , json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function (response) {
                var data = {
                    title: 'Warenkorb'
                    , articles: response
                    , session: req.session
                };

                res.render('articles/cart', data);

            })
            .catch(function (err) {
                var data = {
                    message: "Artikel konnten nicht angezeigt werden!"
                    , code: res.statusCode
                    , validation: res.validation
                };
                res.render('error', err);
                console.log(err);
            });


    },


    addItem: function (req, res, next) {
        var id = req.body.id;
        var qty = req.body.qty;
        var options = {

            uri: 'http://127.0.0.1:3000/cart/' + req.session.userId
            , method: 'POST'
            , headers: {
                'User-Agent': 'Request-Promise'
                , 'Content-Type': 'application/json; charset=utf-8'
                , 'Content-Length': {
                    "id": id
                    , "qty": qty
                , }.length
            }
            , body: {
                "id": id
                , "qty": qty
            }
            , json: true // Automatically parses the JSON string in the response

        };

        rp(options)
            .then(function (response) {
                console.log(response.status);
                console.log("ok");
                res.send("OK");

            })
            .catch(function (err) {
              res.end();
            });


    },

    deleteItem: function (req, res, next) {
        var itemid = req.query.id;
        var options = {

            uri: 'http://127.0.0.1:3000/cart/' + req.session.userId +'?itemid='+itemid,
            method: 'PATCH', headers: {
                'User-Agent': 'Request-Promise',
              },
              json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function (response) {
                res.redirect('/cart');

            })
            .catch(function (err) {
                res.send("Fail");
            });
    }
};
