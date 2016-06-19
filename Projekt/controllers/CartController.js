var redis = require('redis');
var redisClient = redis.createClient();

function checkshoppingcartId() {
    return true;
}

function checkValidItem() {
    return true;
}

module.exports = {

    /**
     * Returns all items in the shopping cart from user id
     * @param {int} id
     * @return {application/json} CartItems
     */
    getCart: function (req, res, next) {
        if (checkshoppingcartId()) {
            redisClient.lrange("shoppingcart:" + req.params.id, 0, -1, function (err, obj) {
                if (obj == "[]") {
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
    },


    /**
     * Adds an item to the shopping cart from user id
     * @param {int} itemid
     * @param {int} quantity
     */
    addItem: function (req, res, next) {
        var json = req.body;
        json.quantity = parseInt(json.quantity);
        if (!isNaN(parseInt(json.quantity)) && checkValidItem(json.itemid)){
        if (checkshoppingcartId()) {
            redisClient.rpush("shoppingcart:" + req.params.id, json);
            res.write('Item added.');
            res.end();
        } else {
            res.write('User not found.');
            res.end();
        } 
        } else {
            res.write('JSON Format Error');
            res.end();
        }
    },

    /**
     * Deletes an item to the shopping cart from user id
     * @param {int} index
     */
    deleteItem: function (req, res, next) {
        var itemindex = req.query.index;
        if (checkshoppingcartId()) {

            redisClient.lindex("shoppingcart:" + req.params.id, itemindex, function (err, obj) {
                if (obj !== null) {
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
    }
};
