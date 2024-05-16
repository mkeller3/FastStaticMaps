# FastStaticMaps

FastStaticMaps is a static map api to build static maps to be served via a REST API endpoint. FastStaticMaps is written in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/javascript) using the [Fastify](https://fastify.dev/) web framework. 

Built with inspiration from [mbgl-renderer](https://github.com/consbio/mbgl-renderer/tree/main).

---

**Source Code**: <a href="https://github.com/mkeller3/FastStaticMaps" target="_blank">https://github.com/mkeller3/FastStaticMaps</a>

---

## Usage

### Running Locally

To run the app locally `nodemon index.js`

## API

| Method | URL                                                                              | Description                                             |
| ------ | -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `POST` | `/api/v1/static_map`                                                             | [Static Map](#Static-Map)      |
| `GET`  | `/api/v1/health_check`                                                           | Server health check: returns `200 OK`    |


## Static Map

The static map endpoints allows you to generate a custom static map using the maplibre gl style spec.

### Map Suitability Parameters
* `zoom=zoom` - zoom level.
* `latitude=latitude` - latitude.
* `longitude=longitude` - longitude.
* `style={style}` - A maplibre gl style to paint on the map.
* `height=height` - The height of the image.
* `width=width` - The width of the image.
* `bearing=bearing` - The bearing of the map.
* `pitch=pitch` - The pitch of the map.
* `attribution=attribution` - Attribution to add to bottom left corner of the image.

### Static Map Example
In the example below, I am creating a static map that pulls in zip code boundaries from a server running [FastVector](https://github.com/mkeller3/FastVector), and a geojson point on the map.

### Static Map Input
```json
{
    "zoom": 10,
    "latitude": 40.507,
    "longitude": -88.969,
    "pitch": 0,
    "bearing": 0,
    "height": 300,
    "width": 700,
    "style": {
        "version": 8,
        "sources": {
            "point": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [
                                    -88.969,
                                    40.507
                                ]
                            },
                            "properties": {
                                "year": "2004"
                            }
                        }
                    ]
                }
            },
            "zips": {
                "type": "vector",
                "tiles": [
                    "http://127.0.0.1:8000/api/v1/tiles/data/public/zip_code_population/{z}/{x}/{y}.pbf"
                ]
            }
        },
        "layers": [
            {
                "id": "zips_line",
                "type": "line",
                "source": "zips",
                "source-layer": "public.zip_code_population",
                "paint": {
                    "line-color": "black"
                }
            },
            {
                "id": "point",
                "type": "circle",
                "source": "point",
                "layout": {
                    "circle-color": "green"
                }
            }
        ]
    }
}
```

### Static Map Response
![Static Image](/images/response.png)