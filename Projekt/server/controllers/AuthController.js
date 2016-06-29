
var nodemailer = require('nodemailer');
var util = require('util');



module.exports = {

    signup: function (req, res, next) {
        req.checkBody('user', 'Invalid Username').notEmpty();
        req.checkBody('passwd', 'Invalid Password').notEmpty();
        req.checkBody('mail', 'Invalid Mail').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).setHeader('Content-Type', 'application/json');
            res.send({"code":400, "msg":"Es sind Validierungsfehler aufgetreten:"+util.inspect(errors), "type":"err"});
            return;
        }

        redisClient.hget("users", req.body.user, function (err, resp) {
            if (resp) {
                res.status(200).setHeader('Content-Type', 'application/json');
                res.send({"code":200, "msg":"Benutzername bereits vergeben!", "type":"err"});
                return;
            } else {


                redisClient.get("next_user_id", function (err, next) {

                    var newUserId;

                    if (next == undefined) {
                        newUserId = 1;
                        redisClient.incr("next_user_id");
                    } else {
                        newUserId = next;
                    }

                    redisClient.hmset(["user:" + newUserId, "name", req.body.user, "passwd", req.body.passwd, "mail", req.body.mail], function (err, res) {});
                    redisClient.hset("users", req.body.user, newUserId);
                });
                // create reusable transporter object using the default SMTP transport
                var transporter = nodemailer.createTransport('smtps://awesomeshop.noreply%40gmail.com:awesomeshop69@smtp.gmail.com');

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: '"Awesome Shop" <awesomeshop.noreply@gmail.com>', // sender address
                    to: req.body.mail, // list of receivers
                    subject: 'Herzlich willkommen im Awesomeshop!', // Subject line
                    text: 'Hi ' + req.body.user + ',\n\nwilkommen im Awesome Shop. Hier kannst du viele tolle Produkte erwerben! \n Einfach Artikel in den Warenkorb legen und kaufen! Dein Warenkorb bleibt übrigens auch bestehen, wenn du dich ausloggst ;) \n\n Also, wir sehen uns im Cyberspace! \n\n Dein \n Awesome Shop Team', // plaintext body
                    html: 'Hi <b>' + req.body.user + '</b>,<br><br>wilkommen im Awesome Shop. Hier kannst du viele tolle Produkte erwerben! <br> Einfach Artikel in den Warenkorb legen und kaufen! Dein Warenkorb bleibt übrigens auch bestehen, wenn du dich ausloggst ;) <br><br> Also, wir sehen uns im Cyberspace! <br><br> Dein <br> <br> <b>Awesome Shop Team</b>' // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
                redisClient.incr("next_user_id");
                res.status(201).setHeader('Content-Type', 'application/json');
                res.send({"code":201, "msg":"Benutzer erfoldgreich erstellt!", "type":"ok"});
            }
            res.end();
        });
    },

    login: function (req, res, next) {
      req.checkBody('user', 'Invalid Username').notEmpty();
      req.checkBody('passwd', 'Invalid Password').notEmpty();
      var errors = req.validationErrors();
      if (errors) {
          res.status(400).setHeader('Content-Type', 'application/json');
          res.send({"code":400, "msg":"Es sind Validierungsfehler aufgetreten:"+util.inspect(errors), "type":"err"});
          return;
      }

        var user = req.body.user;
        var passwd = req.body.passwd;
        redisClient.hexists("users", user, function (err, exits) {
            if (err) {
              res.status(200).setHeader('Content-Type', 'application/json');
              res.send({"code":200, "msg":"User nicht vorhanden" , "type":"err"});
              return;
            }


            redisClient.hget("users", user, function (err, id) {
                if (err) {
                  res.status(500).setHeader('Content-Type', 'application/json');
                  res.send({"code":500, "msg":"Es ist ein Fehler aufgetreten!", "type":"err"});
                  return;
                }
                redisClient.hget("user:" + id, "passwd", function (err, dbpasswd) {
                    if (err) {
                      res.status(500).setHeader('Content-Type', 'application/json');
                      res.send({"code":500, "msg":"Es ist ein Fehler aufgetreten!", "type":"err"});
                      return;
                    }
                    if (passwd !== dbpasswd) {
                      res.status(500).setHeader('Content-Type', 'application/json');
                      res.send({"code":200, "msg":"Passwort falsch", "type":"err"});
                      return;
                    } else {
                        res.status(200).send({
                            "id": id,
                            "msg": "Successfully logged in!"
                        });
                    }
                });
            });
        });


    },
    updatePWD: function (req, res) {

        req.checkBody('passwd', 'Invalid PWD').notEmpty();
        req.checkBody('id', 'Invalid ID').notEmpty().isInt();

        var errors = req.validationErrors();
        if (errors) {
            res.status(400).setHeader('Content-Type', 'application/json');
            res.send({"code":400, "msg":"Es sind Validierungsfehler aufgetreten:"+util.inspect(errors), "type":"err"});
            return;
        }

        var currentUser = 'user:' + req.body.id;
        var newPwd = req.body.passwd;
        //console.log("USER: " + currentUser + "neues PWD: " + newPwd);

        redisClient.hset(currentUser, "passwd", newPwd, function (err, resp) {
            if (err) {
                console.log("Failed to change " + currentUser + "PWD to: " + newPwd);
                res.status(500).setHeader('Content-Type', 'application/json');
                res.send({"code":500, "msg":"Passwort ändern gescheitert", "type":"err"});
                return;
            } else {

                console.log("Changed " + currentUser + " PWD to: " + newPwd);
                res.status(200).setHeader('Content-Type', 'application/json');
                res.send({"code":200, "msg":"Passwort erfolgreich geändert", "type":"ok"});
            }


        });
    },


    updateMail: function (req, res) {

        req.checkBody('mail', 'Invalid Mail').notEmpty();
        req.checkBody('id', 'Invalid ID').notEmpty().isInt();

        var errors = req.validationErrors();
        if (errors) {
          res.status(400).setHeader('Content-Type', 'application/json');
          res.send({"code":400, "msg":"Es sind Validierungsfehler aufgetreten:"+util.inspect(errors), "type":"err"});
          return;
        }

        var currentUser = 'user:' + req.body.id;
        var newMail = req.body.mail;
        //console.log("USER: " + currentUser + "neue MAIL: " + newMail);

        redisClient.hset(currentUser, "mail", newMail, function (err, resp) {
            if (err) {
                console.log("Failed to change " + currentUser + "Mail to: " + newMail);
                res.status(500).setHeader('Content-Type', 'application/json');
                res.send({"code":500, "msg":"Email ändern gescheitert", "type":"err"});
                return;
            } else {

                console.log("Changed " + currentUser + " ID to: " + newMail);
                res.status(200).setHeader('Content-Type', 'application/json');
                res.send({"code":200, "msg":"Email erfolgreich geändert", "type":"ok"});
            }
        });
    }
};
