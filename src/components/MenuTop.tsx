import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Info from './Info';

const MenuTop = ({ name }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleInfo = () => {
    setShowInfo(true);
  }

  const handleCancel = () => {
    setShowInfo(false);
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">{name}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Form >
          <Button id="info" variant="outline-secondary" onClick={handleInfo}><span className="navbar-info-icon"></span> Info</Button>
        </Form>
      </Navbar.Collapse>
      <Info name={name} show={showInfo} InfoClose={handleCancel} />
    </Navbar>
  );
}

export default MenuTop;