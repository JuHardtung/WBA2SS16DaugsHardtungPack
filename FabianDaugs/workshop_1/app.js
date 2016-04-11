var fs = require('fs');
var chalk = require('chalk');


fs.readFile(__dirname + "/wolkenkratzer.json", function (err, data) {
    var datensatz = JSON.parse(data).wolkenkratzer;
    

        for (j in datensatz) {
            console.log("Name:", chalk.red.bold(datensatz[j].name));
            console.log("Stadt:", chalk.yellow(datensatz[j].stadt));
            console.log("Höhe:", chalk.green(datensatz[j].hoehe + "m"));
            console.log("--------------------");
        }
});