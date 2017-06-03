import { createActions, handleActions } from 'redux-actions';

const actions = createActions({
  SET_LOCATION: location => ({ location })
});

const reducer = handleActions(
  {
    [actions.setLocation]: (state, action) => ({
      location: action.payload.location
    })
  },
  {
    location: 'temps'
  }
);

const selectors = {
  location: state => state.location
};

export default {
  actions,
  reducer,
  selectors
};
