import { useTheme } from '@emotion/react';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Box, MobileStepper, Button } from '@mui/material';
import React, {useState} from 'react';
import { mandateStyles } from './mandatestyles';

export default function Stepper({ moveForward, moveBackward, year, idx, maxSteps}) {
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(idx);

  const classes = mandateStyles();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    moveForward();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    moveBackward();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MobileStepper
        variant="dots"
        classes={{
          dot: classes.hideStepperLabel,
        }}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {year-1}
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            {year+1}
          </Button>
        }
      />
    </Box>
  );
}