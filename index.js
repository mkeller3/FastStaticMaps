'use strict';

const Fastify = require('fastify');
const builder = require('./builder');

const app = Fastify({
    logger: false
})

const PARAMETERS = {
    schema: {
        body: {
            type: 'object',
            required: [
                'zoom',
                'latitude',
                'longitude',
                'style'
            ],
            properties: {
                zoom: {
                    type: 'number',
                    minimum: 0,
                    maximum: 22
                },
                longitude: {
                    type: 'number',
                    minimum: -180,
                    maximum: 180
                },
                latitude: {
                    type: 'number',
                    minimum: -90,
                    maximum: 90
                },
                style: {
                    type: 'object'
                },
                height: {
                    type: 'number',
                    default: 300,
                    minimum: 1,
                    maximum: 1280
                },
                width: {
                    type: 'number',
                    default: 500,
                    minimum: 1,
                    maximum: 1280
                },
                bearing: {
                    type: 'number',
                    default: 0,
                    minimum: 0,
                    maximum: 360
                },
                pitch: {
                    type: 'number',
                    default: 0,
                    minimum: 0,
                    maximum: 60
                },
                attribution: {
                    type: 'string',
                    default: null
                }
            }
        }
    }
}

app.post('/api/v1/static_map', PARAMETERS, function (req, res) {
    let options = {
        zoom: req.body.zoom,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        pitch: req.body.pitch,
        bearing: req.body.bearing,
        height: req.body.height,
        width: req.body.width,
        style: req.body.style,
        attribution: req.body.attribution
    };
    builder.buildMap(options).then(function (data) {
        res.type('image/png');
        res.send(data);
    });

});

app.get('/api/v1/health_check', function (req, res) {
    return {
        "status": "ok"
    }
});

app.listen({ "port": 3000 }, function () {
});