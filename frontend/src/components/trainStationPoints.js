import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

import { METERS_PER_MILE } from '../constants';
import { getTrainStations, getFilter } from '../selectors';

const trainStationIcon = new L.Icon({
  iconUrl: require('../resources/train_station_icon.png'),
  iconSize: new L.Point(25, 25),
});

class TrainStationPoints extends Component {
  static defaultProps = {
    trainStations: {},
    filterRadius: 0,
  };

  render() {
    const { trainStations, filterRadius } = this.props;

    const markers = [];
    for (const stationName in trainStations) {
      markers.push(
        <Marker
          position={trainStations[stationName]['lat_long']}
          key={stationName}
          icon={trainStationIcon}
        >
          <Popup>
            <div className="tooltip-large">
              {trainStations[stationName]['station_descriptive_name']}
            </div>
          </Popup>
          <Circle
            center={trainStations[stationName]['lat_long']}
            radius={METERS_PER_MILE * filterRadius}
            stroke={false}
            fillColor={'#007f00'}
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
    trainStations: getTrainStations(state),
    filterRadius: getFilter(state, 'trainStation')
  };
}

export default connect(mapStateToProps)(TrainStationPoints);
