import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import MenuTop from "./components/MenuTop/MenuTop";
import Panorama from "./components/Panorama";
import "./styles/MapPuzzle.css";
import "./styles/responsive.css";
import { Container } from "react-bootstrap";
import { PanoramaMultiRes } from "./models/Interfaces";
import { useTranslation } from "react-i18next";

const Main = () => {

  const { t, i18n } = useTranslation();
  
  const multiRes = [
    {
      id: "1",
      title: t("scene.color"),
      key: "scene_color",
      basePath: "./360photo",
      path: "/%l/%s%y_%x",
      fallbackPath: "/fallback/%s",
      extension: "jpg",
      tileResolution: 512,
      maxLevel: 6,
      cubeResolution: 11456,
    },
    {
      id: "2",
      title: t("scene.bn"),
      key: "scene_bn",
      basePath: "./360photoBN",
      path: "/%l/%s%y_%x",
      fallbackPath: "/fallback/%s",
      extension: "jpg",
      tileResolution: 512,
      maxLevel: 6,
      cubeResolution: 11456,
    },
    {
      id: "3",
      title: t("scene.original"),
      key: "scene_original",
      basePath: "./360photoOriginal",
      path: "/%l/%s%y_%x",
      fallbackPath: "/fallback/%s",
      extension: "jpg",
      tileResolution: 512,
      maxLevel: 6,
      cubeResolution: 11456,
    },
  ] as PanoramaMultiRes[];
  const [sceneSelected, setSceneSelected] = useState(multiRes[0]);

  const handleMultiRes = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const scene = multiRes.find((s) => s.id === event.currentTarget.id);
    if (scene) {
      setSceneSelected(scene);
    }
  };

  return (
    <Container fluid className="p-0">
      <MenuTop multiRes={multiRes} handleMultiRes={handleMultiRes} />
      <Panorama id={sceneSelected.id} key={`panorama_key_${sceneSelected.id}`} multiResScene={sceneSelected} />
    </Container>
  );
};

export default Main;
