import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useBreakpointValue,
  useSteps,
} from '@chakra-ui/react';

const steps = [
  { title: 'First', description: 'General Info' },
  { title: 'Second', description: 'Select Password' },
  { title: 'Third', description: 'Verify Account' },
];

const StepperSignup = ({ stepperActiveIndex }) => {
  const size = useBreakpointValue({
    base: 'md',
    md: 'md',
    lg: 'lg',
  });

  return (
    <>
      {
        size === 'lg' && (
          <Box>
            <Stepper colorScheme="green" size={size} index={stepperActiveIndex}>
              {steps.map((step, index) => (
              // eslint-disable-next-line react/no-array-index-key
                <Step key={index + 1}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>
        )
      }
      <div />
    </>
  );
};
export default StepperSignup;
