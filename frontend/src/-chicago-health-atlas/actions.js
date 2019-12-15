export const ADD_PLACES = 'chicago-health-atlas/ADD_PLACES';
export const ADD_HOSPITALS = 'chicago-health-atlas/ADD_HOSPITALS';

export const addPlacesAC = ({ communityAreas }) => ({
  type: ADD_PLACES,
  payload: communityAreas,
});

export const addHospitalsAC = ({ hospitals, area = '' }) => ({
  type: ADD_HOSPITALS,
  payload: { hospitals, area },
});
