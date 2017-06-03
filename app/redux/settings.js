import { Dimensions } from 'react-native';
import { createActions, handleActions } from 'redux-actions';

const actions = createActions({
  UPDATE_DIMENSIONS: () => {
    const { height, width } = Dimensions.get('window');
    return { height, width };
  },
  SET_UNIT: unit => ({ unit }),
  SET_DISPLAY_MODE: mode => ({ mode })
});

const reducer = handleActions(
  {
    [actions.setDisplayMode]: (state, action) => ({
      ...state,
      displayMode: action.payload.mode
    }),
    [actions.setUnit]: (state, action) => ({
      ...state,
      unit: action.payload.unit
    }),
    [actions.updateDimensions]: (state, action) => ({
      ...state,
      dimensions: {
        width: action.payload.width,
        height: action.payload.height
      }
    })
  },
  {
    unit: 'F',
    displayMode: 'name'
  }
);

const selectors = {
  dimensions: state => state.settings.dimensions,
  displayMode: state => state.settings.displayMode
};

export default {
  actions,
  reducer,
  selectors
};
