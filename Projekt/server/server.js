// SERVER SETUP
// =========================================================
var express      = require('express');
var bodyParser   = require('body-parser');
var Validator    = require('express-validator');
var Response     = require('./helper/ResponseHelper');
var http         = require('http');


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
//app.use(morgan('dev'));

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
