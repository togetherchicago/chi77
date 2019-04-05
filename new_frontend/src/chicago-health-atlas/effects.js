import { put, call } from 'redux-saga/effects';

import { api } from '../api';
import { addPlacesAC } from './actions';

function parsePlaces(data) {
  /* eslint-disable camelcase */
  const relevant_keys = ['part', 'resource_cnt', 'name'];
  const community_areas = {};
  for (const place of data['community_areas']) {

    const info = {};
    for (const key of relevant_keys) {
      info[key] = place[key];
    }

    // Swap longitudes and latitudes
    const old_polygon = JSON.parse(place['geometry'])['coordinates'][0][0];
    const new_polygon = [];
    for (const coord of old_polygon) {
      new_polygon.push([coord[1], coord[0]]);
    }
    info['geometry'] = new_polygon;

    community_areas[place['slug']] = info;
  }
  return community_areas;
  /* eslint-enable camelcase */
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
