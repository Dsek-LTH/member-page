import React from 'react';
import { Button, MobileStepper } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTranslation } from 'next-i18next';

type newsStepperProps = {
  pages: number;
  index: number;
  onForwardClick: () => void;
  onBackwardClick: () => void;
};

export default function NewsStepper({
  pages,
  index,
  onForwardClick,
  onBackwardClick,
}: newsStepperProps) {
  const { t } = useTranslation('common');

  return (
    <MobileStepper
      steps={pages}
      position="static"
      variant="text"
      activeStep={index}
      nextButton={(
        <Button
          size="small"
          onClick={onForwardClick}
          disabled={index + 1 === pages}
        >
          {`${t('next')} `}
          <KeyboardArrowRight />
        </Button>
      )}
      backButton={(
        <Button size="small" onClick={onBackwardClick} disabled={index === 0}>
          <KeyboardArrowLeft />
          {` ${t('back')}`}
        </Button>
      )}
    />
  );
}
