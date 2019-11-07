import { put, select, take } from 'redux-saga/effects';

import { api } from '../api';
import { addPlacesAC, addHospitalsAC, addTrainStationsAC } from './actions';
import { getCommunityAreas } from '../selectors';

export function * fetchPlaces() {
  const response = yield api.get('/general/view/', {
    params: {
      resource: 'chi_health_atlas',
      category: 'places',
      query: JSON.stringify({}),
    },
  });

  const data = response.data.data;
  const relevantKeys = ['part', 'resource_cnt', 'name'];
  const communityAreas = {};

  for (const place of data['community_areas']) {

    const info = {};
    for (const key of relevantKeys) {
      info[key] = place[key];
    }

    // Swap longitudes and latitudes
    const oldPolygon = JSON.parse(place['geometry'])['coordinates'][0][0];
    const newPolygon = [];
    for (const coord of oldPolygon) {
      newPolygon.push([coord[1], coord[0]]);
    }
    info['geometry'] = newPolygon;

    communityAreas[place['slug']] = info;
  }

  yield put(addPlacesAC({ communityAreas }));
}

export function * fetchHospitals() {
  const firstResponse = yield api.get('/general/view/', {
    params: {
      resource: 'chi_health_atlas',
      category: 'hospitals',
      query: JSON.stringify({}),
    },
  });

  const hospitals = {};

  for (const h of firstResponse.data.data) {
    // Grab slug
    const slug = h['slug'];

    // Parse latLong
    const latLong = h['lat_long'].split(',');
    latLong[0] = parseFloat(latLong[0]);
    latLong[1] = parseFloat(latLong[1]);
    h['lat_long'] = latLong;

    hospitals[slug] = h;
  }

  yield put(addHospitalsAC({ hospitals }));

  yield take(addPlacesAC); // Wait till places are added
  const communityAreas = yield select(getCommunityAreas);

  for (const area in communityAreas) {
    const response = yield api.get('/general/view/', {
      params: {
        resource: 'chi_health_atlas',
        category: 'hospitals.area',
        query: JSON.stringify({"$where":[["geo_slug", "=", area]]}),
      },
    });

    if (response.data.data) {
      const data = response.data.data;
      const hospitals = {};

      for (const h of data) {
        // Grab slug
        const slug = h['slug'];

        // Parse latLong
        const latLong = h['lat_long'].split(',');
        latLong[0] = parseFloat(latLong[0]);
        latLong[1] = parseFloat(latLong[1]);
        h['lat_long'] = latLong;

        hospitals[slug] = h;
      }

      yield put(addHospitalsAC({ hospitals, area }));
    }
  }
}

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
