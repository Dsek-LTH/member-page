import React from 'react';
import { Button, MobileStepper } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

type newsStepperProp = {
    pages: number,
    index: number,
    onForwardClick: () => void,
    onbackwardClick: () => void,
}

export default function NewsStepper({ pages, index, onForwardClick, onbackwardClick }: newsStepperProp) {
    return (
        <MobileStepper
            steps={pages}
            position="static"
            variant="text"
            activeStep={index}

            nextButton={
                <Button size="small" onClick={onForwardClick} disabled={(index + 1) === pages}>
                    Nästa <KeyboardArrowRight />
                </Button>
            }

            backButton={
                <Button size="small" onClick={onbackwardClick} disabled={index === 0}>
                    <KeyboardArrowLeft/>Tillbaka
                </Button>
            }
        />
    )
}