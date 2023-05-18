import React from 'react';
import { useNavigate } from 'react-router-dom';

import classes from '../../styles/landingpage.module.css';
import LoginScreenLogo from '../design/LoginScreenLogo';

const LoginLandingLayout = () => {
  const navigate = useNavigate();

  const handleLoginEvent = () => {
    navigate('/login');
  };

  const handleSignupEvent = () => {
    navigate('/signup');
  };

  return (
    <div className={classes.loginScreenWrapper}>
      <LoginScreenLogo />
      <div className={classes.landingHeading}>
        <p>
          Let&apos;s Connect Together
        </p>
      </div>
      <div className={classes.buttons}>
        <button className={classes.loginButton} type="button" onClick={handleLoginEvent}>
          Login
        </button>
        <button className={classes.signupButton} type="button" onClick={handleSignupEvent}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginLandingLayout;
