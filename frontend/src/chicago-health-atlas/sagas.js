import { takeEvery } from 'redux-saga/effects';

import { FETCH_PLACES, FETCH_HOSPITALS } from './actions';
import { fetchPlaces, fetchHospitals } from './effects';

export function* fetchPlacesSaga() {
  yield takeEvery(FETCH_PLACES, fetchPlaces);
}

export function* fetchHospitalsSaga() {
  yield takeEvery(FETCH_HOSPITALS, fetchHospitals);
}

export const chicagoHealthAtlasSagas = [ fetchPlacesSaga(), fetchHospitalsSaga() ];
