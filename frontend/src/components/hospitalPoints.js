import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Marker, Popup } from 'react-leaflet';

import { getHospitals } from '../selectors';

class HospitalPoints extends Component {
  static defaultProps = {
    hospitals: {},
  };

  render() {
    const { hospitals } = this.props;

    const markers = [];
    for (const slug in hospitals) {
      markers.push(
        <Marker position={hospitals[slug]['lat_long']} key={slug} >
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