var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var jsonParser = bodyParser.json();


app.use(express.static('./public'));

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.end(err.status+' '+err.messages);
});

app.use(function(req,res,next){
  console.log('Time: %d '+' Request-Pfad: '+req.path, Date.now());
  next();
});


app.get('/warenkorb', function(req, res){

    res.writeHead(200, "OK");
    res.write('jooooo');
    res.end();
});


app.post('/users', jsonParser, function (req, res){
  res.writeHead(200, "OK");
  res.write('done');
  res.end();
});

app.listen(3000);
