import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactPannellum, {
  getViewer,
  mouseEventToCoords,
} from "react-pannellum";
import { setVisibleHostspots } from "../lib/Utils";

const Panorama = ({ enablePois }) => {
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

  const scenesArray = useMemo(
    () => [
      {
        id: "Color",
        name: "Seville, around 1870 (Jean Laurent) - Color",
      },
      {
        id: "BN",
        name: "Seville, around 1870 (Jean Laurent) - Black & White",
      },
    ],
    []
  );

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

  useEffect(() => {
    setVisibleHostspots(enablePois);
  }, [enablePois]);

  const multiResColor = {
    basePath: "./360photo",
    path: "/%l/%s%y_%x",
    fallbackPath: "/fallback/%s",
    extension: "jpg",
    tileResolution: 512,
    maxLevel: 6,
    cubeResolution: 11456,
  };

  const multiResBN = {
    basePath: "./360photoBN",
    path: "/%l/%s%y_%x",
    fallbackPath: "/fallback/%s",
    extension: "jpg",
    tileResolution: 512,
    maxLevel: 6,
    cubeResolution: 11456,
  };

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
      id="1"
      sceneId="Sevilla"
      config={config}
      multiRes={multiResColor}
      type="multires"
    ></ReactPannellum>
  ) : null;
};

export default Panorama;
