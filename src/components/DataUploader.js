import DropzoneComponent from "react-dropzone-component";
import React, { useState } from "react";

var componentConfig = {
  // iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
};

// const eventHandlers = {};

function DataUploader({ onParsedFile }) {
  const [data, setData] = useState([]);

  const onChange = (evt) => {
    if (evt.target.files[0]) {
      const fileReader = new FileReader();

      fileReader.readAsText(evt.target.files[0], "utf-8");

      fileReader.onload = () => {
        onParsedFile(fileReader.result);
        evt.target.files = null;
      };
    }
  };

  return (
    <input
      multiple={false}
      value={data}
      type="file"
      onChange={onChange}
    ></input>
  );
}

export default DataUploader;
