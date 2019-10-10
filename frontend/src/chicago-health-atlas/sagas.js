import { takeEvery } from 'redux-saga/effects';

import {
  FETCH_PLACES,
  FETCH_HOSPITALS,
  FETCH_TRAIN_STATIONS,
} from './actions';
import {
  fetchPlaces,
  fetchHospitals,
  fetchTrainStations,
} from './effects';

export function* fetchPlacesSaga() {
  yield takeEvery(FETCH_PLACES, fetchPlaces);
}

export function* fetchHospitalsSaga() {
  yield takeEvery(FETCH_HOSPITALS, fetchHospitals);
}

export function* fetchTrainStationsSaga() {
  yield takeEvery(FETCH_TRAIN_STATIONS, fetchTrainStations);
}

export const chicagoHealthAtlasSagas = [
  fetchPlacesSaga(),
  fetchHospitalsSaga(),
  fetchTrainStationsSaga(),
];
