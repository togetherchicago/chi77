import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import MapConn from './components/map';
import { fetchPlacesAC, fetchHospitalsAC } from './chicago-health-atlas/actions';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: auto;
`;

const TitleBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: red; /* TEMP */
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
      <Container>
        <TitleBar />
        <SideAndMapContainer>
          <SideBar />
          <MapContainer> <MapConn /> </MapContainer>
        </SideAndMapContainer>
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
