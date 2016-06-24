var ejs = require('ejs');
var session = require('express-session');
var rp = require('request-promise');



module.exports = {


    getCart: function (req, res, next) {

        var options = {
            uri: 'http://127.0.0.1:3000/cart/' + req.session.userId,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function (response) {
                var data = {
                    title: 'Warenkorb',
                    articles: response,
                    session: req.session
                };

                res.render('articles/cart', data);

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

    addItem: function (req, res, next) {

        console.log("ID IS: " + req.body.id);
        console.log("QTY IS: " + req.body.quantity);

        var artid = req.body.id;
        //TODO quantity immer 1... muss noch vom input mit id="quantity" bekommen werden
        var quantity = req.body.quantity;


        var options = {
            uri: 'http://127.0.0.1:3000/cart/' + req.session.userId,
            method: 'POST',
            headers: {
                'User-Agent': 'Request-Promise'
            },
            body: {
                "id": artid,
                "qty": quantity
            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function (response) {
                var data = {
                    title: 'Warenkorb',
                    articles: response,
                    session: req.session
                };

                res.render('articles/cart', data);

            })
            /*  .catch(function (err) {
                  var data = {
                      message: "Artikel konnten nicht angezeigt werden!",
                      code: res.statusCode,
                      validation: res.validation
                  };
                  res.render('error', err);
                  console.log(err);
              });*/


    }
};