import { ADD_PLACES } from './actions';

export function communityAreas(state = {}, action = {}) {
  switch (action.type) {
  case ADD_PLACES:
    return {
      ...action.payload,
    };
  default:
    return state;
  }
}
export const chicagoHealthAtlasReducers = { communityAreas };
