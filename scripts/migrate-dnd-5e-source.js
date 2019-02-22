'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

// Load the file update the version
const fileName = __dirname + '/../source/dnd-5e-creatures.json';
fs.readFileAsync(fileName, 'utf8')
    .then(function(contents) {
        let migrated = false;

        const source = JSON.parse(contents);
        let newSource = {};

        if (Array.isArray(source)) {
            // Basic source, convert to version 1
            migrated = true;
            newSource.creatures = source;

            // Extract the source from the type
            let loc;
            newSource.creatures.forEach(function(monster) {
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

        // If we changed the file, save it
        if (migrated) {
            newSource.version = '1.0.0';

            const fileContents = JSON.stringify(newSource);
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