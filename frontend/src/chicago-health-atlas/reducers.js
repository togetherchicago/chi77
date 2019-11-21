import {
  ADD_PLACES,
  ADD_HOSPITALS,
  FILTER_AREAS_BY_NUM_OF_HOSPITALS,
  ADD_TRAIN_STATIONS,
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

export function filterAreasByNumOfHospitals(state = 0, action = {}) {
  switch (action.type) {
  case FILTER_AREAS_BY_NUM_OF_HOSPITALS:
    return action.payload;
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

export const chicagoHealthAtlasReducers = {
  communityAreas,
  hospitals,
  filterAreasByNumOfHospitals,
  trainStations,
};
