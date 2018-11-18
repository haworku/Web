/* global window, document */

import { useEffect } from 'react';
import debounce from 'lodash/debounce';

import { PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import store from '@app/redux/store';

// we're leaving Redux Saga `throttle` effects - RAW
// we need to prevent scrolling on space and fire `PLAY_PAUSE_REQUEST` after `KEY`s
const KEY = 'keydown';
const WAIT = 64;

const SpaceContainer = () => {
  useEffect(() => {
    document.querySelector('body').addEventListener(KEY, debounce((e) => {
      if (e.key !== ' ' || window.location.pathname.includes('/search') === true) {
        return;
      }

      e.preventDefault();
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }, WAIT, {
      leading: true,
      trailing: false,
    }), { passive: false });
  }, []);

  return null;
};

export default SpaceContainer;
