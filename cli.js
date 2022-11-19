#!/usr/bin/env node

const yargs = require("yargs");
var fs = require('fs');
const builder = require('./builder');

const options = yargs
    .usage("Usage: -z <zoom_level> --lat <latitude> --lng <longitude> -h <height> -w <width> -f <style file>")
    .option("z", {
        alias: "zoom",
        describe: "Zoom Level (0 - 22)",
        type: "number",
        demandOption: true
    })
    .option("lat", {
        alias: "latitude",
        describe: "Latitude (-90 - 90)",
        type: "number",
        demandOption: true
    })
    .option("lng", {
        alias: "longitude",
        describe: "Longitude (-180 - 180)",
        type: "number",
        demandOption: true
    })
    .option("h", {
        alias: "height",
        describe: "Height of the image (0 - 1280)",
        type: "number",
        demandOption: true
    })
    .option("w", {
        alias: "width",
        describe: "Width of the image (0 - 1280)",
        type: "number",
        demandOption: true
    })
    .option("f", {
        alias: "Style File",
        describe: "A file containing the style for the map following mapbox gl style spec.",
        type: "string",
        demandOption: true
    })
    .option("i", {
        alias: "Image Name",
        describe: "Name of image generated.",
        type: "string",
        demandOption: true
    })
    .option("bearing", {
        alias: "bearing",
        describe: "Bearing (0 - 360)",
        type: "number",
    })
    .option("pitch", {
        alias: "pitch",
        describe: "Pitch (0 - 60)",
        type: "number",
    })
    .argv;

fs.readFile(options.f, function (err, data) {

    if (err) throw new Error(err);

    const style = JSON.parse(data)

    let PARAMETERS = {
        "zoom": options.zoom,
        "latitude": options.lat,
        "longitude": options.lng,
        "height": options.height,
        "width": options.width,
        "style": style
    }

    builder.buildMap(PARAMETERS).then(function (data) {
        fs.writeFile(`${options.i}.png`, data, (err) => {
            if (err) throw new Error(err);
        });
    })

})