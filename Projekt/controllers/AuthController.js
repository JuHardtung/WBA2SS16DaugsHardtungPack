var redis = require('redis');
var client = redis.createClient();
var Response = require('../helper/ResponseHelper');
var tokenHelper = require('../config/tokenHelper');


module.exports = {


checksid:  function(sid, callback) {
    client.hexists("auths", sid, function(err, exits) {
        if (err) throw (err);
        callback(null, exits);
    });
},

namefromtoken : function(sid, callback) {
    client.hget("auths", sid, function(err, id) {
        if (err) throw (err);
        client.hget("user:" + id, "name", function(err, name) {
            if (err) throw (err);

        });
    });
},

logout : function(sid,callback) {
    client.hexists("auths", sid, function(err, exits) {
        if (exits == 1) {
            client.hget("auths", sid, function(err, id) {
                if (err) throw (err);
                client.hdel("user:" + id, "auths");
                client.hdel("auths", sid);
                callback(null,1);
            });
        }else{
          callback("Kein Cookie gefunden",0);
        }
    });
},


signup : function(req, res, next) {
    console.log(req.body.user);
    client.get("next_user_id", function(err, next) {
        client.hmset(["user:" + next, "name", req.body.user, "passwd", req.body.passwd], function(err, res) {});
        client.hset("users", req.body.user, next);
    });
    client.incr("next_user_id");
    res.sendStatus(200);
    res.end();
},

signupGet : function (req, res, next) {
    var html = '<form action="/signup" method="post">' +
        'Your name: <input type="text" name="user"><br>' +
        'Your Password: <input type="password" name="passwd"><br>' +
        '<button type="submit">Submit</button>' +
        '</form>';
        res.send(html);
        return next();
      },

login : function(user, passwd, callback) {

    tokenHelper.createToken(function(err, token) {
        if (err) {
            console.log(err);

            return res.send(400);
        }
        client.hexists("users", user, function(err, exits) {
            if (err) throw (err);

            client.hget("users", user, function(err, id) {
                if (err) throw (err);
                client.hget("user:" + id, "passwd", function(err, dbpasswd) {
                    if (err) throw (err);


                    if (passwd !== dbpasswd) {
                        callback("User oder Passwort falsch!", 0);
                    } else {
                        client.hset("user:" + id, "auth", token);
                        client.hset("auths", token, id);
                        callback(null, 1, token);
                    }
                });
            });
        });
    });

}
};
