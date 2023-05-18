import React from 'react';

import {
  Image1,
  Image2,
  Image3,
  Image4,
} from '../../assets/authentication';
import classes from './styles/login.module.css';
import Circle from './Circle';

const LoginScreenLogo = () => (
  <div className={classes.logoContainer}>

    <div className={classes.outterCircle} />
    <div className={classes.innerCircle} />

    <Circle position={classes.circle1} />
    <Circle position={classes.circle2} />
    <Circle position={classes.circle3} />
    <Circle position={classes.circle4} />

    <div className={`${classes.imageWrapperCircle} ${classes.photo1}`}>
      <div className={classes.ellips}>
        <img src={Image1} alt="image1" />
      </div>
    </div>
    <div className={`${classes.imageWrapperCircle} ${classes.photo2}`}>
      <div className={classes.ellips}>
        <img src={Image2} alt="image2" />
      </div>
    </div>
    <div className={`${classes.imageWrapperCircle} ${classes.photo3}`}>
      <div className={classes.ellips}>
        <img src={Image3} alt="image3" />
      </div>
    </div>
    <div className={`${classes.imageWrapperCircle} ${classes.photo4}`}>
      <div className={classes.ellips}>
        <img src={Image4} alt="image4" />
      </div>
    </div>
  </div>
);

export default LoginScreenLogo;
