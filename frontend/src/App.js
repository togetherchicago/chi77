import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Navbar, Accordion, Card, Button } from 'react-bootstrap';
import Tooltip from 'rc-tooltip';
import  Slider  from 'rc-slider';
import 'rc-slider/assets/index.css';
import logo from './resources/logo.png';
import MapConn from './components/map';
import {
  fetchAC,
  filterAreasByNumOfHospitalsAC,
} from './chicago-health-atlas/actions';

class App extends Component {
  static defaultProps = {
    fetch: () => {},
    filterAreasByNumOfHospitals: () => {},
  };

  componentDidMount() {
    this.props.fetch("PLACES");
    this.props.fetch("TRAIN_STATIONS");
    this.props.fetch("HOSPITALS");
  }

  render() {

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);
    const Handle = Slider.Handle;

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
              <Card className="transportation-filter">
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  Transportation
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body className="referencePointHeader">
                  <span className="referencePointHeader"><b>Proximity to CTA train station</b></span><br/>
                  <p className="referencePoint"><input type="checkbox" name="reference-point" value="disable-ref"></input>  Show reference points</p>
                  <Range min={0} max={30} defaultValue={[5, 23]} tipFormatter={value => `${value} mi`} />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card className="healthcare-filter">
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  Healthcare
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body className="referencePointHeader">
                  <span className="referencePointHeader"><b>Proximity to Hospital</b></span><br/>
                  <p className="referencePoint"><input type="checkbox" name="reference-point" value="disable-ref"></input>  Show reference points</p>
                  <Range min={0} max={30} defaultValue={[5, 23]} tipFormatter={value => `${value} mi`} />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            </div>
            

            

            {/* <DropdownButton
              className="dropdownFilter"
              variant="secondary"
              title="Healthcare"
              onSelect={this.props.filterAreasByNumOfHospitals}
            >
              <Dropdown.Item eventKey={0}>0</Dropdown.Item>
              <Dropdown.Item eventKey={1}>1</Dropdown.Item>
              <Dropdown.Item eventKey={2}>2</Dropdown.Item>
              <Dropdown.Item eventKey={3}>3</Dropdown.Item>
            </DropdownButton>  */}



            <Button style={{"marginLeft": "60px", "marginTop": "500px"}} variant="outline-light">Reset Filters</Button>
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
    fetch: (type) => dispatch(fetchAC(type)),
    filterAreasByNumOfHospitals: (num) => dispatch(filterAreasByNumOfHospitalsAC(num)),
  };
}

export default connect(null, mapDispatchToProps)(App);
