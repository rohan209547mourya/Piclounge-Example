import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  Input, InputGroup, InputLeftAddon, Stack, useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext';

function checkUsername(username) {
  return /[^a-zA-Z0-9_.]/.test(username);
}

const StepOne = ({ setStepperActiveIndex }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    signupFormData, setSignupFormData,
  } = useContext(GlobalContext);

  const [isDataValid, setIsDataValid] = useState(true);

  const handleNextButtonEvent = () => {
    setIsDataValid(true);
    if (!signupFormData.username > 6 && !signupFormData.username < 20) {
      toast({
        title: 'Username must be between 6 and 20 characters',
        status: 'error',
        isClosable: true,
      });

      setIsDataValid(false);
    } else {
      setIsDataValid(true);
    }

    if (signupFormData.username.includes(' ')) {
      toast({
        title: 'Username cannot contain spaces',
        status: 'error',
        isClosable: true,
      });

      setIsDataValid(false);
    } else {
      setIsDataValid(true);
    }

    if (checkUsername(signupFormData.username)) {
      toast({
        title: 'Username can only contain _ and .',
        status: 'error',
        isClosable: true,
      });

      setIsDataValid(false);
    } else {
      setIsDataValid(true);
    }

    if (signupFormData.firstName
        && signupFormData.lastName
        && signupFormData.dateOfBirth && signupFormData.username
        && signupFormData.email && isDataValid && !checkUsername(signupFormData.username)) {
      setStepperActiveIndex(1);
    } else {
      toast({
        title: 'All fields must be filled',
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (

    <Box maxWidth="100%" mx="auto">
      <Stack spacing={4} direction={['column', 'row']} maxWidth="100%" mx="auto">
        <Input
          variant="outline"
          placeholder="First Name"
          focusBorderColor="#FA9884"
          name="firstName"
          value={signupFormData.firstName}
          onChange={(e) => setSignupFormData({ ...signupFormData, firstName: e.target.value })}
          autoComplete="off"
          required
        />
        <Input
          variant="outline"
          placeholder="Last Name"
          focusBorderColor="#FA9884"
          value={signupFormData.lastName}
          name="lastName"
          autoComplete="off"
          onChange={(e) => setSignupFormData({ ...signupFormData, lastName: e.target.value })}
          required
        />
      </Stack>
      <Stack spacing={4} maxWidth="100%" direction="row" mt={4}>
        <Input
          focusBorderColor="#FA9884"
          variant="outline"
          placeholder="Select Date and Time"
          size="md"
          type="date"
          name="dateOfBirth"
          autoComplete="off"
          value={signupFormData.dateOfBirth}
          onChange={(e) => setSignupFormData({ ...signupFormData, dateOfBirth: e.target.value })}
          required
        />
      </Stack>
      <Stack spacing={4} maxWidth="100%" direction="row" mt={4}>
        <FormControl>
          <InputGroup>
            <InputLeftAddon>
              @
            </InputLeftAddon>
            <Input type="text" autoComplete="off" placeholder="Username" focusBorderColor="#FA9884" value={signupFormData.username} name="username" onChange={(e) => setSignupFormData({ ...signupFormData, username: e.target.value })} required />
          </InputGroup>
          <FormHelperText>Username can only contain _ and . as special characters. </FormHelperText>
        </FormControl>
      </Stack>
      <Stack spacing={4} maxWidth="100%" direction="row" mt={4}>
        <InputGroup>
          <Input type="email" autoComplete="off" placeholder="Email" focusBorderColor="#FA9884" value={signupFormData.email} name="email" onChange={(e) => setSignupFormData({ ...signupFormData, email: e.target.value })} required />
        </InputGroup>
      </Stack>
      <Stack spacing={4} maxWidth="100%" direction="row-reverse" mt={4}>
        <ButtonGroup>
          <Button width={100} disabled onClick={() => navigate(-1)}>Back</Button>
          <Button width={100} bgColor="#FA9884" color="white" _hover={{ bgColor: '#e7735c' }} onClick={handleNextButtonEvent}>Next</Button>
        </ButtonGroup>
      </Stack>
    </Box>
  );
};

export default StepOne;
