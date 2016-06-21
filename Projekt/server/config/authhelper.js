var redis = require('redis');
var client = redis.createClient();
var tokenHelper = require('./tokenHelper');



exports.checksid = function(sid, callback) {
    client.hexists("auths", sid, function(err, exits) {
        if (err) throw (err);
        callback(null, exits);
    });
};

exports.namefromtoken = function(sid, callback) {
    client.hget("auths", sid, function(err, id) {
        if (err) throw (err);
        client.hget("user:" + id, "name", function(err, name) {
            if (err) throw (err);

        });
    });
};

exports.logout = function(sid,callback) {
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
};


exports.signup = function(user, passwd) {
    client.get("next_user_id", function(err, next) {
        if (err) throw (err);
        client.hmset(["user:" + next, "name", user, "passwd", passwd], function(err, res) {});
        client.hset("users", user, next);
    });
    client.incr("next_user_id");
};

exports.login = function(user, passwd, callback) {

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

};
