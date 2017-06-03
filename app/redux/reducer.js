import { combineReducers } from 'redux';

import map from './map';

export default function getReducer() {
  return combineReducers({
    map: map.reducer
  });
}
