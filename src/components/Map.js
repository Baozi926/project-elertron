import "mapbox-gl/dist/mapbox-gl.css";
import React, { useRef, useEffect, useCallback, useState } from "react";
import "./Map.css";
import * as turf from "@turf/turf";

import mapService from "../services/mapService";
import DataUploader from "./DataUploader";
import DataList from "./DataList";
import axios from "axios";

const createMock = () => {
  const maxX = 114.57467231089282;
  const maxY = 30.602892238813666;
  const minX = 114.25225274884559;
  const minY = 30.430268180990737;

  const dX = Math.abs(maxX - minX);
  const dY = Math.abs(maxY - minY);

  const randomNum = 500;

  const result = [];

  for (let i = 0; i < randomNum; i++) {
    const x = minX + Math.abs(Math.random(dX));

    const y = minY + Math.abs(Math.random(dY));

    result.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [x, y],
      },
      properties: {
        name: "测试" + (i + 1),
        id: "id_" + i,
      },
    });
  }

  return {
    type: "FeatureCollection",
    features: result,
  };
};

function Map() {
  const mapContainer = useRef(null);
  //   const map = useRef(null);

  const [list, setList] = useState([]);

  const towerPoleLayerId = "towerPole";

  const clearSelection = useCallback(() => {
    mapService.clearSelection(towerPoleLayerId);
  });

  const startRangeSearch = useCallback(() => {
    mapService.startDrawPolygon();
  });

  useEffect(() => {
    if (mapService.map) return; // initialize map only once

    mapService.init({
      container: mapContainer.current,
      center: [114.42208301440837, 30.604084333984986],
      zoom: 9,
    });

    const map = mapService.map;

    map.on("load", () => {
      parseFile(createMock());
    });

    // map.on("click", (evt) => {
    //   if (mode !== "norm") {
    //     return;
    //   }
    //   console.log("mouse click select");

    //   const features = map.queryRenderedFeatures(evt.point, {
    //     layers: [towerPoleLayerId],
    //   });

    //   mapService.setSelectedFeatures(
    //     towerPoleLayerId,
    //     features.map((v) => {
    //       return v.id;
    //     })
    //   );
    // });

    map.on("draw.create", (res) => {
      console.log(res);

      const geometry = res.features[0]?.geometry;

      if (geometry && geometry.type === "Polygon") {
        // const features = map.queryRenderedFeatures(geometry, {
        //   layers: [towerPoleLayerId],
        // });

        let polygonBoundingBox = turf.bbox(geometry);

        let southWest = [polygonBoundingBox[0], polygonBoundingBox[1]];
        let northEast = [polygonBoundingBox[2], polygonBoundingBox[3]];

        let northEastPointPixel = map.project(northEast);
        let southWestPointPixel = map.project(southWest);

        let features = map.queryRenderedFeatures(
          [southWestPointPixel, northEastPointPixel],
          { layers: [towerPoleLayerId] }
        );

        const featuresIds = [];

        features.forEach((feature) => {
          if (
            turf.booleanPointInPolygon(feature.geometry.coordinates, geometry)
          ) {
            // only add the property, if the feature intersects with the polygon drawn by the user

            featuresIds.push(feature.id);
          }
        });
        // map2.setFilter("selected", filter);

        mapService.setSelectedFeatures(towerPoleLayerId, featuresIds);
      }

      mapService.draw.deleteAll();
    });
  });

  const parseFile = useCallback((data) => {
    console.log(data);

    mapService.removeLyaer(towerPoleLayerId);

    const featureCollection =
      typeof data === "string" ? JSON.parse(data) : data;

    mapService.addPointLayer(towerPoleLayerId, featureCollection, {});

    setList(featureCollection.features);
  }, []);

  return (
    <div className="map-root">
      <div className="drop-zone">
        <DataUploader onParsedFile={parseFile} />
      </div>
      <div className="data-list-container">
        <DataList
          className="data-list"
          data={list}
          startRangeSearch={startRangeSearch}
          clearSelection={clearSelection}
        ></DataList>
      </div>
      <div ref={mapContainer} className="map-container" />;
    </div>
  );
}

export default Map;
