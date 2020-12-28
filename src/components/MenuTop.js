import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Info from './Info.js';

export default class MenuTop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showInfo: false,
    }
  }
  render() {
    let handleInfo = () => {
      this.setState({
        showInfo: true
      });
    }

    let InfoCloseHandle = () => {
      this.setState({
        showInfo: false
      });
    }
        
    return <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">{this.props.name}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
      <Form inline>
            <Button id="info" variant="outline-secondary" onClick={handleInfo}><span className="navbar-info-icon"></span> Info</Button>
          </Form>
      </Navbar.Collapse>
      <Info show={this.state.showInfo} content={this.props.content} InfoClose={InfoCloseHandle}/>
    </Navbar>
    ;
  }

}