import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import { getHospitals } from '../selectors';

const hospitalIcon = new L.Icon({
  iconUrl: require('../resources/hospital_icon.png'),
  iconSize: new L.Point(35, 35),
});

function hasSubtype(hospital) {
  if (hospital == null) {
    hospital = "Hospital";
  }
  return hospital;
}

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
          <Popup>
            <div className="tooltip-large">{hospitals[slug]['name']}</div>
            <hr/>
            <div className="tooltip-small">{ hasSubtype(hospitals[slug]['sub_type']) }</div>
            <div className="tooltip-secondary"> {hospitals[slug]["addr_street"]}, {hospitals[slug]["addr_city"]}, IL {hospitals[slug]["addr_zip"]}</div>
          </Popup>
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
