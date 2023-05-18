import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';
import { useToast } from '@chakra-ui/react';
import LoginScreenLogo from '../components/design/LoginScreenLogo';
import classes from '../styles/loginpage.module.css';
import Spinner from '../components/design/Spinner';
import sendHttpRequest from '../sendHttpRequest';
import { GlobalContext } from '../context/GlobalContext';

const LoginPage = () => {
  document.title = 'Login - Piclounge';

  const toast = useToast();
  const navigate = useNavigate();
  const { setStepperActiveIndex } = useContext(GlobalContext);
  const [loginFormData, setLoginFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [showSpinner, setShowSpinner] = useState(false);

  const handleLoginFormSubmit = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    sendHttpRequest('POST', '/auth/login', { 'Content-Type': 'application/json' }, loginFormData)
      .then((res) => {
        setShowSpinner(false);
        toast({
          title: res.message,
          status: 'success',
          isClosable: true,
        });

        Cookies.set('pl_user_session_token', res.data.token);
        window.location.href = '/feed';
      }).catch((err) => {
        if (err.message === 'User not verified') {
          setStepperActiveIndex(2);
          navigate('/signup');
        }

        setShowSpinner(false);
        toast({
          title: err.message,
          status: 'error',
          isClosable: true,
        });
      });
  };

  return (
    <div>
      <LoginScreenLogo />
      <div className={classes.loginPageHeading}>
        <p>
          Login
        </p>
      </div>
      <div className={classes.loginPageForm}>
        <form
          onSubmit={handleLoginFormSubmit}
        >
          <input
            type="text"
            name="usernameOrEmail"
            placeholder="Enter username or email"
            className={classes.loginInput}
            value={loginFormData.usernameOrEmail}
            onChange={(event) => setLoginFormData({
              ...loginFormData,
              usernameOrEmail: event.target.value,
            })}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={loginFormData.password}
            onChange={(event) => setLoginFormData({
              ...loginFormData,
              password: event.target.value,
            })}
            className={classes.loginInput}
            required
          />
          <button type="submit" className={classes.loginButton} disabled={showSpinner}>
            {
              showSpinner ? (
                <div className={classes.spinnerWrapper}>
                  {' '}
                  <Spinner />
                  {' '}
                </div>
              ) : 'Login'
            }
          </button>
        </form>
        <p style={{ marginLeft: '25px' }}>
          don&apos;t have an account?
          {' '}
          <NavLink to="/signup">
            Signup
          </NavLink>
          {' '}

        </p>
      </div>
    </div>
  );
};

export default LoginPage;
