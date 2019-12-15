import { put } from 'redux-saga/effects';

import { api } from '../api';
import { addTrainStationsAC } from './actions';

export function * fetchTrainStations() {
  const stations = {};

  const response = yield api.get('/transit/view/', {
    params: {
      resource: 'soda.chicagocity',
      category: 'cta.train-stations',
    },
  });

  for (const ts of response.data.data) {
    // Grab station name
    const stationName = ts['station_name'];

    // Parse latLong
    ts['lat_long'] = [
      parseFloat(ts.location.latitude),
      parseFloat(ts.location.longitude),
    ];

    stations[stationName] = ts;
  }

  yield put(addTrainStationsAC({ stations }));
}
