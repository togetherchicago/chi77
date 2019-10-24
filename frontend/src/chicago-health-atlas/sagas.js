import { takeEvery } from 'redux-saga/effects';

import { FetchBase } from './actions';
import {
  fetchPlaces,
  fetchHospitals,
  fetchTrainStations,
} from './effects';

export function* fetchPlacesSaga() {
  yield takeEvery(FetchBase + "PLACES", fetchPlaces);
}

export function* fetchHospitalsSaga() {
  yield takeEvery(FetchBase + "HOSPITALS", fetchHospitals);
}

export function* fetchTrainStationsSaga() {
  yield takeEvery(FetchBase + "TRAIN_STATIONS", fetchTrainStations);
}

export const chicagoHealthAtlasSagas = [
  fetchPlacesSaga(),
  fetchHospitalsSaga(),
  fetchTrainStationsSaga(),
];
