import { all } from 'redux-saga/effects';

import { exampleSagas } from './reduxExample';
import { chicagoHealthAtlasSagas } from './-chicago-health-atlas/sagas';

export default function* rootSaga() {
  yield all([
    ...exampleSagas,
    ...chicagoHealthAtlasSagas,
  ]);
}
