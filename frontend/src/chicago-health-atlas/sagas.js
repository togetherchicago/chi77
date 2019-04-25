import { takeEvery } from 'redux-saga/effects';

import { FETCH_PLACES } from './actions';
import { fetchPlaces } from './effects';

export function* fetchPlacesSaga() {
  yield takeEvery(FETCH_PLACES, fetchPlaces);
}
export const chicagoHealthAtlasSagas = [ fetchPlacesSaga() ];
