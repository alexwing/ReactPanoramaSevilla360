import React, { useState, useEffect } from "react";
import ReactPannellum from "react-pannellum";

const Panorama = ({ enablePois }) => {
  const [hotspots, setHotspots] = useState(null);
  const [savedHotspots, setSavedHotspots] = useState(null);

  useEffect(() => {
    fetch("./hotspots.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setSavedHotspots(data);
        setHotspots(enablePois ? data : null);
      })
      .catch(function () {
        console.log("Error al leer el archivo JSON.");
      });
  }, []);

  useEffect(() => {
    if (enablePois) {
      setHotspots(savedHotspots);
    } else {
      setHotspots(null);
    }
  }, [enablePois, savedHotspots]);

  const multiRes = {
    basePath: "./360photo",
    path: "/%l/%s%y_%x",
    fallbackPath: "/fallback/%s",
    extension: "jpg",
    tileResolution: 512,
    maxLevel: 6,
    cubeResolution: 11456,
  };

  const config = {
    autoLoad: true,
    showControls: true,
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
      className="panorama"
      /* imageSource="./images/360photo.jpg" */
      id="1"
      sceneId="Sevilla"
      config={config}
      multiRes={multiRes}
      type="multires"
    ></ReactPannellum>
  ) : null;
};

export default Panorama;
