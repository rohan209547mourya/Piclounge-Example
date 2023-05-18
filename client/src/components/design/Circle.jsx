import React from 'react';

import classes from './styles/login.module.css';

const Circle = ({ position }) => (
  <div className={`${classes.circle} ${position}`} />
);

export default Circle;
