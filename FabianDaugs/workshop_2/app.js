var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var jsonParser = bodyParser.json();

app.use(bodyParser.json());

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

app.get('/warenkorb/:id', function(req, res){

    if (req.params.id == 42) {
         res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }, null, 3));


    } else {
        res.write('User not found.');
    }


    res.end();
});

app.post('/users', jsonParser, function (req, res){
  console.log(req.body);
  res.writeHead(200, "OK");
  res.write(req.body.user);
  res.end();
});



app.listen(3000);
