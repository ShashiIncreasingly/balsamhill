import React from 'react';
import PropTypes from 'prop-types';

function Ranges({ ranges }) {
  if (ranges.length === 0) {
    return <div className="inc_product_desc_range empty" />;
  }

  return (
    <div className="inc_product_desc_range">
      <p>{`${ranges[0]} - ${ranges[1]}`}</p>
    </div>
  );
}

Ranges.propTypes = {
  ranges: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Ranges;
