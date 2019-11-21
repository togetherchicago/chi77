export const FetchBase = 'chicago-health-atlas/FETCH/';
export const ADD_PLACES = 'chicago-health-atlas/ADD_PLACES';
export const ADD_HOSPITALS = 'chicago-health-atlas/ADD_HOSPITALS';
export const ADD_TRAIN_STATIONS = 'chicago-health-atlas/ADD_TRAIN_STATIONS';
export const UPDATE_FILTER = 'chicago-health-atlas/UPDATE_FILTER';

export const fetchAC = (type) => ({
  type: FetchBase + type,
});

export const addPlacesAC = ({ communityAreas }) => ({
  type: ADD_PLACES,
  payload: communityAreas,
});

export const addHospitalsAC = ({ hospitals, area = '' }) => ({
  type: ADD_HOSPITALS,
  payload: { hospitals, area },
});

export const addTrainStationsAC = ({ stations }) => ({
  type: ADD_TRAIN_STATIONS,
  payload: stations,
});

export const updateFilterAC = ({ type, num }) => ({
  type: UPDATE_FILTER,
  payload: { type, num },
});
