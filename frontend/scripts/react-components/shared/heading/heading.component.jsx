import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './heading.scss';

function Heading(props) {
  const {
    as,
    variant,
    color,
    size,
    align,
    weight,
    children,
    className,
    transform,
    ...rest
  } = props;

  const headingProps = {
    ...rest,
    className: cx(
      'c-heading',
      variant,
      {
        [`color-${color}`]: color,
        [`size-${size}`]: size,
        [`weight-${weight}`]: weight,
        [`text-align-${align}`]: align,
        [`transform-${transform}`]: transform
      },
      className
    )
  };

  return React.createElement(as, headingProps, children);
}

Heading.defaultProps = {
  as: 'h2',
  size: 'rg',
  color: 'grey',
  weight: 'light',
  variant: 'serif'
};

Heading.propTypes = {
  size: PropTypes.string,
  align: PropTypes.string,
  color: PropTypes.string,
  weight: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
  transform: PropTypes.string,
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  className: PropTypes.string // Use just for positioning
};

export default Heading;
