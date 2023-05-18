import React, {
  createContext, useEffect, useMemo, useState,
} from 'react';
import Cookies from 'js-cookie';
import sendHttpRequest from '../sendHttpRequest';

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [stepperActiveIndex, setStepperActiveIndex] = useState(0);
  const [userSessionToken, setUserSessionToken] = useState(null);
  const [signupFormData, setSignupFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    dateOfBirth: '',
  });

  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    username: '',
    dateOfBirth: '',
    profileImage: '',
    followers: [],
    following: [],
    posts: [],
    likedPosts: [],
  });

  const [currentUserData, setCurrentUserData] = useState({
    id: '',
    name: '',
    email: '',
    username: '',
    dateOfBirth: '',
    profileImage: '',
    followers: [],
    following: [],
    posts: [],
  });

  useEffect(() => {
    const tempToken = Cookies.get('pl_user_session_token');
    if (tempToken) {
      setUserSessionToken(tempToken);
    }
  }, [userSessionToken]);

  useEffect(() => {
    if (userSessionToken) {
      setTimeout(() => {
        sendHttpRequest('GET', '/user/me', { 'Content-Type': 'application/json', 'X-Authorization': `${userSessionToken}` })
          .then((res) => {
            setUserData(res.data.user);
          });
      }, 1000);
    }
  }, [userSessionToken]);

  const values = useMemo(() => ({
    stepperActiveIndex,
    setStepperActiveIndex,
    userSessionToken,
    setUserSessionToken,
    signupFormData,
    setSignupFormData,
    userData,
    setUserData,
    currentUserData,
    setCurrentUserData,
  }), [stepperActiveIndex, userSessionToken, signupFormData, userData, currentUserData]);

  return (
    <GlobalContext.Provider value={values}>
      {children}
    </GlobalContext.Provider>
  );
};
