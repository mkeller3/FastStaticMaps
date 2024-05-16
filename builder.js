'use strict';

const mbgl = require('@maplibre/maplibre-gl-native');

const request = require('request');
const sharp = require('sharp');

// Method used to paint the map to an image
async function paintMap(map, options) {
    return new Promise(resolve => {
        map.render(options, function (err, buffer) {
            if (err) {
                resolve(err)
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

// Method used to build the map with user settings
async function buildMap(options) {
    let mapOptions = {
        zoom: options.zoom,
        center: [options.longitude, options.latitude],
        pitch: options.pitch == undefined ? 0 : options.pitch,
        bearing: options.bearing == undefined ? 0 : options.bearing,
        height: options.height,
        width: options.width,
        attribution: options.attribution
    };
    let map = new mbgl.Map({
        request: function (req, callback) {
            request({
                url: req.url,
                encoding: null,
                gzip: true
            }, function (err, res, body) {
                if (err) {
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
                    var response = {
                        "data": Buffer("")
                    };
                    callback(null, response);
                }
            });
        }
    });

    map.load(options.style);

    const result = await paintMap(map, mapOptions);

    if (mapOptions.attribution != "") {
        const svgImage = `
        <svg width="${mapOptions.width}" height="${mapOptions.height}">
        <style>
        .title { fill: #FFF; font-size: 20px; font-weight: bold;}
        </style>
        <text x="2%" y="98%" text-anchor="right" class="title">${mapOptions.attribution}</text>
        </svg>
        `;
        const svgBuffer = Buffer.from(svgImage);

        const image = await sharp(result)
            .composite([
                {
                    input: svgBuffer,
                    top: 0,
                    left: 0,
                },
            ])
        return image
    }

    return result
}

module.exports = { buildMap }