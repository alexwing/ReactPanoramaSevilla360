import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Image } from "react-bootstrap-icons";
import "./PanoramaSelector.css";
import { PanoramaMultiRes } from "../models/Interfaces";

interface PanoramaSelectorProps {
  scenes: PanoramaMultiRes[];
  currentScene: string;
  onSelectScene: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

function PanoramaSelector({ scenes = [], currentScene, onSelectScene }: PanoramaSelectorProps): JSX.Element {
  const navDropdownTitle = (
    <span>
      <Image size={24} className="me-2" />
      <span className="d-xl-inline d-lg-none ">{currentScene}</span>
    </span>
  );

  return (
    <React.Fragment>
      <Nav>
        <NavDropdown
          className="panorama-selector"
          title={navDropdownTitle}
          id="nav-dropdown"
        >
          {scenes.map((c: PanoramaMultiRes) => (
            <NavDropdown.Item id={c.title} key={c.title} onClick={onSelectScene}>
              {c.title}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </Nav>
    </React.Fragment>
  );
}

export default PanoramaSelector;