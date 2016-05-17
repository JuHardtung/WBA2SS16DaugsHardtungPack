var express = require('express');
var bodyParser = require('body-parser')
var app = express();


app.use(express.static('./public'));


app.use(function(req,res,next) {
    console.log('Time: %d ' + ' Req-Path: ' + req.path, Date.now());
    next();
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

app.post('/kaufen',bodyParser, function(req,res){
    
    
    
});


app.listen(1335);