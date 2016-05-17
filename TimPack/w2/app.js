var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req,res,next) {
    console.log('Time: %d ' + ' Req-Path: ' + req.path, Date.now());
    next();
});


app.get('/warenkorb/:id', function(req, res){  
    if (req.params.id == 42) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ money: 516 }, null, 3));    
    } else {
        res.write('User not found.');
    }
    res.end();
});


app.post('/login',function(req,res){
    var user_name=req.body.user;
    var password=req.body.password;
    console.log("User name = "+user_name+", password is "+password);
    if (user_name == "test" && password == "123456789") {
        console.log('Welcome!');
    }
    res.end();
});

app.listen(3000,function(){
  console.log("Listing on port 3000");
})