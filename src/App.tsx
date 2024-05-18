import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import MenuTop from './components/MenuTop/MenuTop';
import Panorama from './components/Panorama';
import "./styles/MapPuzzle.css";
import "./styles/responsive.css";
import { Container } from 'react-bootstrap';

const Main = () => {

  return (
    <Container fluid className="p-0">
      <MenuTop name="Sevilla, cerca de 1870 (Jean Laurent)"/>
      <Panorama />
    </Container>
  );
}

export default Main;