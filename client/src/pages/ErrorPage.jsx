import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const ErrorPage = () => {
  document.title = 'Page not found - Piclounge';
  return (
    <div>
      <Box w="50%" margin="auto" mt={40} mb={40}>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Text fontSize="3xl">
            Sorry, this page isn&apos;t available.
          </Text>
          <Text fontSize="md">
            The link you followed may be broken, or the page may have been removed.
            {' '}
            <NavLink to="/">
              Go back to Piclounge
            </NavLink>
          </Text>
        </Flex>
      </Box>

      <Flex width="50%" margin="auto" textAlign="center" justify="center">
        <Text fontSize="sm" color="gray.500">
          @
          {' '}
          <strong>2023 Piclounge</strong>
          {' '}
          all rights reserved
        </Text>
      </Flex>
    </div>
  );
};

export default ErrorPage;
