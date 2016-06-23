var ejs = require('ejs');
var session = require('express-session');
var rp = require('request-promise');



module.exports = {


    getAll: function(req, res, next) {
        console.log(req.session.userName);

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


    }
};
