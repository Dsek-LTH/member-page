import { Box, Button, Modal, Typography } from '@mui/material/';
import React, { useCallback, useEffect, useState, useMemo, InputHTMLAttributes } from 'react';
import { useTheme } from '@mui/styles';
import { DropzoneArea } from 'material-ui-dropzone';
import { useTranslation } from 'react-i18next';

type UploadModalProps = {
    onClose: () => void;
    onUpload: (files: File[]) => void;
    open: boolean,
    acceptedFiles?: string[];
};

export default function UploadModal(
    {
        onClose,
        onUpload,
        open,
        acceptedFiles = [],
    }: UploadModalProps
) {

    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const { t } = useTranslation(['common', 'fileBrowser']);

    const handleUpload = (files: File[]) => {
        if (files && files.length > 0) {
            onUpload(files);
        }
        setUploadFiles([]);
        onClose();
    }
    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box
                sx={{
                    width: '40vw',
                    margin: 'auto',
                    backgroundColor: 'background.paper',
                    marginTop: '10vh',
                    padding: '2rem',
                }}
            >
                <Typography variant="h6">
                    Ladda upp fil
                </Typography>
                <DropzoneArea
                    onChange={(files) => setUploadFiles(files)}
                    showFileNamesInPreview={true}
                    showFileNames={true}
                    useChipsForPreview={true}
                    acceptedFiles={acceptedFiles}
                    filesLimit={20}
                    showAlerts={['error']}
                    dropzoneText={t('fileBrowser:dragAndDropAFileHereOrClick')}
                    previewText={t('fileBrowser:preview')}
                />
                <Button onClick={() => handleUpload(uploadFiles)}>Ladda upp</Button>
            </Box>
        </Modal>
    );
};