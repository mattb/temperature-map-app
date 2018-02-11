import { createActions, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import moment from 'moment';

const d3 = require('d3-geo');

const createdActions = createActions({
  SET_MARKER: (coords, timestamp) => ({ coords, timestamp }),
  LOCATION_LOADING: (location, version) => ({ location, version }),
  LOCATION_LOADED: (location, version, data) => ({ location, version, data })
});
const asyncActions = {
  setLocation: ({ location, versionUpdate }) => (dispatch, getState) => {
    let theVersion;
    if (versionUpdate) {
      theVersion = (new Date().getTime() / 1000 / 60).toFixed(0);
    } else {
      theVersion = getState().map.version;
    }
    const theLocation = location || getState().map.location;
    if (
      theVersion === getState().map.version &&
      theLocation === getState().map.location
    ) {
      return;
    }
    dispatch(createdActions.locationLoading(theLocation, theVersion));
    console.log(
      `https://tempmap.s3.amazonaws.com/${theLocation}.json?${theVersion}`
    );
    fetch(`https://tempmap.s3.amazonaws.com/${theLocation}.json?${theVersion}`)
      .then(response => response.json())
      .then(json =>
        dispatch(createdActions.locationLoaded(theLocation, theVersion, json))
      );
  }
};

const reducer = handleActions(
  {
    [createdActions.setMarker]: (state, action) => ({
      ...state,
      currentPosition: Object.assign({}, action.payload.coords, {
        timestamp: action.payload.timestamp
      })
    }),
    [createdActions.locationLoading]: (state, action) => ({
      ...state,
      isLoading: true,
      location: action.payload.location,
      version: action.payload.version
    }),
    [createdActions.locationLoaded]: (state, action) => ({
      ...state,
      isLoading: false,
      location: action.payload.location,
      version: action.payload.version,
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
  image_url: ({ map }) =>
    (map.data && `https://tempmap.s3.amazonaws.com/${map.data.png}`) || '',
  when: ({ map }) => {
    if (!map.data) {
      return '';
    }
    const m = moment(map.data.timestamp);
    if (m.isAfter(moment().subtract(1, 'day'))) {
      return m.local().format('[at] ha');
    }
    return m.local().format('MMMM Do YYYY [at] ha');
  },
  isNight: createSelector(
    ({ map }) => map.data && moment(map.data.sun.sunset),
    ({ map }) => map.data && moment(map.data.sun.sunrise),
    (sunset, sunrise) =>
      sunset && sunrise && (sunset.isBefore() || sunrise.isAfter())
  ),
  sunriseSunset: createSelector(
    ({ map }) => map.data && moment(map.data.sun.sunset),
    ({ map }) => map.data && moment(map.data.sun.sunrise),
    (sunset, sunrise) => {
      if (!sunset || !sunrise) {
        return undefined;
      }
      if (sunset.isBefore() || sunrise.isAfter()) {
        return `sunrise at ${sunrise.local().format('h:mma')}`;
      }
      return `sunset at ${sunset.local().format('h:mma')}`;
    }
  ),
  projection: createSelector(
    d3ScaleSelector,
    d3TranslateSelector,
    (scale, translate) => {
      if (scale !== undefined && translate !== undefined) {
        return d3
          .geoMercator()
          .scale(scale)
          .translate(translate);
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
