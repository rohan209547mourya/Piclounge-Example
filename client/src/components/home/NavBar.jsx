import React from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { NavLink } from 'react-router-dom';
import {
  AddIcon,
  AvatarIcon,
  BellIcon,
  HomeIcon, SearchIcon,
} from '../../icons';
import classes from './styles/navbar.module.css';

import Logo from '../../assets/logo.svg';
import CustomDrawer from './CustomDrawer';
import SearchDrawer from '../search/SearchDrawer';

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="nav"
      position={isMobile ? 'fixed' : 'sticky'}
      top={isMobile ? null : 0}
      bottom={isMobile ? '5' : null}
      bg={isMobile ? 'transparent' : 'white'}
      w="100%"
      boxShadow="sm"
      zIndex="sticky"
    >
      {isMobile ? (

        <Flex maxW="container.xd" width="90%" bg="#575353" borderRadius={20} p={5} justifyContent="space-around" mx="auto">

          <NavLink to="/feed" className={({ isActive }) => (isActive ? classes.activeLink : '')}>
            <IconButton
              icon={<Icon as={HomeIcon} boxSize="2.3em" />}
              aria-label="Home"
              variant="ghost"
            />
          </NavLink>

          <IconButton
            icon={<Icon as={SearchIcon} boxSize="2.3em" />}
            aria-label="Search"
            variant="ghost"
            onClick={onSearchOpen}
          />
          <IconButton
            icon={<Icon as={AddIcon} boxSize="2.3em" />}
            aria-label="Create Post"
            variant="ghost"
            onClick={onOpen}
          />

          <NavLink to="/profile/me" className={({ isActive }) => (isActive ? classes.activeLink : '')}>
            <IconButton
              icon={<Icon as={AvatarIcon} boxSize="2.3em" />}
              aria-label="Profile"
              variant="ghost"
            />
          </NavLink>

          <NavLink to="/notification" className={({ isActive }) => (isActive ? classes.activeLink : '')}>
            <IconButton
              icon={<Icon as={BellIcon} boxSize="2.3em" />}
              aria-label="Notifications"
              variant="ghost"
            />
          </NavLink>
        </Flex>
      ) : (
        <Flex maxW="container.xl" mx="auto" py="4" justifyContent="space-around">
          <Box>
            <NavLink to="/feed">
              <Image src={Logo} />
            </NavLink>
          </Box>
          <Flex>
            <Box>
              <NavLink to="/feed" className={({ isActive }) => (isActive ? classes.activeLink : '')}>
                <Text fontWeight={500} ml={5} color="var(--secondary-light-color)" _hover={{ color: '#d46c57' }}>
                  Home
                </Text>
              </NavLink>
            </Box>
            <Box
              _hover={{ color: '#d46c57', cursor: 'pointer' }}
              onClick={onSearchOpen}
            >
              <Text fontWeight={500} ml={5} color="var(--secondary-light-color)" _hover={{ color: '#d46c57' }}>
                Search
              </Text>
            </Box>
            <Box>
              <Box
                className={({ isActive }) => (isActive ? classes.activeLink : '')}
                onClick={() => {
                  toast({
                    title: 'Coming Soon!',
                    status: 'info',
                    isClosable: true,
                  });
                }}
                _hover={{ color: '#d46c57', cursor: 'pointer' }}
              >
                <Text fontWeight={500} ml={5} color="var(--secondary-light-color)" _hover={{ color: '#d46c57' }}>
                  Notifications
                </Text>
              </Box>
            </Box>
            <Box>
              <NavLink to="/profile/me" className={({ isActive }) => (isActive ? classes.activeLink : '')}>
                <Text fontWeight={500} ml={5} color="var(--secondary-light-color)" _hover={{ color: '#d46c57' }}>
                  Profile
                </Text>
              </NavLink>
            </Box>
            <Box>
              <a href="https://chat-with-messenger.vercel.app" target="_blank" rel="noreferrer">
                <Text fontWeight={500} ml={5} color="var(--secondary-light-color)" _hover={{ color: '#d46c57' }}>
                  Chat
                </Text>
              </a>
            </Box>
            <Box>
              <Button size="sm" ml={5} bg="var(--primary-light-color)" color="white" onClick={onOpen}>
                <Text fontWeight={500} color="white" _hover={{ color: '#d46c57', cursor: 'pointer' }}>
                  Create Post
                </Text>
              </Button>
            </Box>
          </Flex>
        </Flex>
      )}

      <CustomDrawer isOpen={isOpen} onClose={onClose} />
      <SearchDrawer isSearchOpen={isSearchOpen} isSearchClose={onSearchClose} />
    </Box>
  );
};

export default NavBar;
