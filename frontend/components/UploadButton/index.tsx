
import React, { InputHTMLAttributes} from 'react';
import "react-mde/lib/styles/css/react-mde-all.css";
import { Button } from '@material-ui/core';
import { ConstructionTwoTone, PhotoCamera } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';

type UploadButtonProps = {
    onChange: (event: InputHTMLAttributes<HTMLInputElement>) => void;
    accept?: string,
}

export default function UploadButton({onChange, accept="*"}: UploadButtonProps) {
    const { t } = useTranslation('common');

    return (
        <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
        >
            {t('common:selectImage')}
            <input
                type="file"
                accept={accept}
                hidden
                onChange={onChange}
                id="contained-button-file"
            />
        </Button>
    )
}