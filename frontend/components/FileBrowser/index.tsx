
import { Minio } from 'minio';
import {
    ChonkyActions,
    ChonkyFileActionData,
    FileArray,
    FullFileBrowser,
    FileData,
    setChonkyDefaults,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import path from 'path';
import React, { useCallback, useEffect, useState } from 'react';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

// The AWS credentials below only have read-only access to the Chonky demo bucket.
// You will need to create custom credentials for your bucket.
const BUCKET_NAME = 'news';

const minioClient = new Minio.Client({
    endPoint: '192.168.86.21',
    port: 9000,
    useSSL: false,
    accessKey: 'user',
    secretKey: 'password'
});

export default function FileBrowser() {
    const [error, setError] = useState<string | null>(null);
    const [folderPrefix, setKeyPrefix] = useState<string>('/');
    const [files, setFiles] = useState<FileArray>([]);



    const handleFileAction = useCallback(
        (data: ChonkyFileActionData) => {
            if (data.id === ChonkyActions.OpenFiles.id) {
                if (data.payload.files && data.payload.files.length !== 1) return;
                if (!data.payload.targetFile || !data.payload.targetFile.isDir) return;

                const newPrefix = `${data.payload.targetFile.id.replace(/\/*$/, '')}/`;
                console.log(`Key prefix: ${newPrefix}`);
                setKeyPrefix(newPrefix);
            }
        },
        [setKeyPrefix]
    );

    return (
            <div style={{ height: 400 }}>
                <FullFileBrowser
                    files={files}
                    onFileAction={handleFileAction}
                />
            </div>
    );
};