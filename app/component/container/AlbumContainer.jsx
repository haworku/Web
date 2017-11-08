import React, { Component } from 'react';
import { bool, string, shape } from 'prop-types';
import { connect } from 'react-redux';

import { BASE } from '@app/config/api';
import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK, CONTEXT_ALBUM } from '@app/redux/constant/contextMenu';
import trackListSame from '@app/util/trackListSame';
import { human } from '@app/util/time';
import api from '@app/util/api';
import track from '@app/util/track';

import Album from '@app/component/presentational/Album';

import { loading } from '@app/redux/action/loading';
import store from '@app/redux/store';

class AlbumContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      album: null,
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      albumPlaying: false,
    };
    this.albumPlayPause = this.albumPlayPause.bind(this);
    this.trackPlayPause = this.trackPlayPause.bind(this);
    this.contextMenuAlbum = this.contextMenuAlbum.bind(this);
    this.contextMenuTrack = this.contextMenuTrack.bind(this);
  }

  componentDidMount() {
    store.dispatch(loading(true));
    api(`${BASE}album/${this.props.match.params.id}`, undefined, (cancel) => {
      this.cancelRequest = cancel;
    }).then(({ data, included }) => {
      store.dispatch(loading(false));
      const paramTrackId = this.props.match.params.trackId;
      let albumTrack = [];

      if (paramTrackId === undefined) {
        albumTrack = data.relationships.track.map(trackId => included.track[trackId]);
      } else {
        albumTrack = data.relationships.track
          .filter(trackId => paramTrackId === trackId)
          .map(trackId => included.track[trackId]);
      }

      const tracks = track(albumTrack, included);

      this.setState(() => ({
        album: {
          album_id: data.album_id,
          album_name: data.album_name,
          album_artist: data.album_artist.map(artistId => included.artist[artistId]),
          album_cover: included.s3[data.album_cover],
          album_year: data.album_year,
          relationships: {
            track: tracks,
          },
        },
        duration: human(tracks.reduce((totalD, t) => totalD + t.track_track.s3_meta.duration, 0), true),
      }), () => {
        const { queueInitial } = store.getState();

        if (queueInitial.length === 0 || this.state.album.relationships.track.length === 0) {
          this.setState(() => ({
            albumPlaying: false,
          }));

          return;
        }

        this.setState(() => ({
          albumPlaying: trackListSame(this.state.album.relationships.track, queueInitial),
        }));
      });
    }, (err) => {
      store.dispatch(loading(false));

      if (err.message === 'Network Error') {
        store.dispatch({
          type: NOTIFICATION_ON_REQUEST,
          payload: {
            message: 'No Internet connection. Please try again later',
          },
        });

        return;
      }

      store.dispatch({
        type: NOTIFICATION_ON_REQUEST,
        payload: {
          message: 'ይቅርታ, unable to fetch Album',
        },
      });
    });
  }

  componentWillUnmount() {
    store.dispatch(loading(false));
    this.cancelRequest();
  }

  albumPlayPause() {
    if (this.state.album === null) {
      return;
    }

    // booting playlist
    if (this.props.current === null || this.state.albumPlaying === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.state.album.relationships.track[0],
          queue: this.state.album.relationships.track,
          queueInitial: this.state.album.relationships.track,
        },
      });

      this.setState(() => ({
        albumPlaying: true,
      }));
      // resuming / pausing playlist
    } else if (this.props.current !== null) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }
  }

  trackPlayPause(trackId) {
    if (this.props.current !== null && this.props.current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIdIndex = this.state.album.relationships.track.findIndex(t => t.track_id === trackId);

    if (trackIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.album.relationships.track[trackIdIndex],
        queue: this.state.album.relationships.track,
        queueInitial: this.state.album.relationships.track,
      },
    });

    this.setState(() => ({
      albumPlaying: true,
    }));
  }

  contextMenuAlbum() {
    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ALBUM,
        payload: this.state.album,
      },
    });
  }

  contextMenuTrack(trackId) {
    const trackIndex = this.state.album.relationships.track.findIndex(t => t.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: this.state.album.relationships.track[trackIndex],
      },
    });
  }

  render() {
    if (this.state.album === null) {
      return null;
    }

    return (
      <Album
        current={this.props.current}
        playing={this.props.playing}
        albumPlaying={this.state.albumPlaying}
        duration={this.state.duration}
        title={this.state.album.album_name}
        cover={this.state.album.album_cover}
        artist={this.state.album.album_artist}
        tracks={this.state.album.relationships.track}
        albumPlayPause={this.albumPlayPause}
        trackPlayPause={this.trackPlayPause}
        contextMenuAlbum={this.contextMenuAlbum}
        contextMenuTrack={this.contextMenuTrack}
      />
    );
  }
}

AlbumContainer.propTypes = {
  current: shape({}),
  playing: bool,
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

AlbumContainer.defaultProps = {
  current: null,
  playing: false,
};

module.exports = connect(state => ({
  current: state.current,
  playing: state.playing,
}))(AlbumContainer);
