/*
Takes a bestiary source file and updates it to contain links to images.
To add images to a monster add an image with a matching monster name to source/img/creature and then run this script.
 */
'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const imgDirectory = 'source/img/creature/';
const bestiaryFile = '../source/dnd-5e-creatures.json';

// Get the list of monsters
const bestiary = JSON.parse(fs.readFileSync(bestiaryFile, 'utf8'));
let bestiaryNameIndex = {};

bestiary.forEach(function(monster, i) {
    bestiaryNameIndex[monster.name.toLowerCase()] = i;
});

let changed = 0;
listFiles('../' + imgDirectory)
    .then(function(imgFiles) {
        let index,
            name,
            loc;

        imgFiles.forEach(function(img) {
            name = stripExtension(img).toLowerCase();
            index = -1;

            if (name in bestiaryNameIndex) {
                index = bestiaryNameIndex[name];
            } else if ((loc = name.indexOf(',')) > 0) {
                // Name something like: 'Blight, Twig' so try to switch and look for a match
                name = name.substring(loc + 1).trim() + ' ' + name.substring(0, loc).trim();
                if (name in bestiaryNameIndex) {
                    index = bestiaryNameIndex[name];
                }
            }

            if (index >= 0) {
                let imgFile = imgDirectory + img;
                if (!('img' in bestiary[index] && bestiary[index].img === imgFile)) {
                    bestiary[index].img = imgFile;
                    changed++;
                }
            } else {
                console.log('No monster found for image:', img);
            }
        });

        if (changed > 0) {
            const bestiaryStr = JSON.stringify(bestiary);
            return fs.writeFileAsync(bestiaryFile, bestiaryStr, 'utf8');
        }
    })
    .then(function() {
        console.log(changed + ' monsters modified');
    })
    .catch(function(e) {
        console.error('Something went wrong!', e);
    });


function listDir(path, filter) {
    function extendedStat(fileName) {
        return fs.statAsync(path + '/' + fileName)
            .then(function(stat) {
                return [fileName, stat];
            });
    }

    return fs.readdirAsync(path)
        .then(function(fileNames) {
            let promises = [];
            fileNames.forEach(function(fileName) {
                promises.push(extendedStat(fileName));
            });
            return Promise.all(promises);
        })
        .then(function(fileStats) {
            let fileNames = [];
            fileStats.forEach(function(fileStat) {
                if (filter(fileStat[0], fileStat[1])) {
                    fileNames.push(fileStat[0]);
                }
            });
            return fileNames;
        });
}

function listFiles(path) {
    return listDir(path, function(filename, stat) {
        return stat.isFile();
    });
}

function stripExtension(fileName) {
    try {
        return strSplice(fileName, '.', true, true);
    } catch (e) {
        console.log('Problem removing file extension', e);
        return fileName;
    }
}

function strSplice(str, needle, fromEnd, prefix) {
    var loc = (fromEnd)
        ? str.lastIndexOf(needle)
        : str.indexOf(needle);
    if (loc > 0) {
        return (prefix)
            ? str.substring(0, loc)
            : str.substring(loc + needle.length);
    }
    throw 'Needle not found.';
}

