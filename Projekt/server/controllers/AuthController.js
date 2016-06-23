var redis = require('redis');
var client = redis.createClient();
var nodemailer = require('nodemailer');
var util = require('util');

module.exports = {


    checksid: function(req, res, next) {
        console.log(req.session);
        //client.hexists("auths", req.session, function(err, exits) {
        //    if (err) throw (err);
        //    callback(null, exits);
        //});
    },

    namefromtoken: function(req, res, next) {
        client.hget("auths", req.session, function(err, id) {
            if (err) throw (err);
            client.hget("user:" + id, "name", function(err, name) {
                if (err) throw (err);

            });
        });
    },

    logout: function(req, res, next) {
        client.hexists("auths", req.session, function(err, exits) {
            if (exits == 1) {
                client.hget("auths", req.session, function(err, id) {
                    if (err) throw (err);
                    client.hdel("user:" + id, "auths");
                    client.hdel("auths", req.session);
                    callback(null, 1);
                });
            } else {
                callback("Kein Cookie gefunden", 0);
            }
        });
    },


    signup: function(req, res, next) {
        req.checkBody('user', 'Invalid Username').notEmpty();
        req.checkBody('passwd', 'Invalid Password').notEmpty();
        req.checkBody('mail', 'Invalid Mail').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send('There have been validation errors: ' + util.inspect(errors));
            return;
        }

        client.hget("users", req.body.user, function(err, resp) {
            if (resp) {
                res.status(200);
                res.write("username taken");
            } else {


                client.get("next_user_id", function(err, next) {
                    client.hmset(["user:" + next, "name", req.body.user, "passwd", req.body.passwd, "mail", req.body.mail], function(err, res) {});
                    client.hset("users", req.body.user, next);
                });
                // create reusable transporter object using the default SMTP transport
                var transporter = nodemailer.createTransport('smtps://awsomeshop.noreply%40gmail.com:awsomeshop69@smtp.gmail.com');

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: '"Awsome Shop" <awsomeshop.noreply@gmail.com>', // sender address
                    to: req.body.mail, // list of receivers
                    subject: 'Herzlich willkommen im Awsomeshop!', // Subject line
                    text: 'Hi ' + req.body.user + ',\n\nwilkommen im Awsome Shop. Hier kannst du viele tolle Produkte erwerben! \n Einfach Artikel in den Warenkorb legen und kaufen! Dein Warenkorb bleibt übrigens auch bestehen, wenn du dich ausloggst ;) \n\n Also, wir sehen uns im Cyberspace! \n\n Dein \n Awsome Shop Team', // plaintext body
                    html: 'Hi <b>' + req.body.user + '</b>,<br><br>wilkommen im Awsome Shop. Hier kannst du viele tolle Produkte erwerben! <br> Einfach Artikel in den Warenkorb legen und kaufen! Dein Warenkorb bleibt übrigens auch bestehen, wenn du dich ausloggst ;) <br><br> Also, wir sehen uns im Cyberspace! <br><br> Dein <br> <br> <b>Awsome Shop Team</b>' // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
                client.incr("next_user_id");
                res.sendStatus(200);
            }
            res.end();
        });
    },

    login: function(req, res, next) {
        console.log(req.body.user);
        console.log(req.body.passwd);
        var user = req.body.user;
        var passwd = req.body.passwd;
        client.hexists("users", user, function(err, exits) {
            if (err) {
                throw err;
            }

            client.hget("users", user, function(err, id) {
                if (err) {
                    return res.redirect('/login/fehler');
                }
                client.hget("user:" + id, "passwd", function(err, dbpasswd) {
                    if (err) {
                        return res.redirect('/login/fehler');
                    }


                    if (passwd !== dbpasswd) {

                        return res.status(401).send({
                            "id": id,
                            "message": "Username oder passwort falsch!"
                        });
                    } else {
                        res.status(200).send({
                            "id": id,
                            "message": "Successfully logged in!"
                        });
                    }
                });
            });
        });


    }
};
