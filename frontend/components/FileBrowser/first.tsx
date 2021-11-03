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
    FileBrowserHandle,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import path from 'path';
import React, { useCallback, useEffect, useState } from 'react';
import { BucketQuery, BucketQueryVariables, Exact, PresignedPutDocumentUrlQuery, useBucketQuery, useMoveObjectsMutation, useRemoveObjectsMutation } from '~/generated/graphql';
import UploadModal from './UploadModal';
import { QueryHookOptions, QueryResult } from '@apollo/client';
import putFile from '~/functions/putFile';
import { useFileActionHandler } from './useFileActionHandler';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const fileActions: FileAction[] = [
    ChonkyActions.UploadFiles,
    ChonkyActions.CreateFolder,
    ChonkyActions.DeleteFiles,

];

type Props = {
    onFileUpload: (file: File) => boolean;
    handlePathChange: (currentPath: string) => void;
    bucket: string;
    fetchFiles: QueryResult<BucketQuery, Exact<{
        name: string;
        prefix: string;
    }>>,
    fetchUploadUrl: QueryResult<PresignedPutDocumentUrlQuery, Exact<{
        fileName: string;
    }>>
}

export default function Browser({ onFileUpload, handlePathChange, bucket, fetchFiles, fetchUploadUrl }: Props) {
    const fileBrowserRef = React.useRef<FileBrowserHandle>(null);
    const [folderChain, setFolderChain] = useState<FileData[]>([{ id: 'public/', name: 'root', isDir: true }]);
    const [uploadFile, setUploadFile] = useState<File>(undefined);
    const [uploadModalOpen, setuploadModalOpen] = useState<boolean>(false);
    const [filesObject, setFilesObject] = useState<{
        [path: string]: { [name: string]: FileData };
    }>({});

    const addFileToFileObject = (file: FileData) => {
        setFilesObject(oldFiles => {
            const newFiles = { ...oldFiles };
            const newPath = { ...newFiles[path.dirname(file.id) + '/'] };
            newPath[file.name] = file;
            newFiles[currentPath] = newPath;
            return newFiles;
        });
    }
    const removeFilesFromFileObject = (files: FileData[]) => {
        setFilesObject(oldFiles => {
            const newFiles = { ...oldFiles };

            files.forEach(file => {
                const filePath = path.dirname(file.id) + '/';
                if (newFiles[filePath][file.name])
                    delete newFiles[filePath][file.name];
            })
            return newFiles;
        });

    }

    const currentPath = folderChain[folderChain.length - 1].id;
    const { data: filesData, loading: filesLoading, error: filesError, called: filesCalled } = fetchFiles;
    const { data: uploadUrlData, loading: uploadUrlLoading, error: uploadUrlError } = fetchUploadUrl;
    const selectedFilesIds =  Array.from(fileBrowserRef.current?.getFileSelection() ?? '')


    const [removeObjectsMutation, { data: removeData, loading: removeLoading, error: removeError }] = useRemoveObjectsMutation({
        variables: {
            fileNames: selectedFilesIds
        },
    });

    /*const [moveObjectsMutation, { data: moveData, loading: moveLoading, error: moveError }] = useMoveObjectsMutation({
        variables: {
            fileNames: selectedFilesIds.filter(file => filesObject[path.dirname(file)+'/'][path.basename(file)].isDir),
            destination: destination?.id
        },
    });*/

    const handleFileUpload = () => {
        setuploadModalOpen(true);
    }

    const handleFileMove = (files: FileData[], source: FileData, destination: FileData) => {
        //Set destination and files to move state
        //When state changes call moveObjectsMutation
        //Set state to undefined
    }

    const handleFileDelete = (files: FileData[]) => {
        removeObjectsMutation();
        removeFilesFromFileObject(files);
    }

    const handleCreateFolder = (folderName: string) => {

        const newFolderFileData = {
            id: `${currentPath}${folderName}/`,
            name: folderName,
            isDir: true,
        }
        addFileToFileObject(newFolderFileData);
    }

    const handleFileOpen = (file: FileData) => {
        window.open(`http://localhost:9000/${bucket}/${file.id}`).focus();
        return;
    }

    const handleFileAction = useFileActionHandler(
        folderChain,
        setFolderChain,
        handleFileOpen,
        handleFileDelete,
        handleFileUpload,
        handleFileMove,
        handleCreateFolder
    );

    //Wait for to be removed. If fail restore file to frontend and show error
    useEffect(() => {
        if (!removeLoading && removeError) {
           

        }
    }, [removeLoading]);


    useEffect(() => {
        if (!uploadUrlLoading && uploadUrlData?.presignedPutDocumentUrl && uploadFile) {
            putFile(uploadUrlData.presignedPutDocumentUrl, uploadFile, uploadFile.type).then(() => {
                const newFile = {
                    id: `${currentPath}${uploadFile.name}`,
                    name: uploadFile.name,
                    isDir: false,
                    thumbnailUrl: `http://localhost:9000/${bucket}/${currentPath}${uploadFile.name}`,
                };
                addFileToFileObject(newFile);
                setUploadFile(undefined);
                console.log('File uploaded');
            });
        }
    }, [uploadUrlLoading]);

    useEffect(() => {
        if (!filesLoading && filesData) {
            setFilesObject(oldFiles => {
                const newFiles = { ...oldFiles };
                const newPath = { ...newFiles[currentPath] };
                filesData.bucket.forEach(file => {
                    newPath[file.name] = {
                        id: file.id,
                        name: file.name,
                        isDir: file.isDir,
                        thumbnailUrl: file?.thumbnailUrl,
                    }
                });
                newFiles[currentPath] = newPath;
                return newFiles;
            });
        }
    }, [filesData]);

    useEffect(() => {
        onFileUpload(uploadFile);
    }, [uploadFile]);

    useEffect(() => {
        const currentPath = folderChain[folderChain.length - 1].id;
        handlePathChange(currentPath);
    }, [folderChain]);

   /* useEffect(() => {
        if (destination)
            moveObjectsMutation();
    }, [destination]);*/

    const currentFiles = filesObject[currentPath] ? Object.values(filesObject[currentPath]) : [];
    console.log("render")
    return (
        <div style={{ height: 400 }}>
            <FileBrowser
                files={currentFiles}
                onFileAction={handleFileAction}
                folderChain={folderChain}
                fileActions={fileActions}
                ref={fileBrowserRef}
            >
                <FileNavbar />
                <FileToolbar />
                <FileList />
            </FileBrowser>
            <UploadModal
                open={uploadModalOpen}
                onClose={() => setuploadModalOpen(false)}
                onUpload={(file: File) => {
                    setUploadFile(file);
                }}
            />
        </div>
    );
};