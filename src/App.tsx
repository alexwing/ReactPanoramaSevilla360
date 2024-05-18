import 'bootstrap/dist/css/bootstrap.min.css';

import React, { Component } from "react";

import MenuTop from './components/MenuTop/MenuTop';
import Panorama from './components/Panorama';
import "./styles/MapPuzzle.css";
import "./styles/responsive.css";

class Main extends Component {

  render() {
    return (
      <div>
        <MenuTop name="Sevilla, cerca de 1870 (Jean Laurent)" />
        <Panorama />
      </div>
    );
  }
}

export default Main;