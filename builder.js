'use strict';

const mbgl = require('@maplibre/maplibre-gl-native');

const request = require('request');
const sharp = require('sharp');


async function paintMap(map, options){
    return new Promise(resolve => {
        map.render(options, function (err, buffer) {
            if (err) {
                console.log(err);
            } else {
                for (let i = 0; i < buffer.length; i += 4) {
                    const alpha = buffer[i + 3]
                    const norm = alpha / 255
                    if (alpha === 0) {
                        buffer[i] = 0
                        buffer[i + 1] = 0
                        buffer[i + 2] = 0
                    } else {
                        buffer[i] /= norm
                        buffer[i + 1] = buffer[i + 1] / norm
                        buffer[i + 2] = buffer[i + 2] / norm
                    }
                }
                let image = sharp(buffer, {
                    raw: {
                        width: options.width,
                        height: options.height,
                        channels: 4
                    }
                });
                image.png().toBuffer()
                    .then((result) => {
                        resolve(result)
                    });
            }
        });
    })
}

async function buildMap(options){
    let mapOptions = {
        zoom: options.zoom,
        center: [options.longitude, options.latitude],
        pitch: options.pitch == undefined ? 0 : options.pitch,
        bearing: options.bearing == undefined ? 0 : options.bearing,
        height: options.height,
        width: options.width
    };
    let map = new mbgl.Map({
        request: function (req, callback) {
            request({
                url: req.url,
                encoding: null,
                gzip: true
            }, function (err, res, body) {
                if (err) {
                    console.log(err)
                    callback(err);
                } else if (res.statusCode == 200 || res.statusCode == 204) {
                    var response = {};

                    if (res.headers.modified) {
                        response.modified = new Date(res.headers.modified);
                    }
                    if (res.headers.expires) {
                        response.expires = new Date(res.headers.expires);
                    }
                    if (res.headers.etag) {
                        response.etag = res.headers.etag;
                    }

                    response.data = body;

                    callback(null, response);
                } else {
                    callback(new Error(JSON.parse(body).message));
                }
            });
        }
    });

    map.load(options.style);

    const result = await paintMap(map, mapOptions);

    return result    
}

module.exports = { buildMap }