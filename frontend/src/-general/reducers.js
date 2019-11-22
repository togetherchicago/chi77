import {
  UPDATE_FILTER,
} from './actions';
import chicagoHealthAtlasActions from '../-chicago-health-atlas/actions';
import sodaChicagocityActions from '../-soda-chicagocity/actions';

export function communityAreas(state = {}, action = {}) {
  switch (action.type) {
  case chicagoHealthAtlasActions.ADD_PLACES:
    return {
      ...action.payload,
    };
  case chicagoHealthAtlasActions.ADD_HOSPITALS: {
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
  case chicagoHealthAtlasActions.ADD_HOSPITALS: {
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
  case sodaChicagocityActions.ADD_TRAIN_STATIONS:
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

export const generalReducers = {
  communityAreas,
  hospitals,
  trainStations,
  filters,
};
