/* eslint no-console: 0 */

import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import styled from 'emotion/react';
import flatten from 'lodash/flatten';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';

import { human } from '@app/util/time';
import Divider from '@app/component/styled/Divider';
import Button from '@app/component/styled/Button';
import api from '@app/util/api';
import store from '@app/redux/store';

const ArtistContainer = styled.div`
  display: flex;
  flex-direction: column;

  .artist {
    flex: 1 0 auto;
    display: flex;
    flex-direction: row;
    padding: 1em 2em;

    &__image {
      flex: 0 0 200px;
      height: 200px;
      width: 200px;
      border: 1px solid rgba(51, 51, 51, 0.25);
      border-radius: 50%;
    }

    &__info {
      display: flex;
      flex-direction: column;
      margin-left: 1em;
      justify-content: center;

      & > * {
        margin: 0;
      }

      & > p:not(:first-child) {
        color: ${props => props.theme.controlMute};
      }

      button {
        width: 175px;
        margin-top: 1em;
      }
    }
  }

  .album-list {
    padding: 0 2em;

    &__album {
      margin-top: 2em;
      padding-bottom: 1px;
    }
  }

  .album {
    &__song-list {
      margin-top: 1em;
    }
  }

  .album-cover {
    display: flex;
    flex-direction: row;
    align-items: center;

    &__cover {
      width: 150px;
      height: 150px;
      flex: 0 1 auto;
      border: 1px solid rgba(51, 51, 51, 0.25);
    }

    &__info {
      flex: 1 0 auto;
      padding-left: 1em;
    }
  }

  .album-info {
    display: flex;
    flex-direction: column;

    &__name {
      font-size: 3em;
      padding: 0;
      margin: 0;
      margin-bottom: 0.25em;
    }

    &__button {
      width: 125px;
    }
  }

  .song-list {
    display: flex;
    flex-direction: column;

    &__song {
      border-bottom: 1px solid ${props => props.theme.controlBackground};
    }
  }

  .song {
    display: flex;
    flex-direction: row;

    & > * {
      padding: 0.8em 0;
    }

    &__track-number-icon {
      padding-left: 0.5em;
      flex: 0 0 4%;
    }

    &:hover {
      background-color: ${props => props.theme.controlBackground};

      .track-number-icon {
        &__number {
          display: none;
        }

        &__icon {
          display: block;
        }
      }
    }

    &__name {
      flex: 1 1 auto;
    }

    &__duration {
      text-align: right;
      flex: 0 0 6%;
      padding-right: 0.5em;
    }
  }

  .track-number-icon {
    position: relative;

    &__number {
      display: block;
    }

    &__icon {
      display: none;
      position: absolute;
      left: 0.25em;
      top: 6px;
      font-size: 2em;
    }
  }
`;

class Artist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      current: null,
      playing: false,
      songCount: 0,
      albumPlayingIndex: -1,
    };

    this.togglePlayPauseArtist = this.togglePlayPauseArtist.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
    this.togglePlayPauseAlbum = this.togglePlayPauseAlbum.bind(this);
  }

  componentDidMount() {
    api(`${BASE}/json/artist/${this.props.match.params.id}.json`)
      .then((data) => {
        this.setState(() => ({
          artist: data,
          // eslint-disable-next-line
          songCount: data.albums.reduce((totalSongCount, album) => totalSongCount + album.songs.length, 0),
        }));
      }, (err) => {
        console.log(err);
      });

    this.unsubscribe = store.subscribe(() => {
      if (this.state.artist === null) {
        return;
      }

      const { playing, current, initialQueue } = store.getState();
      this.setState(() => ({ playing, current, initialQueue }));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  togglePlayPauseArtist() {
    if (this.state.artist === null) {
      return;
    }

    // booting playlist
    if (this.state.current === null) {
      const flattenSongs = flatten(this.state.artist.albums.map(album => album.songs));

      store.dispatch({
        type: PLAY,
        payload: {
          play: flattenSongs[0],
          queue: flattenSongs,
          initialQueue: flattenSongs,
        },
      });

      // resuming / pausing playlist
    } else if (this.state.current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPauseAlbum(album, albumIndex) {
    console.log('album', album, albumIndex);
  }

  togglePlayPauseSong(songId) {
    console.log('play', songId);
  }


  render() {
    if (this.state.artist === null) {
      return null;
    }

    return (
      <ArtistContainer>
        <div className="artist">
          <div className="artist__image" style={{ background: `transparent url('${BASE}${this.state.artist.thumbnail}') 50% 50% / cover no-repeat` }} />
          <div className="artist__info">
            <p>ARTIST</p>
            <h1>{ this.state.artist.artistName }</h1>
            <p style={{ marginTop: '0.5em' }}>{`${this.state.artist.albums.length} album${this.state.artist.albums.length > 1 ? 's' : ''}, ${this.state.songCount} song${this.state.songCount > 1 ? 's' : ''}`}</p>
            <Button onClick={this.togglePlayPauseArtist}>{`${this.state.playing ? 'PAUSE' : 'PLAY'}`}</Button>
          </div>
        </div>

        <Divider />

        <div className="album-list">
          <h3>Albums</h3>

          {
            this.state.artist.albums.map((album, albumIndex) => (
              <div className="album-list__album album" key={`${this.state.artist.artistId}-${album.albumName}`}>
                <div className="album-cover">
                  <div className="album-cover__cover" style={{ background: `transparent url('${album.albumPurl ? `${BASE}${album.albumPurl.replace('_icon_', '_cover_')}` : 'app/static/image/brand.png'}') 50% 50% / cover no-repeat` }} />
                  <div className="album-cover__info album-info">
                    <h1 className="album-info__name">{ album.albumName }</h1>
                    <Button className="album-info__button" onClick={() => this.togglePlayPauseAlbum(album, albumIndex)}>{`${this.state.playing && this.state.albumPlayingIndex === albumIndex ? 'PAUSE' : 'PLAY'}`}</Button>
                  </div>
                </div>

                <div className="album__song-list song-list">
                  {
                    album.songs.map((song, songIndex) => (
                      <div key={song.songId} onDoubleClick={() => this.togglePlayPauseSong(song.songId)} className="song-list__song song">
                        <div className="song__track-number-icon track-number-icon">
                          <div className="track-number-icon__number">{ songIndex + 1 }</div>
                          <i className={`track-number-icon__icon icon-ion-ios-${this.state.current !== null && this.state.current.songId === song.songId && this.state.playing ? 'pause' : 'play'}`} onClick={() => this.togglePlayPauseSong(song.songId)} />
                        </div>
                        <div className="song__name">{ song.songName }</div>
                        <div className="song__duration">{ human(song.songPlaytime) }</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      </ArtistContainer>
    );
  }
}

Artist.propTypes = {
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

Artist.defaultProps = {};

module.exports = Artist;