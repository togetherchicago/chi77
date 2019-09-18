import { ADD_PLACES, ADD_HOSPITALS } from './actions';

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

export function hospitals(state = {}, action = {}) {
  switch (action.type) {
    case ADD_HOSPITALS:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

export const chicagoHealthAtlasReducers = { communityAreas, hospitals };
