import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Navbar, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import logo from './resources/logo.png';

import MapConn from './components/map';
import {
  fetchPlacesAC,
  fetchHospitalsAC,
  filterAreasByNumOfHospitalsAC,
  fetchTrainStationsAC,
} from './chicago-health-atlas/actions';

class App extends Component {
  static defaultProps = {
    fetchPlaces: () => {},
    fetchHospitals: () => {},
    filterAreasByNumOfHospitals: () => {},
    fetchTrainStations: () => {},
  };

  componentDidMount() {
    this.props.fetchPlaces();
    this.props.fetchTrainStations();
    this.props.fetchHospitals();
  }

  render() {
    return (
      <Container id="mainContainer" style={{"height": "100vh"}} fluid>
        <Row style={{"height": "10%"}} noGutters>
          <Navbar style={{"width": "100%"}} bg="dark" variant="dark">
            <Navbar.Brand href="/">
              <img
                alt=""
                src={ logo }
                width="80"
                height="30"
                className="d-inline-block align-top"
              />
            </Navbar.Brand>
            <Button style={{"marginLeft": "auto"}} variant="outline-light">Reset Filters</Button>
          </Navbar>
        </Row>

        <Row style={{"height": "90%"}} noGutters>
          <Col id="sidebar" md={{ span: 2 }}>
            <DropdownButton className="dropdownFilter" variant="secondary" title="TRANSPORTATION">
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </DropdownButton>

            <DropdownButton
              className="dropdownFilter"
              variant="secondary"
              title="# of Hospitals"
              onSelect={this.props.filterAreasByNumOfHospitals}
            >
              <Dropdown.Item eventKey={0}>0</Dropdown.Item>
              <Dropdown.Item eventKey={1}>1</Dropdown.Item>
              <Dropdown.Item eventKey={2}>2</Dropdown.Item>
              <Dropdown.Item eventKey={3}>3</Dropdown.Item>
            </DropdownButton>
          </Col>

          <Col md={{ span: 10 }}>
            <MapConn />
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPlaces: () => dispatch(fetchPlacesAC()),
    fetchHospitals: () => dispatch(fetchHospitalsAC()),
    filterAreasByNumOfHospitals: (num) => dispatch(filterAreasByNumOfHospitalsAC(num)),
    fetchTrainStations: () => dispatch(fetchTrainStationsAC()),
  };
}

export default connect(null, mapDispatchToProps)(App);
