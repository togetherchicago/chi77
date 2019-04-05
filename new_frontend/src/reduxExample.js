import { takeEvery } from 'redux-saga/effects';

// This would go in /actions
export const TEST = 'reduxExample/TEST';

export const testAC = () => ({
  type: TEST,
});

// This would go in /reducers
export function test(state = {}, action = {}) {
  switch (action.type) {
  case TEST:
    return {
      ...state,
      TEST
    };
  default:
    return state;
  }
}
export const exampleReducers = { test };

// This would go in /effects
export function* testEffect() {
  yield console.log('tested!');
}

// This would go in /sagas
export function* testSaga() {
  yield takeEvery(TEST, testEffect);
}
export const exampleSagas = [ testSaga() ];
