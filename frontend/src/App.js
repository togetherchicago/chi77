import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Navbar, Accordion, Card, Button } from 'react-bootstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

import logo from './resources/logo.png';
import MapConn from './components/map';
import {
  fetchAC,
  updateFilterAC,
} from './-general/actions';
import { getOverlay } from './selectors';
import './index.css';

const SliderWithTooltip = createSliderWithTooltip(Slider);

class App extends Component {

  static defaultProps = {
    overlay: '',
    fetch: () => {},
    updateHospitalFilter: () => {},
    updateTrainStationFilter: () => {},
  };

  componentDidMount() {
    this.props.fetch("PLACES");
    this.props.fetch("TRAIN_STATIONS");
    this.props.fetch("HOSPITALS");
  }

  render() {
    const {
      overlay,
      updateHospitalFilter,
      updateTrainStationFilter,
    } = this.props;

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
          </Navbar>
        </Row>

        <Row style={{ "height": "90%" }} noGutters>
          <Col id="sidebar" md={{ span: 2 }}>
            <div className="filter">
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    Healthcare
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <span className="referencePointHeader"><b>Proximity to Hospital</b></span><br/>
                      <SliderWithTooltip className="slider"
                        tipFormatter={value => `${value} mi`}
                        onChange={updateHospitalFilter}
                        max={4}
                        step={0.05}
                      />
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card className="transportation-filter">
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    Transportation
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body className="referencePointHeader">
                      <span className="referencePointHeader"><b>Proximity to CTA Train Station</b></span>
                      <SliderWithTooltip
                        tipFormatter={value => `${value} mi`}
                        onChange={updateTrainStationFilter}
                        max={4}
                        step={0.05}
                      />
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
            <Button style={{"marginLeft": "60px", "marginTop": "500px"}} variant="outline-light">Reset Filters</Button>
          </Col>

          <Col md={{ span: 10 }}>
            <Card id="mapOverlay" style={{"visibility": overlay ? "visible" : "hidden"}}>
              <div>{overlay}</div>
            </Card>
            <MapConn />
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    overlay: getOverlay(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: (type) => dispatch(fetchAC(type)),
    updateHospitalFilter: (num) => dispatch(updateFilterAC({ type: 'hospital', num })),
    updateTrainStationFilter: (num) => dispatch(updateFilterAC({ type: 'trainStation', num })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
