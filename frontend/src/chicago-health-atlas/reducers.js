import { ADD_PLACES, ADD_HOSPITALS } from './actions';

export function communityAreas(state = {}, action = {}) {
  switch (action.type) {
  case ADD_PLACES:
    return {
      ...action.payload,
    };
  case ADD_HOSPITALS: {
    const { hospitals, area } = action.payload;
    return {
      ...state,
      [area]: {
        ...(state[area]),
        hospitals: hospitals,
      },
    };
  }
  default:
    return state;
  }
}

export const chicagoHealthAtlasReducers = { communityAreas };
