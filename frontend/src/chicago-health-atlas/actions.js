export const FetchBase = 'chicago-health-atlas/FETCH/';
export const ADD_PLACES = 'chicago-health-atlas/ADD_PLACES';
export const ADD_HOSPITALS = 'chicago-health-atlas/ADD_HOSPITALS';
export const FILTER_AREAS_BY_NUM_OF_HOSPITALS = 'chicago-health-atlas/FILTER_AREAS_BY_NUM_OF_HOSPITALS';
export const ADD_TRAIN_STATIONS = 'chicago-health-atlas/ADD_TRAIN_STATIONS';

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

export const filterAreasByNumOfHospitalsAC = (num) => ({
  type: FILTER_AREAS_BY_NUM_OF_HOSPITALS,
  payload: num,
});

export const addTrainStationsAC = ({ stations }) => ({
  type: ADD_TRAIN_STATIONS,
  payload: stations,
});
