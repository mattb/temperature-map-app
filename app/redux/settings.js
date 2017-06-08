import { Dimensions } from 'react-native';
import { createSelector } from 'reselect';
import { createActions, handleActions } from 'redux-actions';

const actions = createActions({
  UPDATE_DIMENSIONS: () => {
    const { height, width } = Dimensions.get('window');
    return { height, width };
  },
  SET_UNIT: unit => ({ unit }),
  SET_DISPLAY_MODE: mode => ({ mode })
});

const defaultDimensions = (function getDimensions() {
  const { height, width } = Dimensions.get('window');
  return { height, width };
})();
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
    displayMode: 'name',
    dimensions: defaultDimensions,
    imageSize: {
      width: 375,
      height: 667
    }
  }
);

const selectors = {
  dimensions: state => state.settings.dimensions,
  displayMode: state => state.settings.displayMode,
  scale: createSelector(
    state => state.settings.dimensions,
    state => state.settings.imageSize,
    (dimensions, imageSize) => {
      const heightScale = dimensions.height / imageSize.height;
      const widthScale = dimensions.width / imageSize.width;
      return Math.max(heightScale, widthScale);
    }
  ),
  formatCelsiusTemperature: createSelector(
    state => state.settings.unit,
    unit => (c, label = false) => {
      let value;
      if (unit === 'F') {
        value = 32 + parseFloat(c, 10) * 9.0 / 5.0;
      } else {
        value = parseFloat(c, 10);
      }
      if (label) {
        return `${Math.round(value)}${unit}`;
      }
      return `${Math.round(value)}`;
    }
  )
};

export default {
  actions,
  reducer,
  selectors
};
