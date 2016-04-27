var fs = require('fs');
var chalk = require('chalk');
fs.readFile("./wolkenkratzer.json", function (e, d) {for (i in pD = JSON.parse(d).wolkenkratzer) {console.log("Name: ", chalk.blue.bold(pD[i].name),"\nStadt: ", pD[i].stadt,"\nHöhe: ", pD[i].hoehe + "m\n","\n--------------------\n");}});