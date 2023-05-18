import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Text,
  Box,
  Input,
  ButtonGroup,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import ProfileImageUploader from './ProfileImageUploader';
import sendHttpRequest from '../../sendHttpRequest';
import ChangePassword from './ChangePassword';

function checkUsername(username) {
  return /[^a-zA-Z0-9_.]/.test(username);
}

const SettingsDrawer = ({
  isOpen, btnRef, onClose, setUserData,
}) => {
  const [showProfileUploader, setShowProfileUploader] = useState(false);
  const [showUpdateUsername, setShowUpdateUsername] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [username, setUsername] = useState('');
  const [isDataValid, setIsDataValid] = useState(true);
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);
  const toast = useToast();

  const handleChangeUsernameInput = (e) => {
    setUsername(e.target.value);
  };

  const handleChangeUsername = () => {
    if (!(username.length > 6 && username.length < 20) || username.includes(' ') || checkUsername(username) || username === '') {
      toast({
        title: 'Invalid Username!',
        status: 'error',
        isClosable: true,
      });
      setIsDataValid(false);
    } else {
      setIsDataValid(true);
    }

    if (isDataValid) {
      setIsRequestProcessing(true);
      sendHttpRequest('PUT', '/user/update/username', {
        'Content-Type': 'application/json',
        'X-Authorization': `${Cookies.get('pl_user_session_token')}`,
      }, {
        username,
      }).then((res) => {
        toast({
          title: 'Username updated successfully!',
          status: 'success',
          isClosable: true,
        });
        setShowUpdateUsername(false);
        setUserData(res.data.user);
        setIsRequestProcessing(false);
      }).catch((err) => {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true,
        });
        setIsRequestProcessing(false);
      });
    }
  };

  const handleLogout = () => {
    Cookies.remove('pl_user_session_token');

    toast({
      title: 'Logged out successfully!',
      status: 'success',
      isClosable: true,
    });

    window.location.href = '/';
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Account Settings</DrawerHeader>

        <DrawerBody>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              border="1px solid #ccc"
              w="100%"
              textAlign="center"
              p={2}
              mb={3}
              borderRadius={5}
              _hover={{ bg: 'var(--primary-light-color)', color: 'white' }}
              cursor="pointer"
              color="var(--secondary-light-color)"
              onClick={() => {
                setShowProfileUploader(true);
                setShowUpdateUsername(false);
                setShowChangePassword(false);
              }}
            >
              <Text fontSize="1xl" fontWeight="bold">
                Change Profile Picture
              </Text>
            </Box>
            <Box
              border="1px solid #ccc"
              w="100%"
              textAlign="center"
              p={2}
              mb={3}
              borderRadius={5}
              _hover={{ bg: 'var(--primary-light-color)', color: 'white' }}
              cursor="pointer"
              color="var(--secondary-light-color)"
              onClick={() => {
                setShowUpdateUsername(true);
                setShowProfileUploader(false);
                setShowChangePassword(false);
              }}
            >

              <Text fontSize="1xl" fontWeight="bold">
                Change Username
              </Text>
            </Box>
            <Box
              border="1px solid #ccc"
              w="100%"
              textAlign="center"
              p={2}
              mb={3}
              borderRadius={5}
              _hover={{ bg: 'var(--primary-light-color)', color: 'white' }}
              cursor="pointer"
              color="var(--secondary-light-color)"
              onClick={() => {
                setShowChangePassword(true);
                setShowUpdateUsername(false);
                setShowProfileUploader(false);
              }}
            >
              <Text fontSize="1xl" fontWeight="bold">
                Change Password
              </Text>
            </Box>
          </Box>

          {
            showProfileUploader && (
              <ProfileImageUploader
                showProfileUploader={setShowProfileUploader}
                setUserData={setUserData}
              />
            )
          }
          {
            showUpdateUsername && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="1xl" fontWeight="bold" mt={10} mb={2}>
                  New Username:
                </Text>
                <Input
                  placeholder="new username"
                  focusBorderColor="#FA9884"
                  value={username}
                  onChange={handleChangeUsernameInput}
                />
                <ButtonGroup
                  mt={5}
                >
                  <Button
                    onClick={() => setShowUpdateUsername(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="var(--primary-light-color)"
                    color="white"
                    _hover={{ bg: '#e7735c' }}
                    onClick={handleChangeUsername}
                  >

                    {
                      isRequestProcessing ? <Spinner /> : 'Change Username'
                    }
                  </Button>
                </ButtonGroup>
              </Box>
            )
          }
          {
            showChangePassword && (
              <ChangePassword setShowChangePassword={setShowChangePassword} />
            )
          }
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            bg="var(--primary-light-color)"
            color="white"
            _hover={{ bg: 'red' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsDrawer;
