import { all } from 'redux-saga/effects';

// Import sagas as lists of sagas
import { exampleSagas } from './reduxExample';
import { chicagoHealthAtlasSagas } from './-chicago-health-atlas/sagas';
import { sodaChicagocitySagas } from './-soda-chicagocity/sagas';

export default function* rootSaga() {
  yield all([
    ...exampleSagas,
    ...chicagoHealthAtlasSagas,
    ...sodaChicagocitySagas,
  ]);
}
