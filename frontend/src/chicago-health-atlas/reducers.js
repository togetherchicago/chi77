import {
  ADD_PLACES,
  ADD_HOSPITALS,
  ADD_TRAIN_STATIONS,
  UPDATE_FILTER,
} from './actions';

export function communityAreas(state = {}, action = {}) {
  switch (action.type) {
  case ADD_PLACES:
    return {
      ...action.payload,
    };
  case ADD_HOSPITALS: {
    const { hospitals, area } = action.payload;
    if (area) {
      return {
        ...state,
        [area]: {
          ...(state[area]),
          hospitals: Object.keys(hospitals),
        },
      };
    }
    return state;
  }
  default:
    return state;
  }
}

export function hospitals(state = {}, action = {}) {
  switch (action.type) {
  case ADD_HOSPITALS: {
    const { hospitals } = action.payload;
    return {
      ...state,
      ...hospitals,
    };
  }
  default:
    return state;
  }
}

export function trainStations(state = {}, action = {}) {
  switch (action.type) {
  case ADD_TRAIN_STATIONS:
    return {
      ...action.payload,
    };
  default:
    return state;
  }
}

export function filters(state = {}, action = {}) {
  switch (action.type) {
  case UPDATE_FILTER: {
    const { type, num } = action.payload;
    return {
      ...state,
      [type]: num,
    };
  }
  default:
    return state;
  }
}

export const chicagoHealthAtlasReducers = {
  communityAreas,
  hospitals,
  trainStations,
  filters,
};
