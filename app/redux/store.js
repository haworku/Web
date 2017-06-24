/* global window */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import theme from 'app/redux/reducer/theme';
import volume from 'app/redux/reducer/volume';
import repeat from 'app/redux/reducer/repeat';
import shuffle from 'app/redux/reducer/shuffle';
import crossfade from 'app/redux/reducer/crossfade';
import playing from 'app/redux/reducer/playing';
import duration from 'app/redux/reducer/duration';
import playbackPosition from 'app/redux/reducer/playbackPosition';
import remaining from 'app/redux/reducer/remaining';

import rootSaga from 'app/redux/saga/sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({
    theme,
    volume,
    repeat,
    shuffle,
    crossfade,
    playing,
    duration,
    playbackPosition,
    remaining,
  }),
  {
    theme: 'dark',
    volume: 1,
    // queue: [],
    // history: [],
    // match: [],
    // saved: [],
    // playlist: [],
    crossfade: 0,
    duration: null,
    playbackPosition: null,
    remaining: false,
    // artworkFull: false,
    playing: false,
    shuffle: false,
    repeat: 'OFF',
    // current: null,
    // online: false,
    // loading: false,
  },
  window.devToolsExtension
    ? compose(applyMiddleware(sagaMiddleware), window.devToolsExtension())
    : applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

module.exports = store;
