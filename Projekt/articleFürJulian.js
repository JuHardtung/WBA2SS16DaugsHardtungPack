redisClient.lrange("articles", 0, -1, function(err, obj) {
    if (obj.length === 0) {
        res.status(500);
        res.write('list empty!');
        res.end();
    } else {

      var articles = [];
      for (var item in obj) {
          articles[item] = "article:" + obj[item];
      }

      redisClient.mget(articles, function(err, obj) {
          var list;

          for (var j in obj) {
              if(j==0&&obj.length==1){
                list =obj[j];
              }else if(j==0){
                list =obj[j] + ", ";
              }else if (j < obj.length - 1) {
                  list = list + obj[j] + ", ";
              } else {
                  list = list + obj[j];
              }
          }

          res.status(200);
          res.setHeader('Content-Type', 'application/json');
          res.send('[' + list + ']');
          res.end();
      });
    }
  });


  client.lrange('ARTICLE', 0, -1, function (err, reply) {
      if (!errorInDatabase(res, err)) {
          console.log("Bekomme alle Artikel!");
          if (reply === null) {
              res.status(httpStatus.NOT_FOUND);
          } else {
              res.status(httpStatus.OK).json(reply);
          }
      }
  });
