var rp = require('request-promise');

module.exports = {

    push: function (req, res) {

        var data = {
            session: req.session
        };
        res.render('admin/push', data);
    },

    logout: function (req, res) {
        req.session.destroy();
        res.redirect('/');
    },



    signup: function (req, res) {
        var data = {
            session: req.session
        };
        res.render('user/signup', data);
    },


    signuppost: function (req, res) {
        var user = req.body.userName;
        var passwd = req.body.password;
        var mail = req.body.mail;
        var options = {
            uri: 'http://127.0.0.1:3000/user/new',
            method: 'POST',
            headers: {
                'User-Agent': 'Request-Promise',
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': {
                    "user": user,
                    "passwd": passwd,
                    "mail": mail
                }.length
            },
            body: {

                "user": user,
                "passwd": passwd,
                "mail": mail

            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function (response) {

                res.status(200);
                res.send(response);

            })
            .catch( function (err) {
                res.send(err.response.body);
            });
    },

    login: function (req, res) {
        var user = req.body.userName;
        var passwd = req.body.password;
        var remember = req.body.remember;
        var options = {
            uri: 'http://127.0.0.1:3000/user',
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
            .then(function (response) {
              console.log(response);
              if(response.type=="err"){
                res.send("Fail");
              }else{
                req.session.userName = user;
                req.session.userId = response.id;
                if (remember == "on") {
                    req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                }
                res.send("OK");
                }
            })
            .catch(function (err) {
                res.send("Fail");
            });
    },


    settings: function (req, res) {

        var data = {
            title: 'Einstellungen',
            session: req.session
        };
        res.render('settings', data);
    },

    changeData: function (req, res) {

        if ((req.body.password !== undefined) && (req.body.mail == undefined)) {

            var password = req.body.password;
            var id = req.session.userId;

            var options = {
                uri: 'http://127.0.0.1:3000/user/password',
                method: 'PATCH',
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': {
                        "passwd": password,
                        "id": id
                    }.length
                },
                body: {
                    "passwd": password,
                    "id": id
                },
                json: true // Automatically parses the JSON string in the response
            };
            rp(options)
                .then(function (response) {
                    req.session.userName = user;
                    req.session.userId = response.id;
                    if (remember == "on") {
                        req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                    }
                    res.send("OK");
                })
                .catch(function (err) {
                    res.send("Fail");
                });

        } else if ((req.body.password == undefined) && (req.body.mail != undefined)) {

            var mail = req.body.mail;
            var id = req.session.userId;

            var options = {
                uri: 'http://127.0.0.1:3000/user/mail',
                method: 'PATCH',
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': {
                        "mail": mail,
                        "id": id
                    }.length
                },
                body: {
                    "mail": mail,
                    "id": id
                },
                json: true // Automatically parses the JSON string in the response
            };
            rp(options)
                .then(function (response) {
                    req.session.userName = user;
                    req.session.userId = response.id;
                    if (remember == "on") {
                        req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                    }
                    res.send("OK");
                })
                .catch(function (err) {
                    res.send("Fail");
                });
        } else {
            console.log("ES HAT ALLET JEFAILED");
        }



    }



};
