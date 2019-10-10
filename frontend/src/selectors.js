export const getCommunityAreas = (state) => state.communityAreas;
export const getHospitals = (state) => {
  let hospitals = {};
  for (const area in state.communityAreas) {
    hospitals = {...hospitals, ...(state.communityAreas[area].hospitals)};
  }
  return hospitals;
};
export const getFilterAreasByNumOfHospitals = (state) => state.filterAreasByNumOfHospitals;
