// SERVER SETUP
// =========================================================
var express = require('express');
var bodyParser = require('body-parser');
var Validator = require('express-validator');
var http = require('http');
var Faye = require('faye');




global.__coreDir = __dirname + "/";
global.__port = 3000;

// EXPRESS SETUP
// =========================================================
var app = express();
app.set('port', __port);
app.disable('x-powered-by');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));

// Customize the Express Validator
app.use(Validator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while (namespace.length) {
            formParam.push('[' + namespace.shift() + ']');
        }

        return {
            param: formParam,
            message: msg,
            value: value
        };
    },

    // Eigene Validationsregeln
    customValidators: {
        validPrice: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value) && value >= 0;
        }
    }
}));



// REDIS SETUP
// =========================================================
var redis = false;
redis = require('redis');
redisClient = redis.createClient();


redisClient.on("error", function(err) {
    redis = false;
    console.error("Error connecting to redis");
});

redisClient.on("connect", function(err) {
    redis = true;
    console.error("Connected to redis");
});

redisClient.on("disconnect", function(err) {
    redis = false;
    console.error("Connected to redis");
});

app.use(function(req, res, next) {
    if (redis) {
        next();
    } else {
        res.status(500);
        res.send({"code":500, "msg":"Interner Serverfehler", "type":"err"});
    }
});

/*var redisClient = redis.createClient({
    retry_strategy: function(options) {
        console.log(options);
        if (options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            console.log('hallo');
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.max(options.attempt * 100, 3000);
    }
});
*/

// ROUTEN
// =========================================================
var routes = require('./router');
app.use('/', routes);


// ERROR HANDLING AND OUTPUT PROCESSING
// =========================================================
app.use(function(err, req, res, next) {
    if (err) {
        res.status(err.code || 500);
        res.send(err);
    } else {
        // No error occured so we proceed with the actual response \o/
        next();
    }
});

app.use(function(req, res, next) {
    if (req.response !== undefined) {
        res.json(req.response);
    }
    // Catch 404s
    else {
        res.status(404);
        res.send({"code":404, "msg":"Ressource nicht gefunden", "type":"err"});
    }
});

// START WEBSERVER
// =========================================================
app.listen(__port);
console.log("Server started on Port: " + __port);


// FAYE
// =========================================================

var server = http.createServer();

var bayeux = new Faye.NodeAdapter({
    mount: '/faye',
    //timeout: 45
});


bayeux.attach(server);

var client = new Faye.Client("http://localhost:10000/faye");

var endpoint = "http://localhost:10000/faye";


var sub = new Faye.Client(endpoint);
var pub = new Faye.Client(endpoint);

bayeux.on('handshake', function(clientId) {
    console.log('handshake: ' + clientId);
});

bayeux.on('subscribe', function(clientId, channel) {
    console.log(clientId + ' to ' + channel);
});

bayeux.on('publish', function(clientId, channel, data) {
    console.log(clientId + ', ' + channel + ', ' + data);
});



// START FAYESERVER
server.listen(10000, function() {
    console.log("Server listens on port: 10000");
});
