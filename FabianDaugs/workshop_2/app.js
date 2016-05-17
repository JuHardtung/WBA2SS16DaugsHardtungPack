var express = require('express');
var bodyparser = require('body-parser');

var app = express();

app.use(express.static(_dirname+ '/public'));

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.end(err.status+' '+err.messages);
});

app.use(function(req,res,next){
  console.log('Time: %d '+' Request-Pfad: '+req.path, Date.now());
  next();
});
