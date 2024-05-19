import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import MenuTop from './components/MenuTop/MenuTop';
import Panorama from './components/Panorama';
import "./styles/MapPuzzle.css";
import "./styles/responsive.css";
import { Container } from 'react-bootstrap';
import { PanoramaMultiRes } from './models/Interfaces';

const Main = () => {


  const multiRes = [{
    title: "scene.color",
    basePath: "./360photo",
    path: "/%l/%s%y_%x",
    fallbackPath: "/fallback/%s",
    extension: "jpg",
    tileResolution: 512,
    maxLevel: 6,
    cubeResolution: 11456,
  },
  {
    title: "scene.bn",
    basePath: "./360photoBN",
    path: "/%l/%s%y_%x",
    fallbackPath: "/fallback/%s",
    extension: "jpg",
    tileResolution: 512,
    maxLevel: 6,
    cubeResolution: 11456,
  },{
    title: "scene.original",
    basePath: "./360photoOriginal",
    path: "/%l/%s%y_%x",
    fallbackPath: "/fallback/%s",
    extension: "jpg",
    tileResolution: 512,
    maxLevel: 6,
    cubeResolution: 11456,
  }] as PanoramaMultiRes[];

  const [sceneSelected, setSceneSelected] = useState(multiRes[0]);


  const handleMultiRes = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const scene = multiRes.find((s) => s.title === event.currentTarget.id);
    if (scene) {
      setSceneSelected(scene);
    }
  };


  return (
    <Container fluid className="p-0">
      <MenuTop multiRes={multiRes} handleMultiRes={handleMultiRes} />
      <Panorama sceneSelected={sceneSelected} />
    </Container>
  );
}

export default Main;