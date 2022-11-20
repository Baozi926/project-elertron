import React, { useRef, useEffect, useCallback } from "react";
import { Button } from "antd";
import { AimOutlined } from "@ant-design/icons";
import "./TowerPoleItem.css";
import mapService from "../../services/mapService";

const locateTo = (feature) => {
  mapService.flyTo(feature, {
    zoom: 15,
  });
};

function TowerPoleItem({ data = {} }) {
  return (
    <div className="tower-pole-item">
      <div className="main">{data.properties.name}</div>
      <div className="right">
        <Button
          onClick={() => {
            locateTo(data);
          }}
          type="primary"
          shape="circle"
        >
          <AimOutlined />
        </Button>
      </div>
    </div>
  );
}

export default TowerPoleItem;
