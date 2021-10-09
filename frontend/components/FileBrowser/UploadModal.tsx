import { Box, Modal, Typography } from '@material-ui/core';
import React, { useCallback, useEffect, useState, useMemo, InputHTMLAttributes } from 'react';
import { useBucketQuery } from '~/generated/graphql';
import UploadButton from '../UploadButton';

type UploadModalProps = {
    onClose: () => void;
    onUpload: (file: File) => void;
    open: boolean,
    accept?: string;
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
        accept = '*',
    }: UploadModalProps
) {

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];
        if (file) {
            onUpload(file);
        }
    }
    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box sx={style}>
            <Typography variant="h6">
                Ladda upp fil
            </Typography>
                <UploadButton
                    onChange={handleUpload}
                    accept={accept}
                />
            </Box>
        </Modal>
    );
};