var rp = require('request-promise');



module.exports = {


    logout: function(req, res) {
        req.session.destroy();
        res.redirect('/');
    },

    post: function(req, res) {
        var user = req.body.userName;
        var passwd = req.body.password;
        var options = {
            uri: 'http://127.0.0.1:3000/login',
            method: 'POST',
            headers: {
                'User-Agent': 'Request-Promise',
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': {
                    "user": user,
                    "passwd": passwd
                }.length
            },
            body: {

                    "user": user,
                    "passwd": passwd

            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function(response) {
                req.session.userName = user;
                req.session.userId = response.id;
                res.redirect('/');
            })
            .catch(function(err) {
                var data = {
                    message: "Artikel konnten nicht angezeigt werden!",
                    code: res.statusCode
                };
                res.render('error', err);
            });
    }
};
