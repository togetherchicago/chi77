export const ADD_PLACES = 'chicago-health-atlas/ADD_PLACES';
export const ADD_HOSPITALS = 'chicago-health-atlas/ADD_HOSPITALS';
export const ADD_TRAIN_STATIONS = 'chicago-health-atlas/ADD_TRAIN_STATIONS';

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
