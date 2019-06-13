const VectorTile = require("@mapbox/vector-tile").VectorTile;
const Protobuf = require("pbf");
// import { VectorTile } from "@mapbox/vector-tile";
// import Protobuf from "pbf";

// export default function(server) {
module.exports = function(server) {
    return function({ x, y, z }) {
        const mapSource = `${server}/mvt/${z}/${x}/${y}.mvt`;
        return fetch(mapSource)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const tile = new VectorTile(new Protobuf(buffer));
            // console.log(tile);
            const features = [];
            for (const layerName in tile.layers) {
                const vectorTileLayer = tile.layers[layerName];
                for (let i = 0; i < vectorTileLayer.length; i++) {
                    const vectorTileFeature = vectorTileLayer.feature(i);
                    const feature = vectorTileFeature.toGeoJSON(x, y, z);
                    features.push(feature);
                }
            }

            return features;
        });
    };
};
