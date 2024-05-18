import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import MenuTop from './components/MenuTop/MenuTop';
import Panorama from './components/Panorama';
import "./styles/MapPuzzle.css";
import "./styles/responsive.css";
import { Container } from 'react-bootstrap';

const Main = () => {
  const [poisVisible, setPoisVisible] = useState(true);

  return (
    <Container fluid className="p-0">
      <MenuTop name="Sevilla, cerca de 1870 (Jean Laurent)" handlePois={() => setPoisVisible(!poisVisible)} />
      <Panorama enablePois={poisVisible} />
    </Container>
  );
}

export default Main;