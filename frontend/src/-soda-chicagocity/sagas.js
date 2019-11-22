import { takeEvery } from 'redux-saga/effects';

import { FetchBase } from '../-general/actions';
import {
  fetchTrainStations,
} from './effects';

export function* fetchTrainStationsSaga() {
  yield takeEvery(FetchBase + "TRAIN_STATIONS", fetchTrainStations);
}

export const sodaChicagocitySagas = [
  fetchTrainStationsSaga(),
];
