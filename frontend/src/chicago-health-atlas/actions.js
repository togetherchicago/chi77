export const FETCH_PLACES = 'chicago-health-atlas/FETCH_PLACES';
export const ADD_PLACES = 'chicago-health-atlas/ADD_PLACES';

export const fetchPlacesAC = () => ({
  type: FETCH_PLACES,
});

export const addPlacesAC = ({ communityAreas }) => ({
  type: ADD_PLACES,
  payload: communityAreas,
});
