var fs = require('fs');
var chalk = require('chalk');

 var jsndata = null;


fs.readFile("./wolkenkratzer.json", 'utf-8', function (err, data) {

    console.log("\n***Wolkenkratzer Ranking***");

    if (err) {
        return console.log(err);
    }

    jsndata = JSON.parse(data);
    
    wolkenkratzerSortieren();
    wolkenkratzerSpeichern(jsndata);
    setTimeout(ausgabe(), 500);
});
    
 function wolkenkratzerSortieren(){
     jsndata.wolkenkratzer.sort(function(a,b){
        
        if(a.hoehe > b.hoehe) {
            return -1;
        }
        if (a.hoehe < b.hoehe){
            return 1;
        }
        return 0;
        
    });
 };
    
function wolkenkratzerSpeichern(jsndata){
    console.log("Erfolgreich in wolkenkratzer_sortiert gespeichert!");
    
    fs.writeFile("./wolkenkratzer_sortiert.json", JSON.stringify(jsndata) , function (err) {
        if (err) {
            return console.log(err);
        }
});
};
    
function ausgabe(){    
       for (var i = 0; i < 9; i++) {

        console.log("\nName: ", chalk.red(jsndata.wolkenkratzer[i].name));
        console.log("Stadt: ", chalk.yellow(jsndata.wolkenkratzer[i].stadt));
        console.log("Hoehe: ", chalk.green(jsndata.wolkenkratzer[i].hoehe));
        console.log("\n--------------------");
    }

};


