import {
  UPDATE_FILTER,
} from './actions';
import {
  ADD_PLACES as CHA_ADD_PLACES,
  ADD_HOSPITALS as CHA_ADD_HOSPITALS,
} from '../-chicago-health-atlas/actions';
import {
  ADD_TRAIN_STATIONS as SC_ADD_TRAIN_STATIONS,
} from '../-soda-chicagocity/actions';

export function communityAreas(state = {}, action = {}) {
  switch (action.type) {
  case CHA_ADD_PLACES:
    return {
      ...action.payload,
    };
  case CHA_ADD_HOSPITALS: {
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
  case CHA_ADD_HOSPITALS: {
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
  case SC_ADD_TRAIN_STATIONS:
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
