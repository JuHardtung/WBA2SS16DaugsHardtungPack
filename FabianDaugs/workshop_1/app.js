var fs = require('fs');


fs.readFile(__dirname + "/wolkenkratzer.json", function (err, data) {
    var datensatz = JSON.parse(data).wolkenkratzer;
    

        for (j in datensatz) {
            console.log("Name:", datensatz[j].name);
            console.log("Stadt:", datensatz[j].stadt);
            console.log("Höhe:", datensatz[j].hoehe + "m\n");
            console.log("--------------------\n");
        }
});