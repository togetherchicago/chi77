import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Navbar, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import styled from 'styled-components';
import logo from './logo.png';
import './index.css'

import MapConn from './components/map';
import { fetchPlacesAC, fetchHospitalsAC } from './chicago-health-atlas/actions';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: auto;
`;


const SideAndMapContainer = styled.div`
  flex: 4;
  display: flex;
  flex-direction: row;
`;

const SideBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: blue; /* TEMP */
`;

const MapContainer = styled.div`
  flex: 4;
`;

class App extends Component {
  static defaultProps = {
    fetchPlaces: () => {},
    fetchHospitals: () => {},
  };

  componentDidMount() {
    this.props.fetchPlaces();
    this.props.fetchHospitals();
  }

  render() {
    return (
      <PageContainer>
      <Navbar style={{ "padding": "15px" }} bg="dark" variant="dark">
        <Navbar.Brand href="https://www.togetherchicago.com">
          <img
            alt=""
            src={ logo }
            width="80"
            height="30"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Button style={{ "margin-left":"74rem" }} variant="outline-light">Reset Search</Button>
      </Navbar>

      <Container style={{ "height": "100%", "padding-left": "0", "padding-right": "0" }}>
          <Row style={{"height": "100%", "padding-left": "0", "padding-right": "0" }}>
            <Col md={{ span: 3 }}>
              <React.Fragment style={{ "background-color": "lightgray" }}>
                <DropdownButton style={{"padding": "20px", "align-content": "left"}}variant="secondary" id="dropdown-secondary-button" title="TRANSPORTATION">
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </DropdownButton>

                <DropdownButton style={{"width": "50px", "padding": "20px", "align-content": "left"}}variant="secondary" id="dropdown-secondary-button" title="HEALTHCARE">
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </DropdownButton>

              </React.Fragment>
            
              
            </Col>
            <Col md={{ span: 9 }}> <MapConn style={{"padding-left": "0", "padding-right": "0"}}/> </Col>
          </Row>
      </Container>
    </PageContainer>


        
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPlaces: () => dispatch(fetchPlacesAC()),
    fetchHospitals: () => dispatch(fetchHospitalsAC()),
  };
}

export default connect(null, mapDispatchToProps)(App);
