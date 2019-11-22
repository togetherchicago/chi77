export const ADD_TRAIN_STATIONS = 'soda-chicagocity/ADD_TRAIN_STATIONS';

export const addTrainStationsAC = ({ stations }) => ({
  type: ADD_TRAIN_STATIONS,
  payload: stations,
});
