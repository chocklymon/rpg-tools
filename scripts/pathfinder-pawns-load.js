/*
Adds the pathfinder pawns information to the list of miniatures.
Data source: https://www.reddit.com/r/Pathfinder/comments/9peq04/pathfinder_pawn_database/
 */
'use strict';

const fs = require('fs');

function loadPawnsFromCSV(source, cb) {
    function getSize(size) {
        const s = size.substring(0, 1);
        // Gargantuan, Huge, Large, Medium, Small, Tiny
        if (s === 'G' || s === 'H' || s === 'L' || s === 'M' || s === 'S' || s === 'T') {
            return s;
        }
        return '?';
    }

    const parser = require('csv-parse')({
        columns: true
    });
    const records = [];

    parser.on('readable', function() {
        let row,
            record;
        while ((row = parser.read()) !== null) {
            record = {
                name: row.Name.trim(),
                qty: Number.parseInt(row.Quantity),
                set: row.Set,
                size: getSize(row.Size),
            };
            if (row.Class) {
                record.extra = row.Class;
            }
            records.push(record);
        }
    });
    parser.on('error', function(err) {
        cb(err);
    });
    parser.on('end', function() {
        cb(null, records);
    });

    fs.createReadStream(source)
        .pipe(parser);
}

const file = '../source/miniatures.json';
fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
        throw err;
    }

    const minisData = JSON.parse(data);
    const minisByName = {};
    minisData.minis.forEach(function(mini) {
        minisByName[mini.name] = mini;
    });

    loadPawnsFromCSV('../source/Pathfinder Bestiary Pawn Database.csv', function(err, pawns) {
        if (err) {
            throw err;
        }

        pawns.forEach(function(pawn) {
            let name = pawn.name.toLowerCase(),
                found = false,
                mini = {},
                loc;
            if (name in minisByName) {
                mini = minisByName[name];
                found = true;
            } else if ((loc = name.indexOf(',')) > 0) {
                // Swap name parts, e.g., 'Demon, Herzou' -> 'Herzou Demon'
                name = name.substring(loc + 1).trim() + ' ' + name.substring(0, loc).trim();
                if (name in minisByName) {
                    mini = minisByName[name];
                    found = true;
                }
                if (!('alt' in mini)) {
                    mini.alt = [];
                }
                mini.alt = [pawn.name.toLowerCase()]
            }
            if (!found) {
                // Adding a new mini information
                mini.name = name;
                minis.push(mini);
                minisByName[name] = mini;
            }
            if (!('pawn' in mini)) {
                mini.pawn = [];
            }
            mini.pawn.push({
                "source": pawn.set,
                "qty": pawn.qty,
                "size": pawn.size
            });
        });



        const minisStr = JSON.stringify(minisData, null, 2);
        fs.writeFile(file, minisStr, 'utf8', function (err) {
            if (err) {
                throw err;
            }

            console.log(file + ' saved');
        });
    });
});

