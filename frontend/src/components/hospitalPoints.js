import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import { getHospitals } from '../selectors';

const hospitalIcon = new L.Icon({
  iconUrl: require('../hospital_icon.png'),
  iconSize: new L.Point(35, 35),
});

class HospitalPoints extends Component {
  static defaultProps = {
    hospitals: {},
  };

  render() {
    const { hospitals } = this.props;

    const markers = [];
    for (const slug in hospitals) {
      markers.push(
        <Marker
          position={hospitals[slug]['lat_long']}
          key={slug}
          icon={hospitalIcon}
        >
          <Popup>{hospitals[slug]['name']}</Popup>
        </Marker>
      );
    }

    return (
      <LayerGroup>
        {markers}
      </LayerGroup>
    );
  }
}

function mapStateToProps(state) {
  return {
    hospitals: getHospitals(state),
  };
}

export default connect(mapStateToProps)(HospitalPoints);
