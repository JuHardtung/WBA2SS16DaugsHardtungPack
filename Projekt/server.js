// SERVER SETUP
// =========================================================
var express      = require('express');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var multer       = require('multer');
var Validator    = require('express-validator');
var Response     = require('./helper/ResponseHelper');
var http         = require('http');
//var Faye         = require('faye');

global.__coreDir = __dirname+"/";
global.__port    = 3000;


// EXPRESS SETUP
// =========================================================
var app = express();

app.set('port', __port);
app.disable('x-powered-by');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// Customize the Express Validator
app.use(Validator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.');
    var root = namespace.shift();
    var formParam = root;

    while(namespace.length) {
      formParam.push('[' + namespace.shift() + ']');
    }

    return {
      param: formParam,
      message: msg,
      value: value
    };
  },
  // Custom validation rules
  customValidators: {
    isNumber: function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    },
    validPrice: function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value) && value >= 0;
    }
  }
}));

//app.use(multer()); // for parsing multipart/form-data
app.use(morgan('dev'));

// ROUTES
// =========================================================
var routes = require('./router');
app.use('/', routes);


// ERROR HANDLING AND OUTPUT PROCESSING
// =========================================================
app.use(function (err, req, res, next) {
  if(err) {
    res.status(err.code || 500);
    res.send(err);
  }
  else {
    // No error occured so we proceed with the actual response \o/
    next();
  }
});

app.use(function (req, res, next) {
    if(req.response !== undefined) {
      res.json(req.response);
    }
    // Catch 404s
    else {
      res.status(404);
      res.send(new Response.error(404, 'Ressource not found.'));
    }
});

// START WEBSERVER
// =========================================================
app.listen(__port);
console.log("Server started on Port: "+__port);
/*process.on('uncaughtException', function(err) {
  if(err.code === "EADDRINUSE") {
    console.log("It seems that the PORT "+__port+" is already in use by another application.");
    process.exit(0);
  }
  else {
    console.log("An uncaught Exception occured: "+err.toString());
  }
});

// PUBSUB
// =========================================================
// Faye

/*var server = http.createServer();

var bayeux = new Faye.NodeAdapter({
  mount: '/faye',
  //timeout: 45
});

bayeux.attach(server);

var endpoint = "http://localhost:10000/faye";
console.log(endpoint);
var sub = new Faye.Client(endpoint);
var pub = new Faye.Client(endpoint);

bayeux.on('handshake', function(clientId){
  //console.log('handshake: '  + clientId);
});
bayeux.on('subscribe', function(clientId, channel){
  //console.log(clientId + ' to ' + channel);
});
bayeux.on('publish', function(clientId, channel, data){
  //console.log(clientId + ', ' + channel + ', ' + data);
});

/*
var publishMsg = function(pub, m){
  console.log(m);
  var publication = pub.publish('/news',{
    "author": "S. LEM",
    "content": "Der Unbesiegbare <a href='#'>nö</a>"
  })
  .then(function(){ console.log("pub.published"); } );
};
var subscribeMsg = function(sub, m){
  console.log(m);
  var subscription = sub.subscribe("/news", function(msg){
    console.log("faye sub ::  Name: " + msg.author + " Nachricht: " + msg.content);
  })
  .then(function(){ console.log('sub.subscribed') });
};

server.listen(__port, function(){
  console.log("Server horcht auf port: "+ __port);
});
*/
/*
subscribeMsg(sub, 'subscribe etwas');
publishMsg(pub, 'publish etwas');
*/
