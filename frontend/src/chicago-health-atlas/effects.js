import { put, call } from 'redux-saga/effects';

import { api } from '../api';
import { addPlacesAC, addHospitalsAC } from './actions';

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
  let hospitals = {};

  for (const h of data) {
    let currentHospital = {};

    // Grab slug
    let slug = h['slug'];
    currentHospital['slug'] = slug;
    
    // Parse latLong
    let latLong = h['lat_long'].split(',');
    latLong[0] = parseFloat(latLong[0]);
    latLong[1] = parseFloat(latLong[1]);
    currentHospital['lat_long'] = latLong;

    // Grab name
    currentHospital['name'] = h['name'];

    hospitals[slug] = currentHospital;
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

  const communityAreas = yield call(parsePlaces, response.data);

  yield put(addPlacesAC({ communityAreas }));
}

export function * fetchHospitals() {
  const response = yield api.get('/', {
    params: {
      resource: 'chi_health_atlas',
      category: 'hospitals',
      query: JSON.stringify({}),
    },
  });

  const hospitals = yield call(parseHospitals, response.data);
  
  yield put(addHospitalsAC({ hospitals }));
}
