import { combineReducers } from 'redux';

// Import reducers as objects with reducers in them
import { exampleReducers } from './reduxExample';
import { generalReducers } from './-general/reducers';

export default combineReducers({
  ...exampleReducers,
  ...generalReducers,
});
