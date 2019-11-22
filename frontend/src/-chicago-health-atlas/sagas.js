import { takeEvery } from 'redux-saga/effects';

import { FetchBase } from '../-general/actions';
import {
  fetchPlaces,
  fetchHospitals,
} from './effects';

export function* fetchPlacesSaga() {
  yield takeEvery(FetchBase + "PLACES", fetchPlaces);
}

export function* fetchHospitalsSaga() {
  yield takeEvery(FetchBase + "HOSPITALS", fetchHospitals);
}

export const chicagoHealthAtlasSagas = [
  fetchPlacesSaga(),
  fetchHospitalsSaga(),
];
