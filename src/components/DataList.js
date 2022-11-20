import React from "react";
import { List, Button } from "antd";
import "./DataList.css";
import TowerPoleItem from "./ListItem/TowerPoleItem";
import { ClearOutlined } from "@ant-design/icons";

function DataList({ data = [], startRangeSearch, clearSelection }) {
  return (
    <List
      className="antd-data-list"
      header={
        <div className="header">
          共{data.length}条数据
          <div className="tools">
            <Button
              onClick={() => {
                startRangeSearch();
              }}
            >
              按范围查询
            </Button>
            <Button
              onClick={() => {
                clearSelection();
              }}
            >
              <ClearOutlined />
            </Button>
          </div>
        </div>
      }
      footer={<div></div>}
      bordered
      dataSource={data}
      renderItem={(item, index) => {
        const properties = item.properties || {};
        return (
          <List.Item>
            <TowerPoleItem data={item}></TowerPoleItem>
          </List.Item>
        );
      }}
    />
  );
}

export default DataList;
