export const FetchBase = 'FETCH/';
export const UPDATE_FILTER = 'UPDATE_FILTER';

export const fetchAC = (type) => ({
  type: FetchBase + type,
});

export const updateFilterAC = ({ type, num }) => ({
  type: UPDATE_FILTER,
  payload: { type, num },
});
