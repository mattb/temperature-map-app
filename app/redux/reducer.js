import { combineReducers } from 'redux';

import map from './map';
import settings from './settings';

export default function getReducer() {
  return combineReducers({
    map: map.reducer,
    settings: settings.reducer
  });
}
