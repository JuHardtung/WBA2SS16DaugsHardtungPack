var express = require("express");
var bodyParser = require("body-parser");
var redis = require("redis");
var app = express();


redisClient = redis.createClient();


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    console.log('Time: %d ' + ' Req-Path: ' + req.path, Date.now());
    next();
});

app.get('/warenkorb/:id', function (req, res) {
    if (checkWarendkorbId()) {
        redisClient.lrange("warenkorb:" + req.params.id, 0, -1, function (err, obj) {
            if (obj = "[]") {
                res.status(500);
                res.write('Cart empty!');
                res.end();
            } else {
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.send(obj);
                res.end();
            }
        });
    } else {
        res.write('User not found.');
        res.end();
    }
});

app.get('/warenkorb/:id/add', function (req, res) {
    var itemid = req.query.itemid;
    var quantity = req.query.quantity;
    if (checkWarendkorbId()) {
        redisClient.rpush("warenkorb:" + req.params.id, itemid + ":" + quantity);
        res.write('Item added.');
        res.end();
    } else {
        res.write('User not found.');
        res.end();
    }
});

app.get('/warenkorb/:id/delete', function (req, res) {
    var itemindex = req.query.index;
    if (checkWarendkorbId()) {

            redisClient.lindex("warenkorb:" + req.params.id, itemindex, function (err, obj) {
                if (obj != null) {
                    res.status(200);
                    redisClient.lrem("warenkorb:" + req.params.id, 0, obj);
                    res.write('Item deleted.');
                } else {
                    res.status(500);
                    res.write('Item not found.');
                }
                res.end();
            });
    } else {
        res.write('User not found.');
        res.end();
    }
});



app.listen(3000, function () {
    console.log("Listing on port 3000");
})

function checkWarendkorbId() {
    return true;
}

function checkWarenkorbEmpty(id, cb) {
    redisClient.lindex("warenkorb:" + id, 0, function (err, obj) {
        if (obj == null) {
            cb(true);
        } else {
            cb(false);
        }
    });
}