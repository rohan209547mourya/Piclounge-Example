/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import {
  Button,
  ButtonGroup,
  Input, InputGroup, InputLeftAddon, Stack,
} from '@chakra-ui/react';
import StepperSignup from '../components/design/StepperSignup';
import classes from '../styles/signup.module.css';
import { GlobalContext } from '../context/GlobalContext';
import { StepOne, StepThree, StepTwo } from '../components';

const SignupPage = () => {
  document.title = 'Signup - Piclounge';
  const {
    stepperActiveIndex,
    setStepperActiveIndex,
  } = useContext(GlobalContext);

  return (
    <div className={classes.signupPageWrapper}>
      <div className={classes.stepsWrapper}>
        <StepperSignup stepperActiveIndex={stepperActiveIndex} />
      </div>
      <div className={classes.signupForm}>
        <h1>{ stepperActiveIndex === 2 ? 'Account Verification' : 'Sign up'}</h1>
        <form>

          {
            stepperActiveIndex === 0 && <StepOne setStepperActiveIndex={setStepperActiveIndex} />
          }

          {
            stepperActiveIndex === 1 && <StepTwo setStepperActiveIndex={setStepperActiveIndex} />
          }
          {
            stepperActiveIndex === 2 && <StepThree />
          }
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
