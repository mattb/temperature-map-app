import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { AsyncStorage } from 'react-native';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';

import getReducer from './reducer';

export default () => {
  const store = createStore(
    getReducer(),
    undefined,
    composeWithDevTools(
      autoRehydrate(),
      applyMiddleware(thunk, createActionBuffer(REHYDRATE))
    )
  );
  persistStore(store, { storage: AsyncStorage });
  return store;
};
