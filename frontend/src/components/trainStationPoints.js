import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import { getTrainStations } from '../selectors';

const trainStationIcon = new L.Icon({
  iconUrl: require('../resources/train_station_icon.png'),
  iconSize: new L.Point(25, 25),
});

class TrainStationPoints extends Component {
  static defaultProps = {
    trainStations: {},
  };

  render() {
    const { trainStations } = this.props;

    const markers = [];
    for (const stationName in trainStations) {
      markers.push(
        <Marker
          position={trainStations[stationName]['lat_long']}
          key={stationName}
          icon={trainStationIcon}
        >
          <Popup>{trainStations[stationName]['station_descriptive_name']}</Popup>
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
    trainStations: getTrainStations(state),
  };
}

export default connect(mapStateToProps)(TrainStationPoints);
