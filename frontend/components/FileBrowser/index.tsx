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
    FullFileBrowser,
    FileArray,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import path from 'path';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BucketQuery, BucketQueryVariables, Exact, PresignedPutDocumentUrlQuery, useBucketQuery, useMoveObjectsMutation, usePresignedPutDocumentUrlQuery, useRemoveObjectsMutation } from '~/generated/graphql';
import UploadModal from './UploadModal';
import { QueryHookOptions, QueryResult } from '@apollo/client';
import putFile from '~/functions/putFile';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const fileActions: FileAction[] = [
    ChonkyActions.UploadFiles,
    ChonkyActions.CreateFolder,
    ChonkyActions.DeleteFiles,

];

type Props = {
    bucket: string;
}


interface CustomFileData extends FileData {
    parentId?: string;
    childrenIds?: string[];
}

type CustomFileMap = {
    [fileId: string]: CustomFileData;
}



export default function Browser({ bucket }: Props) {
    const fileBrowserRef = React.useRef<FileBrowserHandle>(null);
    const [folderChain, setFolderChain] = useState<FileData[]>([{ id: 'public/', name: 'root', isDir: true }]);
    const currentPath = folderChain[folderChain.length - 1].id;
    const [files, setFiles] = useState<FileData[]>();
    const [uploadModalOpen, setuploadModalOpen] = useState<boolean>(false);
    const [uploadFile, setUploadFile] = useState<File | undefined>(undefined);

    useBucketQuery({
        variables: {
            name: bucket,
            prefix: currentPath,
        },
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            setFiles(data.bucket);
        }
    });

    usePresignedPutDocumentUrlQuery({
        variables: {
            fileName: uploadFile ? currentPath + uploadFile.name : '',
        },
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log("data", data);
            if (!uploadFile) {
                return;
            }

            putFile(data.presignedPutDocumentUrl, uploadFile, uploadFile.type).then(() => {
                setFolderChain(oldFolderChain => [...oldFolderChain]);
                setFiles(oldFiles => [...oldFiles, { name: uploadFile.name, id: currentPath + uploadFile.name, isDir: false, thumbnailUrl: `http://localhost:9000/${bucket}/${currentPath}${uploadFile.name}` }]);
            });
            setUploadFile(undefined);
        }
    });


    const selectedFilesIds = Array.from(fileBrowserRef.current?.getFileSelection() ?? '')

    const [removeObjectsMutation, { data: removeData, loading: removeLoading, error: removeError }] = useRemoveObjectsMutation({
        variables: {
            fileNames: selectedFilesIds
        },
        onCompleted: (data) => {
            const fileIdsRemoved = data.document.remove.map(file => file.id);
            setFiles(oldFiles => {
                return oldFiles.filter(file => !fileIdsRemoved.includes(file.id));
            })
        }
    });
    const [moveObjectsMutation, { data: moveData, loading: moveLoading, error: moveError }] = useMoveObjectsMutation({
        onCompleted: (data) => {
            const fileIdsRemoved = data.document.move.map(file => file.oldFile.id);
            setFiles(oldFiles => {
                return oldFiles.filter(file => !fileIdsRemoved.includes(file.id));
            })
        }
    });


    const useFileActionHandler = (
        setFolderChain: React.Dispatch<React.SetStateAction<FileData[]>>
    ) => {
        return useCallback(
            (data: ChonkyFileActionData) => {
                console.log(data);
                if (data.id === ChonkyActions.OpenFiles.id) {
                    const { targetFile, files } = data.payload;

                    if (targetFile && targetFile.isDir) {
                        setFolderChain(oldFolderChain => {
                            if (oldFolderChain.some(folder => folder.id === targetFile.id)) {
                                return oldFolderChain;
                            }
                            else {
                                return [...oldFolderChain, data.payload.targetFile]
                            }
                        });
                        return;

                    }
                    else if (!targetFile.isDir) {
                        window.open(`http://localhost:9000/${bucket}/${targetFile.id}`).focus();
                        return;
                    }
                }

                if (data.id === ChonkyActions.OpenParentFolder.id) {
                    setFolderChain(oldFolderChain => {
                        const newFolderChain = [...oldFolderChain];
                        newFolderChain.pop();
                        return newFolderChain;
                    });
                }
                if (data.id === ChonkyActions.DeleteFiles.id) {
                    removeObjectsMutation();
                    return;
                }
                if (data.id === ChonkyActions.UploadFiles.id) {
                    setuploadModalOpen(true);
                    return;
                }
                if (data.id === ChonkyActions.CreateFolder.id) {
                    const input = prompt();
                    if(input) {
                        setFiles(oldFiles => [...oldFiles, { name: input, id: currentPath + input + '/', isDir: true }]);
                    }
                    return;
                }
                if (data.id === ChonkyActions.MoveFiles.id) {
                    console.log("move", data.state.selectedFilesForAction.map(file => file.id), data.payload.destination.id);
                    moveObjectsMutation({
                        variables: {
                            fileNames: data.state.selectedFilesForAction.map(file => file.id),
                            destination: data.payload.destination.id
                        }
                    });
                }

            },
            [setFolderChain]
        );
    };

    const handleFileAction = useFileActionHandler(setFolderChain);
    return (
        <>
            <div style={{ height: 400 }}>
                <FullFileBrowser
                    files={files}
                    folderChain={folderChain}
                    fileActions={fileActions}
                    onFileAction={handleFileAction}
                    ref={fileBrowserRef}
                //thumbnailGenerator={thumbnailGenerator}
                //{...props}
                />
            </div>
            <UploadModal
                open={uploadModalOpen}
                onClose={() => setuploadModalOpen(false)}
                onUpload={(file: File) => {
                    setUploadFile(file)
                }}
            />
        </>
    );
}