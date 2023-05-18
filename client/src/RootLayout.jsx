import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';
import {
  Flex, Text, useBreakpoint, useBreakpointValue,
} from '@chakra-ui/react';
import classes from './styles/index.module.css';
import { NavBar } from './components';

const RootLayout = () => {
  const navigate = useNavigate();
  const footerWidht = useBreakpointValue({ base: '60%', xsm: '80%' });
  const token = Cookies.get('pl_user_session_token');

  useEffect(() => {
    if (window.location.pathname === '/' && token) {
      navigate('/feed');
    }
  }, []);

  return (
    <main className={classes.screen}>
      {
        token && (
          <NavBar />
        )
      }
      <Outlet />
      <Flex width={footerWidht} margin="auto" textAlign="center" justify="center" position="relative" top={90}>
        <Text fontSize="sm" color="gray.500" mt={10}>
          @
          {' '}
          <strong>2023 Piclounge</strong>
          {' '}
          all rights reserved
        </Text>
      </Flex>
    </main>
  );
};

export default RootLayout;
