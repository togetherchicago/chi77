export const FetchBase = 'FETCH/';
export const UPDATE_FILTER = 'UPDATE_FILTER';
export const UPDATE_OVERLAY = 'UPDATE_OVERLAY';

export const fetchAC = (type) => ({
  type: FetchBase + type,
});

export const updateFilterAC = ({ type, num }) => ({
  type: UPDATE_FILTER,
  payload: { type, num },
});

export const updateOverlayAC = (slug) => ({
  type: UPDATE_OVERLAY,
  payload: slug,
});
