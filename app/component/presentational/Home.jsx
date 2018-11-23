import React from 'react';
import {
  bool,
  func,
  string,
  arrayOf,
  shape,
} from 'prop-types';

import Playlist from '@app/component/presentational/Playlist';
import HeaderView from '@app/component/styled/HeaderView';

const Home = ({
  playing,
  featured,
  featuredPlayingId,
  featuredPlay,
}) => (
  <HeaderView>
    <div className="__header">
      <h1 className="m-0">Featured</h1>
    </div>

    <div className="__view">
      {
        featured.map(_featured => (
          <Playlist
            type="featured"
            key={_featured.playlist_id}
            id={_featured.playlist_id}
            playing={playing}
            play={featuredPlay}
            playingId={featuredPlayingId}
            name={_featured.playlist_name}
            description={_featured.playlist_description}
            cover={_featured.playlist_cover}
            trackCount={_featured.playlist_track.length}
          />
        ))
      }
    </div>
  </HeaderView>
);

Home.propTypes = {
  playing: bool,
  featured: arrayOf(shape({})),
  featuredPlayingId: string,
  featuredPlay: func.isRequired,
};

Home.defaultProps = {
  playing: false,
  featured: [],
  featuredPlayingId: '',
};

export default Home;
