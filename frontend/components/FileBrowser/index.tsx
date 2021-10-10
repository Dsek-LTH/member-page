
import { Minio } from 'minio';
import {
    ChonkyActions,
    ChonkyFileActionData,
    FileData,
    FileNavbar,
    FileList,
    FileToolbar,
    FileBrowser,
    setChonkyDefaults,
    FileAction,
    FileArray,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import path from 'path';
import React, { useCallback, useEffect, useState } from 'react';
import { useBucketQuery } from '~/generated/graphql';
import UploadModal from './UploadModal';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

  const fileActions : FileAction[] = [
    ChonkyActions.UploadFiles
];

type Props = {
    handleFileUpload: (file: File) => void;
    handlePathChange: (currentPath: string) => void;
    bucket: string;
    files: FileArray;
}

export default function Browser({handleFileUpload, handlePathChange, bucket, files}: Props) {
    const [folderChain, setFolderChain] = useState<FileData[]>([{ id: 'public/', name: 'root', isDir: true}]);
    const [uploadModalOpen, setuploadModalOpen] = useState<boolean>(false);
    const currentPath = folderChain[folderChain.length - 1].id;

    useEffect(() => {
        const currentPath = folderChain[folderChain.length - 1].id;
        handlePathChange(currentPath);
      }, [folderChain]);

    const handleFileAction = useCallback(
        (data: ChonkyFileActionData) => {
            if(data.id ===  ChonkyActions.OpenParentFolder.id){
                setFolderChain(oldFolderChain =>{
                    const a = [...oldFolderChain];
                    a.pop();
                    return a;
                }); 
                return;
            }
            else if (data.id === ChonkyActions.OpenFiles.id) {
                if (data.payload.files && data.payload.files.length !== 1) {
                    return;
                }
                if (!data.payload.targetFile || !data.payload.targetFile.isDir) {
                    window.open(`http://localhost:9000/${bucket}/${data.payload.targetFile.id}`).focus();
                    return;
                }
                if(data.payload.targetFile.isDir){
                    const newPrefix = `${data.payload.targetFile.id.replace(/\/*$/, '')}/`;
                    if(!folderChain.some(folder => folder.id === newPrefix)){
                        setFolderChain(oldFolderChain => [...oldFolderChain, data.payload.targetFile]);
                        return;
                    }   
                }
            }
            else if(data.id === ChonkyActions.DeleteFiles.id){}

            else if(data.id === ChonkyActions.UploadFiles.id){
                setuploadModalOpen(true);
            }
        },
        [folderChain]
    );

    return (
        <div style={{ height: 400 }}>
            <FileBrowser
                files={files}
                onFileAction={handleFileAction}
                folderChain={folderChain}
                fileActions={fileActions}
            >
                <FileNavbar /> 
                <FileToolbar />
                <FileList />
            </FileBrowser>
            <UploadModal
                open={uploadModalOpen}
                onClose={() => setuploadModalOpen(false)}
                onUpload={(file:File) => {
                    handleFileUpload(file);
                }}
            />
        </div>
    );
};