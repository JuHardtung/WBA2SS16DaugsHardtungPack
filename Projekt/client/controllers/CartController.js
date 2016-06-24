var ejs = require('ejs');
var session = require('express-session');
var rp = require('request-promise');



module.exports = {


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
                var data = {
                    title: 'Warenkorb'
                    , articles: response
                    , session: req.session
                };
                console.log(response);
                res.send("OK");

            })
            .catch(function (err) {
                res.send("Fail");
            });


    },

    deleteItem: function (req, res, next) {
        var itemid = req.query.id;
        var options = {

            uri: 'http://127.0.0.1:3000/cart/' + req.session.userId +'?itemid='+itemid
            , method: 'PATCH'
            , headers: {
                'User-Agent': 'Request-Promise'
            , }
            , json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function (response) {
                res.send("Item deleted.");

            })
            .catch(function (err) {
                res.send("Fail");
            });
    }
};