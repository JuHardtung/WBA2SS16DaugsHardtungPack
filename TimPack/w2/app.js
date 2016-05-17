var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.listen(1335);

app.use(express.static('./public'));


app.use(function(req,res,next) {
    console.log('Time: %d ' + ' Req-Path: ' + req.path, Date.now());
    next();
});

app.get('/warenkorb', function(req, res){
    
    res.writeHead(200, "OK");
    res.write('jooooo');
    res.end();
});