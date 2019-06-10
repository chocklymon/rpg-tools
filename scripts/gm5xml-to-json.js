/*!
This converts Game Master 5 formatted xml files to JSON.
 */
"use strict";

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const parseString = Promise.promisify(require('xml2js').parseString);
const intParse = require('./int-parse.js');

const legendaryActionRegex = /Legendary Actions \((\d+)\/Turn\)/;

// TODO get arg for the file
// TODO allow for a second arg to be specified that appends to an existing source file
fs.readFileAsync(__dirname + "/../source/Volo's Guide to Monsters.xml", 'utf8')
    .then(function(contents) {
        // Convert the file contents from XML to JSON
        return parseString(contents);
    })
    .then(function(compendium) {
        // Get the compendium
        if (!('compendium' in compendium)) {
            throw 'Invalid compendium';
        }
        compendium = compendium.compendium;
        // console.log('Processing compendium. Version:', compendium['$'].version);

        // Find the spells and monsters in the compendium
        let monsters = [],
            spells = [];

        if ('monster' in compendium) {
            // Process monsters
            compendium.monster.forEach(function(monster) {
                monsters.push(processMonster(monster));
            });
        }
        if ('spell' in compendium) {
            // Process spells
            // TODO
        }

        console.log(JSON.stringify(monsters));
    })
    .catch(function(err) {
        console.log('Error:', err);
    });

function processTraits(value) {
    let trait,
        traits = [];

    value.forEach(function (v) {
        trait = {};
        if ('name' in v && v.name.length > 0) {
            trait['name'] = v.name[0].trim();
        }
        if ('text' in v && v.text.length > 0) {
            trait['text'] = trimAll(v.text);
        }
        if ('attack' in v && v.attack.length > 0) {
            if (v.attack.length > 1) {
                trait['attack'] = trimAll(v.attack);
            } else {
                // Collapse to a single attack
                trait['attack'] = v.attack[0].trim();
            }
        }
        traits.push(trait);
    });

    return traits;
}

function trimAll(arr) {
    return arr.map(function (v) {
        return v.trim();
    });
}

function csvSplit(str, isNumeric) {
    return str.split(',')
        .map(function (v) {
            v = v.trim();
            if (isNumeric) {
                // Convert to an integer
                v = parseInt(v, 10);
                if (!intParse.naturalNumber(v)) {
                    v = null;
                }
            }
            return v;
        })
        .filter(function (v) {
            return v !== null;
        });
}

function processMonster(monster) {
    let m = {},
        value,
        result;

    for (let i in monster) {
        if (monster.hasOwnProperty(i)) {
            value = monster[i];
            if (value.length > 0) {
                switch (i) {
                    // Traits and Abilities
                    case 'trait':// Fallthrough
                    case 'action':
                    case 'reaction':
                        // Convert the traits and save
                        m[i] = processTraits(value);
                        break;

                    case 'legendary':
                        // Extract the number of uses and the name from the text
                        if ('name' in value[0] && (result = legendaryActionRegex.exec(value[0].name))) {
                            m[i] = {
                                "numUses": intParse(result[1]),
                                "actions": processTraits(value.slice(1)),
                            };
                        } else {
                            console.log('Invalid legendary actions', monster.name);
                        }
                        break;

                    // This is a comma separated list
                    case 'slots':// Fallthrough
                    case 'spells':
                        if (value[0].length > 0) {
                            value = csvSplit(value[0], i === 'slots');

                            if (value.length > 0) {
                                m[i] = value;
                            }
                        }
                        break;

                    // These should be numbers
                    case 'str':// Fallthrough
                    case 'dex':
                    case 'con':
                    case 'int':
                    case 'wis':
                    case 'cha':
                    case 'passive':
                        value = parseInt(value[0], 10);
                        if (intParse.naturalNumber(value)) {
                            m[i] = value;
                        }
                        break;

                    case 'description':
                        // Check if the description is a source
                        if (value[0].length > 0) {
                            if (value[0].indexOf('Source: ') === 0) {
                                // We have a source, save the source
                                m['source'] = value[0].substring(8).trim();
                            } else {
                                // Not a source, save to the description field
                                m[i] = value[0].trim();
                            }
                        }
                        break;

                    default:
                        // Get the text
                        if (value[0].length > 0) {
                            m[i] = value[0].trim();
                        }
                }
            }
        }
    }
    return m;
}