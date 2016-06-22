var redis = require('redis');
var client = redis.createClient();


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
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send('There have been validation errors: ' + util.inspect(errors));
            return;
        }
        client.get("next_user_id", function(err, next) {
            client.hmset(["user:" + next, "name", req.body.user, "passwd", req.body.passwd], function(err, res) {});
            client.hset("users", req.body.user, next);
        });
        client.incr("next_user_id");
        res.sendStatus(200);
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

                        return res.status(401).send({"id":id,"message":"Username oder passwort falsch!"});
                    } else {
                        res.status(200).send({"id":id,"message":"Successfully logged in!"});
                    }
                });
            });
        });


    }
};
