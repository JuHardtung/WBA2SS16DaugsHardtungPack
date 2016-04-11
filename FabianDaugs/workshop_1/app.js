var fs = require('fs');
var chalk = require('chalk');


fs.readFile(__dirname + "/wolkenkratzer.json", function (err, data) {
    var datensatz = JSON.parse(data).wolkenkratzer;


    datensatz.sort(function (a, b) {
        return (a.hoehe > b.hoehe) ? 1 : ((b.hoehe > a.hoehe) ? -1 : 0);
    });

    fs.writeFile(__dirname + "/wolkenkratzer_sortiert.json", JSON.stringify(datensatz), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        for (j in datensatz) {
            console.log("Name:", chalk.red.bold(datensatz[j].name));
            console.log("Stadt:", chalk.yellow(datensatz[j].stadt));
            console.log("Höhe:", chalk.green(datensatz[j].hoehe + "m"));
            console.log("--------------------");
        }
    });

});