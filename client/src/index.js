import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { GlobalContextProvider } from './context/GlobalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <GlobalContextProvider>
        <App />
      </GlobalContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
