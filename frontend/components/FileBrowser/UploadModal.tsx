import {
  Box, Button, Modal, Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { DropzoneArea } from 'react-mui-dropzone';
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
  }: UploadModalProps,
) {
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const { t } = useTranslation(['common', 'fileBrowser']);

  const handleUpload = (files: File[]) => {
    if (files && files.length > 0) {
      onUpload(files);
    }
    setUploadFiles([]);
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          width: { sm: '300px', md: '40vw' },
          margin: 'auto',
          backgroundColor: 'background.paper',
          marginTop: '10vh',
          padding: '2rem',
        }}
      >
        <Typography variant="h6" style={{ marginBottom: '2rem' }}>
          {t('fileBrowser:uploadFiles')}
        </Typography>
        <DropzoneArea
          onChange={(files) => setUploadFiles(files)}
          showFileNamesInPreview
          showFileNames
          useChipsForPreview
          acceptedFiles={acceptedFiles}
          filesLimit={50}
          maxFileSize={50000000}
          showAlerts={['error']}
          dropzoneText={t('fileBrowser:dragAndDropAFileHereOrClick')}
          previewText={t('fileBrowser:preview')}
        />
        <Button
          sx={{
            marginTop: '1rem',
          }}
          onClick={() => handleUpload(uploadFiles)}
          variant="contained"
        >
          {t('upload')}
        </Button>
      </Box>
    </Modal>
  );
}
