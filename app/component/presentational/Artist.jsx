import React from 'react';
import { shape, bool, number, string, func } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';

import DJKhaled from '@app/component/hoc/DJKhaled';
import Divider from '@app/component/styled/Divider';
import Track from '@app/component/presentational/Track';
import Button from '@app/component/styled/Button';
import { Share } from '@app/component/presentational/SVG';

const ArtistContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;

  .artist {
    flex: 1 0 auto;
    display: flex;
    flex-direction: row;
    margin-bottom: 2em;

    &__image {
      flex: 0 0 200px;
      height: 200px;
      width: 200px;
      border-radius: 50%;
      border: 1px solid ${props => props.theme.listDivider};
    }

    &__info {
      flex: 1 0 auto;
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

      .play-share {
        margin-top: 1em;
      }
    }
  }

  .album-list {
    &__album {
      margin-top: 2em;
      padding-bottom: 1px;
    }
  }

  .album {
    &__track-list {
      margin-top: 2em;
    }
  }

  .album-cover {
    display: flex;
    flex-direction: row;
    align-items: center;

    &__cover {
      width: 150px;
      height: 150px;
      flex: 0 0 150px;
      border-radius: 6px;
      border: 1px solid ${props => props.theme.listDivider};
    }

    &__info {
      flex: 1 0 auto;
      padding-left: 1em;
    }
  }

  .album-info {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    max-width: calc(100vw - (350px + 4em));

    &__year {
      font-size: 1.25em;
      color: ${props => props.theme.controlMute};
      margin: 0;
    }

    &__name {
      flex: 0 1 auto;
      font-size: 3em;
      font-weight: bold;
      padding: 0;
      margin: 0;
      margin-bottom: 0.25em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-decoration: none;
      color: inherit;
    }
  }

  .track-list {
    display: flex;
    flex-direction: column;
  }

  .appears-container {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding: 0 1em;

    &__list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  .appears-list {
    &__album {
      flex: 0 0 25%;

      @media(min-width: 1282px) {
        flex: 0 0 20%;
      }
    }
  }

  .appears-album {
    display: flex;
    flex-direction: column;
    padding: 0 1em;
    margin-bottom: 3em;
    text-decoration: none;
    color: inherit;

    &__cover {
      position: relative;
      width: 100%;
      height: auto;
      min-height: 225px;
      border-radius: 6px;
      border: 1px solid ${props => props.theme.listDivider};

      @media(min-width: 1284px) {
        height: 300px;
      }
    }

    &__name {
      margin: 0.5em 0;
    }

    &__year {
      margin: 0;
      color: ${props => props.theme.controlMute};
    }
  }
`;

const Arist = ({
  artist,
  current,
  playing,
  songCount,
  albumPlayingId,
  aristPlaying,
  artistPlayPause,
  trackPlayPause,
  albumPlayPause,
  contextMenuArtist,
  contextMenuAlbum,
  contextMenuTrack,
}) => (
  <ArtistContainer>
    <div className="artist">
      <div className="artist__image" style={{ background: `transparent url('${BASE_S3}${artist.artist_cover.s3_name}') 50% 50% / cover no-repeat` }} />
      <div className="artist__info">
        <p>ARTIST</p>
        <h1>{ artist.artist_name }</h1>
        <p style={{ marginTop: '0.25em' }}>{`${artist.relationships.album.length} album${artist.relationships.album.length > 1 ? 's' : ''}, ${songCount} song${songCount > 1 ? 's' : ''}`}</p>
        <div className="play-share">
          <Button className="play-share__play-big" onClick={artistPlayPause}>{`${playing && aristPlaying ? 'PAUSE' : 'PLAY'}`}</Button>
          <Button className="play-share__share" outline noPadding onClick={contextMenuArtist}><Share /></Button>
        </div>
      </div>
    </div>

    {
      artist.relationships.album.length === 0 ? null : <div className="album-list">
        <h2><Divider textTheme>Albums&nbsp;</Divider></h2>

        {
          artist.relationships.album.map(album => (
            <div className="album-list__album album" key={`${artist.artist_id}-${album.album_id}`}>
              <div className="album-cover">
                <Link to={`/album/${album.album_id}`} className="album-cover__cover" style={{ background: `transparent url('${BASE_S3}${album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
                <div className="album-cover__info album-info">
                  <p className="album-info__year">{ album.album_year }</p>
                  <Link className="album-info__name" to={`/album/${album.album_id}`}>{ album.album_name }</Link>
                  <div className="play-share">
                    <Button outline className="play-share__play-small" onClick={() => albumPlayPause(album.album_id)}>{`${playing && albumPlayingId === album.album_id ? 'PAUSE' : 'PLAY'}`}</Button>
                    <Button className="play-share__share" outline noPadding onClick={() => contextMenuAlbum(album.album_id)}><Share /></Button>
                  </div>
                </div>
              </div>

              <div className="album__track-list track-list">
                <Divider />
                {
                  album.relationships.track.map((track, index) => (
                    <Track
                      fullDetail={false}
                      key={track.track_id}
                      currentTrackId={current === null ? '' : current.track_id}
                      trackNumber={index + 1}
                      trackPlayPause={trackPlayPause}
                      playing={playing}
                      trackId={track.track_id}
                      trackName={track.track_name}
                      trackFeaturing={track.track_featuring}
                      trackAlbum={album}
                      trackDuration={track.track_track.s3_meta.duration}
                      contextMenuTrack={contextMenuTrack}
                    />
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    }

    {
      artist.relationships.track.length === 0 ? null : <div style={{ marginTop: '2em' }}>
        <h2><Divider textTheme>Appears On&nbsp;</Divider></h2>

        <div className="appears-container">
          <div className="appears-container__list appears-list">
            {
              artist.relationships.track.map(track => (
                <Link to={`/album/${track.track_album.album_id}`} className="appears-list__album appears-album">
                  <div className="appears-album__cover" style={{ background: `transparent url('${BASE_S3}${track.track_album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
                  <p className="appears-album__name">{track.track_album.album_name}</p>
                  <p className="appears-album__year">{track.track_album.album_year}</p>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    }
  </ArtistContainer>
);

Arist.propTypes = {
  artist: shape({}),
  current: shape({}),
  playing: bool,
  songCount: number,
  albumPlayingId: string,
  aristPlaying: bool,
  artistPlayPause: func.isRequired,
  songPlayPause: func.isRequired,
  albumPlayPause: func.isRequired,
  contextMenuArtist: func.isRequired,
  contextMenuAlbum: func.isRequired,
  contextMenuSong: func.isRequired,
};

Arist.defaultProps = {
  artist: null,
  current: null,
  playing: false,
  songCount: 0,
  albumPlayingId: '',
  aristPlaying: false,
};

module.exports = DJKhaled(Arist);
