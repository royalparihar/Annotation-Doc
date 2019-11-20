import React from 'react';
import PropTypes from 'prop-types';

const Mark = ({
  color,
  index,
  content,
}) => (
  <span
    style={{ color: color || 'black' }}
    key={index}
    data-i={index}
  >
    {content || ' '}
  </span>
);

Mark.propTypes = {
  color: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
};

export default Mark;
