/* Generates markdown for a druid based on the animals they know. */
'use strict';

var fs = require('fs'),
    bestiary = require('../assets/js/dnd5e-monsters');


// List of monsters the druid knows
var druidMonsters = ['Baboon',
    'Badger','Cat','Deer','Hyena','Owl','Blood hawk','Flying snake','Giant rat','Giant weasel',
    'Poisonous snake','Mastiff','Stirge','Boar','Constrictor snake','Elk','Giant badger','Giant bat','Giant frog','Giant lizard','Giant owl',
    'Giant poisonous snake','Giant wolf spider','Panther','Wolf','Ape','Black bear','Giant wasp','Brown bear','Dire wolf','Giant hyena','Giant spider',
    'Giant toad','Tiger','Giant boar','Giant constrictor snake','Giant elk','Cat','Deer','Eagle','Goat','Hyena','Jackal','Vulture','Blood hawk',
    'Flying snake','Axe beak','Boar','Riding horse','Giant goat','Giant eagle','Giant vulture','Lion','Tiger','Giant boar','Rhinoceros','Elephant'
];
var druidInt = 14;
var druidWis = 18;
var druidCha = 8;
var druidAlignment = 'neutral';


// Read the file
fs.readFile('../source/dnd-5e-creatures.json', 'utf8', function(err, data) {
    var monster,
        sortName,
        found = {},
        list = [];

    if (err) {
        throw err;
    }

    // Add the creature data
    var bestiaryData = JSON.parse(data);
    bestiary.add(bestiaryData.creatures);

    // Get the markdown and sort name for each monster
    druidMonsters.forEach(function (name) {
        name = name.toLowerCase();
        monster = bestiary.getMonster(name);

        // If we found a monster and we haven't found it previously add it to the list
        if (monster && !(name in found)) {
            // Get the sort name
            if (name.length > 5 && name.substring(0, 5) === 'giant') {
                // Move the word giant to the end of the name
                sortName = name.substring(6).toLowerCase() + ', giant';
            } else {
                sortName = name;
            }

            // Update the monster stats with some of the druids wildshape ability stats
            monster.int = druidInt;
            monster.wis = druidWis;
            monster.cha = druidCha;
            monster.alignment = druidAlignment;

            list.push({
                'name': sortName,
                'text': bestiary.buildMarkdown(monster)
            });
            found[name] = true;

        } else if (!monster) {
            console.log('Unable to find:', name);
        }
    });

    // Sort by the name
    list.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

    // Print out the monsters
    list.forEach(function (value) {
        console.log(value.text, '\n');
    });
});

