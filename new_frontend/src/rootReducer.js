import { combineReducers } from 'redux';

import { exampleReducers } from './reduxExample';
import { chicagoHealthAtlasReducers } from './chicago-health-atlas/reducers';

export default combineReducers({
  ...exampleReducers,
  ...chicagoHealthAtlasReducers,
});
