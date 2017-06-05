import { createActions, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import moment from 'moment';

const d3 = require('d3-geo');

const createdActions = createActions({
  SET_MARKER: (coords, timestamp) => ({ coords, timestamp }),
  SET_VERSION: version => ({ version }),
  LOCATION_LOADING: location => ({ location }),
  LOCATION_LOADED: (location, data) => ({ location, data })
});
const asyncActions = {
  setLocation: location => (dispatch, getState) => {
    const { map: { version } } = getState();
    dispatch(createdActions.locationLoading(location));
    return fetch(`https://tempmap.s3.amazonaws.com/${location}.json?${version}`)
      .then(response => response.json())
      .then(json => dispatch(createdActions.locationLoaded(location, json)));
  }
};

const reducer = handleActions(
  {
    [createdActions.setVersion]: (state, { payload: { version } }) => ({
      ...state,
      version
    }),
    [createdActions.setMarker]: (state, action) => ({
      ...state,
      currentPosition: Object.assign({}, action.payload.coords, {
        timestamp: action.payload.timestamp
      })
    }),
    [createdActions.locationLoading]: (state, action) => ({
      ...state,
      isLoading: true,
      location: action.payload.location
    }),
    [createdActions.locationLoaded]: (state, action) => ({
      ...state,
      isLoading: false,
      location: action.payload.location,
      data: action.payload.data
    })
  },
  {
    version: 0
  }
);

/* eslint-disable global-require */
const placeData = {
  temps: {
    loadingImage: require('../images/temps.png'),
    title: 'San Francisco'
  },
  northbay: {
    loadingImage: require('../images/northbay.png'),
    title: 'North Bay'
  },
  eastbay: {
    loadingImage: require('../images/eastbay.png'),
    title: 'East Bay'
  },
  southbay: {
    loadingImage: require('../images/southbay.png'),
    title: 'South Bay'
  },
  bayarea: {
    loadingImage: require('../images/bayarea.png'),
    title: 'Bay Area'
  }
};
/* eslint-enable global-require */

const d3ScaleSelector = ({ map }) => map.data && map.data.d3.scale;
const d3TranslateSelector = ({ map }) => map.data && map.data.d3.translate;

const selectors = {
  location: ({ map }) => map.location,
  isLoading: ({ map }) => map.isLoading,
  data: ({ map }) => map.data,
  loadingImage: ({ map }) =>
    map.location && placeData[map.location].loadingImage,
  title: ({ map }) => map.location && placeData[map.location].title,
  currentPosition: ({ map }) => map.currentPosition,
  image_url: ({ map }) => `https://tempmap.s3.amazonaws.com/${map.data.png}`,
  when: ({ map }) =>
    moment(map.data.timestamp).local().format('MMMM Do YYYY [at] ha'),
  isNight: createSelector(
    ({ map }) => map.data && moment(map.data.sun.sunset),
    ({ map }) => map.data && moment(map.data.sun.sunrise),
    (sunset, sunrise) =>
      sunset && sunrise && (sunset.isBefore() || sunrise.isAfter())
  ),
  projection: createSelector(
    d3ScaleSelector,
    d3TranslateSelector,
    (scale, translate) => {
      if (scale !== undefined && translate !== undefined) {
        return d3.geoMercator().scale(scale).translate(translate);
      }
      return undefined;
    }
  )
};

export default {
  actions: {
    ...createdActions,
    ...asyncActions
  },
  reducer,
  selectors
};
