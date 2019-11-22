import { combineReducers } from 'redux';

import { exampleReducers } from './reduxExample';
import { generalReducers } from './-general/reducers';

export default combineReducers({
  ...exampleReducers,
  ...generalReducers,
});
