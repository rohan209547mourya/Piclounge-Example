import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cookies from 'js-cookie';

import classes from './styles/index.module.css';
import RootLayout from './RootLayout';
import {
  LandingPage, Home, LoginPage, SignupPage, ErrorPage, Profile,
} from './pages';
import Post from './pages/Post';

const routerConfig = [{
  path: '/',
  element: <RootLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: '',
      element: <LandingPage />,
    },
    {
      path: 'feed',
      element: <Home />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'post/:postId',
      element: <Post />,
    },
    {
      path: 'signup',
      element: <SignupPage />,
    },
    {
      path: 'profile/:id',
      element: <Profile />,
    },
  ],
}];

const hasToken = Cookies.get('pl_user_session_token');

if (hasToken) {
  routerConfig[0].index = 1;
  routerConfig[0].children = routerConfig[0].children.filter((child) => child.path !== 'login' && child.path !== 'signup' && child.path !== '');
} else {
  routerConfig[0].index = 0;
  const newRoutes = routerConfig[0].children.filter((child) => child.path !== 'feed');
  routerConfig[0].children = newRoutes;
}

const router = createBrowserRouter(routerConfig);

const App = () => (
  <RouterProvider router={router} />
);

export default App;
