import { put, call, select, take } from 'redux-saga/effects';

import { api } from '../api';
import { addPlacesAC, addHospitalsAC } from './actions';
import { getCommunityAreas } from '../selectors';

function parsePlaces(data) {
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
  return communityAreas;
}

function parseHospitals(data) {
  const hospitals = {};

  for (const h of data) {
    // Grab slug
    const slug = h['slug'];

    // Flip latLong
    const latLong = h['lat_long'].split(',');
    latLong[0] = parseFloat(latLong[0]);
    latLong[1] = parseFloat(latLong[1]);
    h['lat_long'] = latLong;

    hospitals[slug] = h;
  }

  return hospitals;
}

export function * fetchPlaces() {
  const response = yield api.get('/', {
    params: {
      resource: 'chi_health_atlas',
      category: 'places',
      query: JSON.stringify({}),
    },
  });

  const communityAreas = yield call(parsePlaces, response.data.data);

  yield put(addPlacesAC({ communityAreas }));
}

export function * fetchHospitals() {
  yield take(addPlacesAC); // Wait till places are added
  const communityAreas = yield select(getCommunityAreas);

  for (const area in communityAreas) {
    const response = yield api.get('/', {
      params: {
        resource: 'chi_health_atlas',
        category: 'hospitals.area',
        query: JSON.stringify({"$where":[["geo_slug", "=", area]]}),
      },
    });

    if (response.data.data) {
      const hospitals = yield call(parseHospitals, response.data.data);

      yield put(addHospitalsAC({ hospitals, area }));
    }
  }
}
