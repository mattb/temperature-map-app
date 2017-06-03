import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import getReducer from './reducer';

export default () =>
  createStore(getReducer(), composeWithDevTools(applyMiddleware(thunk)));
