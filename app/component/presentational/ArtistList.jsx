import React, { Fragment } from 'react';
import { arrayOf, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';

const Muted = styled.span`
  color: ${props => props.theme.controlMute};
`;

const ArtistList = ({
  artists,
}) => (
  <Fragment>
    {
      artists.map((artist, index) => (
        <Link to={`/artist/${artist.artist_id}`} key={artist.artist_id}>
          <span>{artist.artist_name}</span>{ (artists.length > 1 && (index < artists.length - 1)) ? <span>{ (index < artists.length - 2) ? <Muted>,</Muted> : <Muted>&nbsp;&amp;</Muted> } </span> : null }
        </Link>
      ))
    }
  </Fragment>
);

ArtistList.propTypes = {
  artists: arrayOf(shape({})),
};

ArtistList.defaultProps = {
  artists: [],
};

module.exports = ArtistList;
