import { Box, Button, Modal, Typography } from '@material-ui/core';
import React, { useCallback, useEffect, useState, useMemo, InputHTMLAttributes } from 'react';


import { DropzoneArea } from 'material-ui-dropzone';

type UploadModalProps = {
    onClose: () => void;
    onUpload: (files: File[]) => void;
    open: boolean,
    acceptedFiles?: string[];
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
  };


export default function UploadModal(
    {
        onClose,
        onUpload,
        open,
        acceptedFiles = [],
    }: UploadModalProps
) {

    const handleUpload = (files: File[]) => {
        if (files && files.length > 0) {
            onUpload(files);
        }
    }
    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box
             sx={{
                width: "40vw",
                margin: "auto",
                backgroundColor: "#fff",
              }}
              >
            <Typography variant="h6">
                Ladda upp fil
            </Typography>
            
            <DropzoneArea
                onChange={(files) => handleUpload(files)}
                showFileNamesInPreview = {true}
                showFileNames = {true}
                useChipsForPreview = {true}
                acceptedFiles = {acceptedFiles}
            />
               {/* <UploadButton
                    onChange={handleUpload}
                    accept={accept}
                />*/}
                <Button onClick={() => console.log("upload")}>Ladda upp</Button>
            </Box>
        </Modal>
    );
};