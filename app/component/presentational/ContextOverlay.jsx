import React from 'react';
import { func } from 'prop-types';
import styled from '@emotion/styled';


const ContextOverlayContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 98;
`;

const ContextOverlay = ({
  contextMenuClose,
}) => <ContextOverlayContainer id="context-overlay-container" onClick={contextMenuClose} />;

ContextOverlay.propTypes = {
  contextMenuClose: func.isRequired,
};

export default ContextOverlay;
