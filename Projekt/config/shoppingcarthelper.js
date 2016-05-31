var redis = require("redis");
redisClient = redis.createClient();

/**
 * Returns all items in the shopping cart from user id
 * @param {int} id
 * @return {application/json} CartItems
 */
app.get('/shoppingcart/:id', function (req, res) {
    if (checkshoppingcartId()) {
        redisClient.lrange("shoppingcart:" + req.params.id, 0, -1, function (err, obj) {
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


/**
 * Adds an item to the shopping cart from user id
 * @param {int} itemid
 * @param {int} quantity
 */
app.get('/shoppingcart/:id/add', function (req, res) {
    var itemid = req.query.itemid;
    var quantity = req.query.quantity;
    if (checkshoppingcartId()) {
        redisClient.rpush("shoppingcart:" + req.params.id, itemid + ":" + quantity);
        res.write('Item added.');
        res.end();
    } else {
        res.write('User not found.');
        res.end();
    }
});

/**
 * Deletes an item to the shopping cart from user id
 * @param {int} index
 */
app.get('/shoppingcart/:id/delete', function (req, res) {
    var itemindex = req.query.index;
    if (checkshoppingcartId()) {

            redisClient.lindex("shoppingcart:" + req.params.id, itemindex, function (err, obj) {
                if (obj != null) {
                    res.status(200);
                    redisClient.lrem("shoppingcart:" + req.params.id, 0, obj);
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
