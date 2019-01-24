"use strict";
var fs = require("fs");
var monsters = require("../assets/js/dnd5e-monsters");

// List of files to convert
var files = ["../source/PotA-ch2.html", "../source/PotA-ch3.html", "../source/PotA-ch4.html", "../source/PotA-ch5.html", "../source/PotA-ch6.html"];

// Initialize the bestiary
var bestiary = JSON.parse(fs.readFileSync("../source/dnd-5e-creatures.json", "utf8"));
monsters.add(bestiary);

// Convert each file
for (var i = 0, l = files.length; i < l; i++) {
    fs.readFile(files[i], "utf8", createFileCB(files[i]));
}

function createFileCB(fileName) {
    return function(err, data) {
        if (err) {
            throw err;
        }

        processFile(fileName, data);
    };
}

function processFile(file, data) {
    // Loop through and find monsters
    var strongRegex = RegExp("<strong( ?[^>]*)>([^<]+)</strong>", "g"),
        changed = false,
        result,
        monsterName;
    while ((result = strongRegex.exec(data)) !== null) {
        if (result[0].indexOf('data-lookup="') === -1) {
            if ((monsterName = monsters.getName(result[2])) !== null) {
                // Modify, replace the strong with the lookup
                data = data.substring(0, result.index)
                    + "<strong" + result[1] + ' data-lookup="' + monsterName + '">' + result[2] + '</strong>'
                    + data.substring(result.index + result[0].length);
                changed = true;
            } else {
                console.error(file, result[2]);
            }
        }
    }

    if (changed) {
        fs.writeFile(file, data, 'utf8', function (err) {
            if (err) {
                throw err;
            }

            console.log(file + ' saved');
        });
    } else {
        console.log(file + ' not modified');
    }
}
