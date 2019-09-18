export const FETCH_PLACES = 'chicago-health-atlas/FETCH_PLACES';
export const ADD_PLACES = 'chicago-health-atlas/ADD_PLACES';
export const FETCH_HOSPITALS = 'chicago-health-atlas/FETCH_HOSPITALS';
export const ADD_HOSPITALS = 'chicago-health-atlas/ADD_HOSPITALS';

export const fetchPlacesAC = () => ({
  type: FETCH_PLACES,
});

export const addPlacesAC = ({ communityAreas }) => ({
  type: ADD_PLACES,
  payload: communityAreas,
});

export const fetchHospitalsAC = () => ({
  type: FETCH_HOSPITALS,
});

export const addHospitalsAC = ({ hospitals }) => ({
  type: ADD_HOSPITALS,
  payload: hospitals,
});
