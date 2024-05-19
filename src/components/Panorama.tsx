import React, { useState, useEffect } from "react";
import ReactPannellum from "react-pannellum";
import { PanoramaMultiRes } from "../models/Interfaces";
import axios from "axios";

interface PanoramaProps {
  id: string;
  multiResScene: PanoramaMultiRes;
}

const Panorama = ({ id, multiResScene }: PanoramaProps) => {
  const [hotspots, setHotspots] = useState(null);

  useEffect(() => {
    axios
      .get("./hotspots.json")
      .then((response) => {
        setHotspots(response.data);
      })
      .catch((error) => {
        console.log("Error al leer el archivo JSON.", error);
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
      className="panorama"
      /* imageSource="./images/360photo.jpg" */
      id={`reacpanorama_key__${multiResScene.id}`}
      sceneId={`reacpanorama_sceneId__${multiResScene.id}`}
      config={config}
      multiRes={multiResScene}
      type="multires"
    ></ReactPannellum>
  ) : null;
};

export default Panorama;
