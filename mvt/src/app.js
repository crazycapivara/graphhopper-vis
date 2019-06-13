import getTileData from "./get-tile-data";

const LAT = 52.518728;
const LNG = 13.395767;

export class Map {
    constructor(container, server, props) {
        this._server = server;
        this._createTooltipElement(container);
        this._createWidget(container, props);
    }

    _createTooltipElement(container) {
        const tooltip = document.createElement("div");
        tooltip.style.cssText = "position: absolute; color: #fff; padding: 4px; background: rgba(0, 0, 0, 0.8); z-index: 9;";
        document.getElementById(container).appendChild(tooltip);
        this._tooltip = tooltip;
    }

    _createWidget(container, props) {
        this._deck = new deck.DeckGL(Object.assign({
            mapStyle: "",
            container: container,
            longitude: LNG,
            latitude: LAT,
            zoom: 10,
            layers: this._renderLayers(),
            pickingRadius: 5
        }, props));
    }

    _renderLayers() {
        return [
            new deck.TileLayer({
                lineWidthMinPixels: 1,
                getLineWidth: this._getLineWidth,
                getLineColor: this._getLineColor,
                getTileData: getTileData(this._server),
                pickable: true,
                onHover: ({ object }) => {
                    if (object) {
                        this._tooltip.innerHTML = `${object.properties.name || "no name"}, speed: ${object.properties.speed}`;
                    } else { this._tooltip.innerHTML = ""; }
                }
            })
        ];
    }

    _getLineColor(feature) {
        const speed = feature.properties.speed;
        return  speed < 40 ? [255, 0, 0] : speed < 60 ? [0, 0, 255] : [0, 240, 10];
    }

    _getLineWidth(feature) {
        return feature.properties.name.startsWith("A ") ? 100 : 20;
        // return feature.properties.speed < 60 ? 20 : 100;
    }

    setViewState(lat, lng, zoom) {
        this._deck.setProps({ viewState: { latitude: lat, longitude: lng, zoom: zoom || 10 } });
    }
}
