/* Downloads and save images defined in the miniatures files to local disk. */
'use strict';

const http = require('https');
const fs = require('fs');

function downloadFile(source, dest, cb) {
    const file = fs.createWriteStream(dest);
    const request = http.get(source, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    })
        .on('error', function(err) {
            cb(err);
        });
}

function getExtension(str) {
    const l = str.lastIndexOf('.');
    if (l > 0) {
        return str.substr(l);
    }
    console.log('Failed to get extension:', str);
    return str;
}

function getImgName(m, i, img) {
    let n = m.name.replace(/ /g, '_');
    return n + '__' + i + getExtension(img)
}

const file = '../source/miniatures.json';
fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
        throw err;
    }

    const minisData = JSON.parse(data);

    minisData.minis.forEach(function(miniInfo) {
        if ('mini' in miniInfo && miniInfo.mini.length > 0) {
            miniInfo.mini.forEach(function(mini, i) {
                if ('img' in mini && mini.img.length > 4) {
                    const img = mini.img;
                    if (img.substring(0, 4) === 'http') {
                        const newImg = '/source/img/mini/' + getImgName(miniInfo, i, img);
                        mini.img = newImg;

                        downloadFile(img, '..' + newImg, function(err) {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                }
            });
        }
    });

    const minisStr = JSON.stringify(minisData, null, 2);
    fs.writeFile(file, minisStr, 'utf8', function (err) {
        if (err) {
            throw err;
        }

        console.log(file + ' saved');
    });
});
