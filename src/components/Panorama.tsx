import React, { useState, useEffect, useRef } from "react";
import ReactPannellum, {
  getViewer,
  mouseEventToCoords,
} from "react-pannellum";
import { PanoramaMultiRes } from "../models/Interfaces";

const Panorama = ({sceneSelected} : {sceneSelected: PanoramaMultiRes}) => {
  const [hotspots, setHotspots] = useState(null);
  const ref = useRef();

  let isLoaded = false;
  let spotTarget = {
    pitch: 0,
    yaw: 0,
  };
  useEffect(() => {
    if (!ref.current || isLoaded) return;
    setTimeout(() => {
      const viewer = getViewer();

      viewer.on("mousedown", (ev) => {
        const coords = mouseEventToCoords(ev);
        console.error(coords);
        spotTarget.pitch = coords[0];
        spotTarget.yaw = coords[1];
      });
    }, 1000);
    isLoaded = true;
  }, [ref]);

  useEffect(() => {
    fetch("./hotspots.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setHotspots(data);
      })
      .catch(function () {
        console.log("Error al leer el archivo JSON.");
      });
  }, []);

  const config = {
    autoLoad: true,
    showControls: false,
    showFullscreenCtrl: false,
    pitch: -5,
    type: "equirectangular",
    debugger: true,
    haov: 200,
    vaov: 110,
    vOffset: 0,
    yaw: 0,
    hfov: 80,
    maxHfov: 120,
    minHfov: 20,
    compass: true,
    hotSpots: hotspots,
  };

  return hotspots !== null ? (
    <ReactPannellum
      ref={ref}
      className="panorama"
      /* imageSource="./images/360photo.jpg" */
      id={sceneSelected.title}
      sceneId={sceneSelected.title}
      config={config}
      multiRes={sceneSelected}
      type="multires"
    ></ReactPannellum>
  ) : null;
};

export default Panorama;
