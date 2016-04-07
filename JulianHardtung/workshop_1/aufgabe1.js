var fs = require('fs');


fs.readFile("./wolkenkratzer.json", 'utf-8', function (err, data) {

    console.log("\n***Wolkenkratzer Ranking***");

    if (err) {
        return console.log(err);
    }

    var jsondata = JSON.parse(data);

    for (var i = 0; i < 9; i++) {

        console.log("\nName: ", jsondata.wolkenkratzer[i].name);
        console.log("Stadt: ", jsondata.wolkenkratzer[i].stadt);
        console.log("Hoehe: ", jsondata.wolkenkratzer[i].hoehe);
        console.log("\n--------------------")
    }

});