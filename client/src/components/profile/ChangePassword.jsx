import {
  Box,
  Button, ButtonGroup, Input, InputGroup, InputRightElement, Spinner, Text, useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import sendHttpRequest from '../../sendHttpRequest';

const ChangePassword = ({ setShowChangePassword }) => {
  const [show, setShow] = React.useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);
  const toast = useToast();
  const handleShowPassword = () => setShow(!show);

  const handleChangePassword = () => {
    setIsRequestProcessing(true);

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        isClosable: true,
      });
      setIsRequestProcessing(false);
    } else if (changePasswordData.newPassword === changePasswordData.currentPassword) {
      toast({
        title: 'New password cannot be same as current password',
        status: 'error',
        isClosable: true,
      });
      setIsRequestProcessing(false);
    } else {
      sendHttpRequest('PUT', '/user/update/password', {
        'Content-Type': 'application/json',
        'X-Authorization': `${Cookies.get('pl_user_session_token')}`,
      }, {
        currentPassword: changePasswordData.currentPassword,
        newPassword: changePasswordData.newPassword,
      }).then((res) => {
        toast({
          title: 'Password updated successfully!',
          status: 'success',
          isClosable: true,
        });
        setShowChangePassword(false);
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

  return (
    <Box
      mt={7}
    >
      <Text
        fontSize="md"
        fontWeight="bold"
        p={2}
      >
        Change Password
      </Text>

      <Input
        pr="4.5rem"
        type="password"
        placeholder="Enter current password"
        focusBorderColor="#FA9884"
        value={changePasswordData.currentPassword}
        name="currentPassword"
        onChange={(e) => setChangePasswordData({
          ...changePasswordData,
          currentPassword: e.target.value,
        })}
      />

      <InputGroup
        size="md"
        display="flex"
        flexDirection="column"
        mt={10}
      >
        <Input
          pr="4.5rem"
          type={show ? 'text' : 'password'}
          placeholder="Enter new password"
          mb={2}
          focusBorderColor="#FA9884"
          value={changePasswordData.newPassword}
          name="newPassword"
          onChange={(e) => setChangePasswordData({
            ...changePasswordData,
            newPassword: e.target.value,
          })}
        />
        <Input
          pr="4.5rem"
          type={show ? 'text' : 'password'}
          placeholder="Confirm password"
          focusBorderColor="#FA9884"
          value={changePasswordData.confirmPassword}
          name="confirmPassword"
          onChange={(e) => setChangePasswordData({
            ...changePasswordData,
            confirmPassword: e.target.value,
          })}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
      <ButtonGroup
        mt={5}
      >
        <Button onClick={() => setShowChangePassword(false)}>Cancel</Button>
        <Button
          bg="var(--primary-light-color)"
          color="white"
          _hover={{ bg: '#e7735c' }}
          onClick={handleChangePassword}
        >
          {
            isRequestProcessing ? <Spinner /> : 'Change Password'
          }
        </Button>
      </ButtonGroup>
    </Box>

  );
};

export default ChangePassword;
