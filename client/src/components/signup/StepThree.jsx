import {
  Button, ButtonGroup, HStack, PinInput, PinInputField, Spinner, Stack, useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { GlobalContext } from '../../context/GlobalContext';
import sendHttpRequest from '../../sendHttpRequest';

function maskEmail(email) {
  return email.replace(/(.{4}).+(@.+)$/, '$1****$2');
}

const StepThree = () => {
  const { signupFormData } = useContext(GlobalContext);
  const [pin, setPin] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);

  const handleOptVarificationRequest = () => {
    setIsRequestProcessing(true);

    sendHttpRequest('POST', '/auth/account/verify', { 'Content-Type': 'application/json' }, {
      oneTimePassword: pin,
      email: signupFormData.email === '' ? localStorage.getItem('user_email') : signupFormData.email,
    }).then((res) => {
      setIsRequestProcessing(false);
      toast({
        title: res.message,
        status: 'success',
        isClosable: true,
      });

      Cookies.set('pl_user_session_token', res.data.token);

      window.location.href = '/feed';
    }).catch((err) => {
      setIsRequestProcessing(false);
      toast({
        title: err.message,
        status: 'error',
        isClosable: true,
      });
    });
  };

  return (
    <>
      <p style={{
        color: 'green', fontSize: '18px', fontWeight: '500', marginBottom: '20px',
      }}
      >
        We have sent a 4 digit verification code to
        {' '}
        <strong>
          {
            maskEmail(signupFormData.email === '' ? localStorage.getItem('user_email') : signupFormData.email)
          }
        </strong>
      </p>
      <HStack spacing={4} width="40%" m="auto">
        <PinInput mask opt onChange={(value) => setPin(value)}>
          <PinInputField
            focusBorderColor="#FA9884"
          />
          <PinInputField
            focusBorderColor="#FA9884"
          />
          <PinInputField
            focusBorderColor="#FA9884"
          />
          <PinInputField
            focusBorderColor="#FA9884"
          />
        </PinInput>
      </HStack>
      <Stack spacing={4} width="40%" m="auto" mt={4}>
        <ButtonGroup>
          <Button width={200} bgColor="green" color="white" _hover={{ bgColor: 'rgb(0, 102, 0)' }} onClick={handleOptVarificationRequest}>
            {

              isRequestProcessing ? (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="sm"
                />
              )
                : 'Verify Account'
            }

          </Button>
        </ButtonGroup>
      </Stack>
    </>
  );
};
export default StepThree;
