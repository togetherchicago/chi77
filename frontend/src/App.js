import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Navbar, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import logo from './logo.png';

import MapConn from './components/map';
import { fetchPlacesAC, fetchHospitalsAC } from './chicago-health-atlas/actions';

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
      <Container>
        <Navbar style={{ "padding": "15px" }} bg="dark" variant="dark">
          <Navbar.Brand href="/">
            <img
              alt=""
              src={ logo }
              width="80"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Button style={{ "margin-left": "1000px" }} variant="outline-light">Reset Filters</Button>
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

            <Col md={{ span: 9 }}> <MapConn style={{"padding-left": "0", "padding-right": "0"}}/></Col>
          </Row>
        </Container>
      </Container>
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
