import {
  Button, ButtonGroup, Input, InputGroup, InputRightElement, Spinner, Stack, useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import sendHttpRequest from '../../sendHttpRequest';

const StepTwo = ({ setStepperActiveIndex }) => {
  const [show, setShow] = useState(false);
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);
  const handleClick = () => setShow(!show);

  const toast = useToast();
  const {
    signupFormData, setSignupFormData,
  } = useContext(GlobalContext);

  const handleNextButtonEvent = () => {
    setIsRequestProcessing(true);

    if (signupFormData.password.length < 6) {
      toast({
        title: 'Password must be at least 6 characters',
        status: 'error',
        isClosable: true,
      });

      setIsRequestProcessing(false);
    }

    if (signupFormData.password === signupFormData.confirmPassword) {
      if (!(signupFormData.password.length < 6)) {
        sendHttpRequest('POST', '/auth/register', { 'Content-Type': 'application/json' }, {
          name: `${signupFormData.firstName} ${signupFormData.lastName}`,
          email: signupFormData.email,
          username: signupFormData.username,
          password: signupFormData.password,
          dateOfBirth: signupFormData.dateOfBirth,
        })
          .then((res) => {
            setIsRequestProcessing(true);
            setStepperActiveIndex(2);
          }).catch((err) => {
            setIsRequestProcessing(false);
            toast({
              title: err.message,
              status: 'error',
              isClosable: true,
            });
          });
      }
    } else {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        isClosable: true,
      });
      setIsRequestProcessing(false);
    }
  };

  return (
    <>
      <Stack spacing={4} maxWidth="100%" direction="column">
        <InputGroup>
          <Input
            pr="4.5rem"
            type={show ? 'text' : 'password'}
            placeholder="Enter password"
            focusBorderColor="#FA9884"
            value={signupFormData.password}
            name="password"
            onChange={(e) => setSignupFormData({ ...signupFormData, password: e.target.value })}
            required
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <InputGroup>
          <Input
            pr="4.5rem"
            type={show ? 'text' : 'password'}
            placeholder="Confirm password"
            focusBorderColor="#FA9884"
            value={signupFormData.confirmPassword}
            name="confirmPassword"
            onChange={(e) => setSignupFormData({
              ...signupFormData,
              confirmPassword: e.target.value,
            })}
            required
          />
        </InputGroup>
      </Stack>
      <Stack spacing={4} maxWidth="100%" direction="row-reverse" mt={4}>
        <ButtonGroup>
          <Button width={100} onClick={() => setStepperActiveIndex(0)}>Back</Button>
          <Button width={100} bgColor="#FA9884" color="white" _hover={{ bgColor: '#e7735c' }} onClick={handleNextButtonEvent}>
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

                : 'Signup'

            }
          </Button>
        </ButtonGroup>
      </Stack>
    </>
  );
};
export default StepTwo;
