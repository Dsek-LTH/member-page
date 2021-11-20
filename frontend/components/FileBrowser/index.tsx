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
import { FilesQuery, PresignedPutUrlQuery, useFilesQuery, useMoveObjectsMutation, usePresignedPutUrlQuery, useRemoveObjectsMutation } from '~/generated/graphql';
import UploadModal from './UploadModal';
import { QueryHookOptions, QueryResult } from '@apollo/client';
import putFile from '~/functions/putFile';
import Chonkyi18n from './Chonkyi18n';
import { useTranslation } from 'next-i18next';

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
    const [uploadFiles, setUploadFiles] = useState<File[] | undefined>(undefined);

    const { t, i18n } = useTranslation(['common', 'fileBrowser']);

    useFilesQuery({
        variables: {
            bucket: bucket,
            prefix: currentPath,
        },
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            setFiles(data.files);
        }
    });



    usePresignedPutUrlQuery({
        variables: {
            bucket: bucket,
            fileName: (uploadFiles && uploadFiles.length > 0) ? currentPath + uploadFiles[0].name : '',
        },
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            if (!uploadFiles || uploadFiles.length === 0) {
                return;
            }
            putFile(data.presignedPutUrl, uploadFiles[0], uploadFiles[0].type).then(() => {
                setFolderChain(oldFolderChain => [...oldFolderChain]);
                setFiles(oldFiles => [...oldFiles,
                {
                    name: uploadFiles[0].name,
                    id: currentPath + uploadFiles[0].name,
                    isDir: false, thumbnailUrl: `${process.env.NEXT_PUBLIC_MINIO_ADDRESS || 'http://localhost:9000'}/${bucket}/${currentPath}${uploadFiles[0].name}`
                }]);
                
            });
            setUploadFiles(currentArray => {
                const newArray = [...currentArray];
                newArray.shift();
                return newArray.length === 0 ? [] : newArray;
            });
        },
        onError: (error) => {
            if(error){
                alert(error)
            }
            setUploadFiles(currentArray => {
                const newArray = [...currentArray];
                newArray.shift();
                return newArray.length === 0 ? [] : newArray;
            });
        }
    });


    const selectedFilesIds = Array.from(fileBrowserRef.current?.getFileSelection() ?? '')

    const [removeObjectsMutation, { data: removeData, loading: removeLoading, error: removeError }] = useRemoveObjectsMutation({
        variables: {
            bucket: bucket,
            fileNames: selectedFilesIds
        },
        onCompleted: (data) => {
            if(!data.files){
               // TODO: handle error
               return;
            }
            const fileIdsRemoved = data.files.remove.map(file => file.id);
            setFiles(oldFiles => {
                return oldFiles.filter(file => !fileIdsRemoved.includes(file.id));
            })
        }
    });
    const [moveObjectsMutation, { data: moveData, loading: moveLoading, error: moveError }] = useMoveObjectsMutation({
        onCompleted: (data) => {
            const fileIdsRemoved = data.files.move.map(file => file.oldFile.id);
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
                    if(confirm(`${t('areYouSureYouWantToDeleteFiles')}`)){
                        removeObjectsMutation();
                    }
                       
                    return;
                }
                if (data.id === ChonkyActions.UploadFiles.id) {
                    setuploadModalOpen(true);
                    return;
                }
                if (data.id === ChonkyActions.CreateFolder.id) {
                    const input = prompt("Name of new folder:");
                    if (input) {
                        setFiles(oldFiles => [...oldFiles, { name: input, id: currentPath + input + '/', isDir: true }]);
                    }
                    return;
                }
                if (data.id === ChonkyActions.MoveFiles.id) {
                    console.log("move", data.state.selectedFilesForAction.map(file => file.id), data.payload.destination.id);
                    moveObjectsMutation({
                        variables: {
                            bucket: bucket,
                            fileNames: data.state.selectedFilesForAction.map(file => file.id),
                            destination: data.payload.destination.id
                        }
                    });
                }

            },
            [folderChain]
        );
    };

   
    
    const handleFileAction = useFileActionHandler(setFolderChain);
    const MemoI18n =  useMemo(() => (i18n.language !== 'en' ?  Chonkyi18n(t) : {}), [i18n.language]);

    return (
        <div>
            <div style={{ height: 400 }}>
                <FullFileBrowser
                    files={files}
                    folderChain={folderChain}
                    fileActions={fileActions}
                    onFileAction={handleFileAction}
                    ref={fileBrowserRef}
                    disableDragAndDrop={true}
                    i18n={MemoI18n}
                //thumbnailGenerator={thumbnailGenerator}
                //{...props}
                />
            </div>
            <UploadModal
                open={uploadModalOpen}
                onClose={() => setuploadModalOpen(false)}
                onUpload={(files: File[]) => {
                    setUploadFiles(files)
                }}
            />
        </div>
    );
}