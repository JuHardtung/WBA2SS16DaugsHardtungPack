var rp = require('request-promise');

module.exports = {


  getUsers: function (req, res, next) {

      var options = {
          uri: 'http://127.0.0.1:3000/user/'
          , headers: {
              'User-Agent': 'Request-Promise'
          }
          , json: true // Automatically parses the JSON string in the response
      };

      rp(options)
          .then(function (response) {
              var data = {
                  title: 'Warenkorb'
                  , users: response
                  , session: req.session
              };

              res.render('user/users', data);

          })
          .catch(function (err) {
              res.status(500);
              res.render('error', err.response);
          });


  },


  deleteUser: function (req, res, next) {

      var options = {
          uri: 'http://127.0.0.1:3000/user/'+req.query.id,
          method: 'DELETE'
          , headers: {
              'User-Agent': 'Request-Promise'
          }
          , json: true // Automatically parses the JSON string in the response
      };

      rp(options)
          .then(function (response) {
                res.status(200);
                res.send('OK');

          })
          .catch(function (err) {
              res.status(500);
              res.send('Fail');
          });


  },


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
            uri: 'http://127.0.0.1:3000/user',
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

    loginalt: function (req, res) {
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

    login: function (req, res) {
        var user = req.body.userName;
        var passwd = req.body.password;
        var remember = req.body.remember;
        var options = {
            uri: 'http://127.0.0.1:3000/user?name='+user,
            method: 'GET',
            headers: {
                'User-Agent': 'Request-Promise',
            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function (response) {
              console.log(response);
              if(passwd==response.passwd){
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

      var id = req.session.userId;

      var options = {
          uri: 'http://127.0.0.1:3000/user/'+id,
          method: 'GET',
          headers: {
              'User-Agent': 'Request-Promise',
          },
          json: true // Automatically parses the JSON string in the response
      };
      rp(options)
          .then(function (response) {
            var data = {
                title: 'Einstellungen',
                session: req.session,
                userdata: response
            };
            res.render('settings', data);
          })
          .catch(function (err) {
              res.redirect('/404');
          });


    },



    changeData: function (req, res) {

        if ((req.body.password !== undefined) && (req.body.mail == undefined)) {

            var password = req.body.password;
            var id = req.session.userId;

            var options = {
                uri: 'http://127.0.0.1:3000/user/'+id+'/password',
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
                uri: 'http://127.0.0.1:3000/user/'+id+'/mail',
                method: 'PATCH',
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': {
                        "mail": mail,
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
