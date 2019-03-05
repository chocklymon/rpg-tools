'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

// Load the file update the version
const fileName = __dirname + '/../source/dnd-5e-creatures.json';
fs.readFileAsync(fileName, 'utf8')
    .then(function(contents) {
        let migrated = false;

        let source = JSON.parse(contents);

        if (Array.isArray(source)) {
            // Basic source, convert to version 1
            migrated = true;
            source = {
                creatures: source,
                version: '1.0.0'
            };

            // Extract the source from the type
            let loc;
            source.creatures.forEach(function(monster) {
                loc = monster.type.lastIndexOf(',');
                if (loc > 0) {
                    monster.source = monster.type.substring(loc + 1).trim();
                    monster.type = monster.type.substring(0, loc);
                } else {
                    // Source not found in the type
                    monster.source = '';

                    // Try to see if there is a source trait
                    if ('trait' in monster) {
                        if (Array.isArray(monster.trait)) {
                            for (let i = monster.trait.length - 1; i >= 0; i--) {
                                if (monster.trait[i].name === 'Source') {
                                    monster.source = monster.trait[i].text;
                                    monster.trait.slice(i, 1);
                                    break;
                                }
                            }
                        } else if (typeof monster.trait === 'object' && 'name' in monster.trait && monster.trait.name === 'Source') {
                            monster.source = monster.trait.text;
                            delete monster.trait;
                        }
                    }
                }
            });
        }


        if (source.version === '1.0.0') {
            // Update to version 1.0.1
            // This cleans up and normalizes some of the data
            migrated = true;
            source.version = '1.0.1';

            source.creatures.forEach(function(monster) {
                // Convert all integers from strings to actual integers
                ['str', 'dex', 'con', 'int', 'wis', 'cha', 'passive'].forEach(function(attribute) {
                    if (attribute in monster) {
                        monster[attribute] = parseIntSafe(monster[attribute]);
                    }
                });

                // These should be arrays
                ['trait', 'reaction', 'action', 'legendary'].forEach(function(attribute) {
                    if (attribute in monster && !Array.isArray(monster[attribute]) && typeof monster[attribute] === 'object') {
                        monster[attribute] = [ monster[attribute] ];
                    }
                });

                // Convert legendary actions into an object
                if ('legendary' in monster) {
                    let legendaryActions = monster.legendary,
                        numActions = 3,
                        monsterActionName = '',
                        legendaryActionRegex = /(?:The )?(\w+) can take (\d) legendary actions/,
                        action, i, result;

                    // Attempt to find the legendary description
                    for (i = monster.legendary.length - 1; i >= 0; i--) {
                        action = monster.legendary[i];
                        if (('name' in action && (result = legendaryActionRegex.exec(action.name)))
                            || ('text' in action && (result = legendaryActionRegex.exec(action.text)))) {
                            numActions = parseIntSafe(result[2]);
                            monsterActionName = result[1];
                            monster.legendary.splice(i, 1);
                            break;
                        }
                    }

                    if (monsterActionName === '') {
                        // Fix for dragons ?
                        // if (monster.name.substring(0, 1) === 'A' && monster.name.indexOf('Dragon') > 0) {
                        //     monster.legendary = {
                        //         numUses: 3,
                        //         name: 'dragon',
                        //         actions: legendaryActions
                        //     };
                        //     return;
                        // }

                        console.log('Check legendary actions:', monster.name, '(' + monster.source + ')');

                        monster.legendary = {
                            numUses: numActions,
                            actions: legendaryActions
                        };
                    } else {
                        // Standard legendary action
                        monster.legendary = {
                            numUses: numActions,
                            name: monsterActionName,
                            actions: legendaryActions
                        };
                    }
                    // Remove the monster's shortened name for the legendary action description if it can be determined from the monster's name
                    if ('name' in monster.legendary && monster.legendary.name === monster.name.toLowerCase()) {
                        delete monster.legendary.name;
                    }
                }
            });
        }


        // If we changed the file, save it
        if (migrated) {
            const fileContents = JSON.stringify(source);
            return fs.writeFileAsync(fileName, fileContents, 'utf8');
        }
        return migrated;
    })
    .then(function(migrated) {
        console.log('Done -', migrated === false ? 'No changes' : 'File migrated');
    })
    .catch(function(err) {
        console.warn('Error with migration:', err);
    });

/**
 * Returns the provided value as an integer if it can be parsed as an integer, otherwise it returns the value as it
 * @param value
 * @returns {*}
 */
function parseIntSafe(value) {
    if (typeof value === 'number') {
        return value;
    }

    // Make sure we only have characters that can be a number
    if (/[^0-9\-.]/.test(value)) {
        return value;
    }
    let parsed = parseInt(value, 10);
    if (isNaN(parsed) || !isFinite(parsed)) {
        return value;
    }
    return parsed;
}