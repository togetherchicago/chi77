import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

import { METERS_PER_MILE } from '../constants';
import { getHospitals, getFilterAreasByNumOfHospitals } from '../selectors';

const hospitalIcon = new L.Icon({
  iconUrl: require('../resources/hospital_icon.png'),
  iconSize: new L.Point(35, 35),
});

class HospitalPoints extends Component {
  static defaultProps = {
    hospitals: {},
    filterRadius: 0,
  };

  render() {
    const { hospitals, filterRadius } = this.props;

    const markers = [];
    for (const slug in hospitals) {
      markers.push(
        <Marker
          position={hospitals[slug]['lat_long']}
          key={slug}
          icon={hospitalIcon}
        >
          <Popup>{hospitals[slug]['name']}</Popup>
          <Circle
            center={hospitals[slug]['lat_long']}
            radius={METERS_PER_MILE * filterRadius}
            stroke={false}
          />
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
    filterRadius: getFilterAreasByNumOfHospitals(state),
  };
}

export default connect(mapStateToProps)(HospitalPoints);
