import mapboxgl from "!mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmFvemk5MjYiLCJhIjoiZTU0MzM1YmEyNDY3NWJiZDRlZDI5NWFiZDQzZWYyNDYifQ.GwGVNSoHJdykgvSuFvXOsQ";

class Map {
  init({ container, center, zoom }) {
    this.map = new mapboxgl.Map({
      container: container,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: zoom,
    });

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        // polygon: true,
        // trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      // defaultMode: "draw_polygon",
    });

    this.map.addControl(this.draw, "bottom-right");

    this.map.on("click", (evt) => {
      // console.log(evt);
    });

    this.map.on("load", () => {
      console.log("loaded");
    });
  }

  addEntity(feature, type) {
    if (!this.map) {
      return;
    }

    const geometry = feature?.geometry;

    const geometryType = geometry?.type;

    if (geometryType === "Point") {
      const marker = new mapboxgl.Marker().setLngLat(geometry.coordinates);
      marker.addTo(this.map);
      return;
    }
  }

  removeLyaer(id) {
    const layer = this.map.getLayer(id);

    if (layer) {
      this.map.removeLayer(id);
    }

    const source = this.map.getSource(id);
    if (source) {
      this.map.removeSource(id);
    }
  }

  addPointLayer(
    id,
    data,
    {
      hoverColor = {
        r: 120,
        g: 0,
        b: 0,
      },
      color = {
        r: 0,
        g: 0,
        b: 255,
      },
      strokeColor = {
        r: 200,
        g: 200,
        b: 200,
      },
      opacity = 1,
      radius = 5,
      strokeOpacity = 1,
      strokeWidth = 2,
    },
    filter
  ) {
    let sourceId = id;
    //如果是string说明传入的是id
    if (typeof data === "string") {
      sourceId = data;
    } else {
      this.map.addSource(sourceId, {
        type: "geojson",
        data: data,
        generateId: true,
      });
    }

    const layerParam = {
      id,
      // type: "symbol",
      source: sourceId,
      type: "circle",
      paint: {
        // "con-allow-overlap": false,
        "circle-radius": radius,
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          `rgb(${hoverColor.r},${hoverColor.g},${hoverColor.b})`,
          `rgb(${color.r},${color.g},${color.b})`,
        ],
        "circle-opacity": opacity,
        "circle-stroke-width": strokeWidth,
        "circle-stroke-color": `rgb(${strokeColor.r},${strokeColor.g},${strokeColor.b})`,
        "circle-stroke-opacity": strokeOpacity,
      },
    };
    if (filter) {
      layerParam.filter = filter;
    }

    this.map.addLayer(layerParam);
  }

  startDrawPolygon() {
    this.draw.changeMode("draw_polygon");
  }

  clearSelection(id) {
    this.map.removeFeatureState({
      source: id,
    });
  }

  setSelectedFeatures(id, featureIds) {
    this.map.removeFeatureState({
      source: id,
    });

    if (featureIds.length) {
      featureIds.forEach((v) => {
        mapService.map.setFeatureState(
          {
            source: id,
            id: v,
          },
          {
            selected: true,
          }
        );
      });
    }
  }

  flyTo(feature, param) {
    const geometry = feature.geometry;

    if (geometry.type === "Point") {
      this.map.flyTo({
        center: geometry.coordinates,
        ...param,
      });
    } else {
      throw new Error("not implemented");
    }
  }
}

const mapService = new Map();

window.mapService = mapService;

export default mapService;
