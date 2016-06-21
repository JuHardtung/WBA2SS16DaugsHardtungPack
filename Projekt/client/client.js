
// SERVER SETUP
// =========================================================
var express         = require('express');
var bodyParser      = require('body-parser');
var ejs             = require('ejs');
var session         = require('express-session');
var uuid            = require('node-uuid');
var cookieParser    = require('cookie-parser');
var connect         = require('connect');
var methodOverride  = require('method-override');

global.__coreDir = __dirname+"/";
global.__port    = 3001;

// EXPRESS SETUP
// =========================================================
var app = express();

app.set('port', __port);
app.disable('x-powered-by');

app.use(cookieParser()); // for using persistent sessions
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view cache', false);
app.set('layout', 'default');

app.use(express.static('public'));
app.use(session({
  genid: function(req) {
    return uuid.v4() ;// use UUIDs for session IDs
  },
  resave: false,
  saveUninitialized: true,
  secret: 'karsten loves taccos!'
}));

// ROUTES
// =========================================================
var routes = require('./router');
app.use('/', routes);

// ERROR HANDLING AND OUTPUT PROCESSING
// =========================================================
app.use(function (err, req, res, next) {
  if(err) {
    res.status(err.code || 500);
    console.log(err);
    try {
      res.render('error', err.stack);
    }
    catch(e) {
      res.render('error', err);
    }
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
      res.render('error', { code: 404, message: 'Page not found' });
    }
});

// START WEBSERVER
// =========================================================
app.listen(__port);

process.on('uncaughtException', function(err) {
  if(err.code === "EADDRINUSE") {
    console.log("It seems that the PORT "+__port+" is already in use by another application.");
    process.exit(0);
  }
  else {
    console.log("An uncaught Exception occured: "+err.toString());
  }
});
