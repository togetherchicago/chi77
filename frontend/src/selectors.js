export const getCommunityAreas = (state) => state.communityAreas;
export const getHospitals = (state) => state.hospitals;
export const getTrainStations = (state) => state.trainStations;
export const getFilter = (state, type) => state.filters[type] || 0;
export const getOverlay = (state) => state.overlay;
