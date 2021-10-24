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
    const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
    const [destination, setDestination] = useState<FileData>(undefined);
    const [uploadFile, setUploadFile] = useState<File>(undefined);
    const [uploadModalOpen, setuploadModalOpen] = useState<boolean>(false);
    const [filesObject, setFilesObject] = useState<{
        [path: string]: { [name: string]: FileData };
    }>({});

    const currentPath = folderChain[folderChain.length - 1].id;
    const { data: filesData, loading: filesLoading, error: filesError, called: filesCalled } = fetchFiles;
    const { data: uploadUrlData, loading: uploadUrlLoading, error: uploadUrlError } = fetchUploadUrl;

    const [removeObjectsMutation, { data: removeData, loading: removeLoading, error: removeError }] = useRemoveObjectsMutation({
        variables: {
            fileNames: selectedFiles.map(file => file.id),
        },
    });

    const [moveObjectsMutation, { data: moveData, loading: moveLoading, error: moveError }] = useMoveObjectsMutation({
        variables: {
            fileNames: selectedFiles.filter(file => !file.isDir).map(file => file.id),
            destination: destination?.id
        },
    });

    const addFileToFileObject = (file: FileData) => {
        setFilesObject(oldFiles => {
            const newFiles = { ...oldFiles };
            const newPath = { ...newFiles[path.dirname(file.id) + '/'] };
            newPath[file.name] = file;
            newFiles[currentPath] = newPath;
            return newFiles;
        });
    }


    //const fileDataExists = (checkFileData: FileData, path: string) => files?.[path].some(fileData => fileData.id === checkFileData.id);

    //Wait for files to be removed and den deletes them from the files object
    /*useEffect(() => {
         if (!removeLoading && !removeError && removeData) {
             const deltededFiles = removeData.document.remove;
             setFiles(oldFiles => {
                 const newFiles = { ...oldFiles };
                 deltededFiles.forEach(fileId => {
                     if (path.dirname(fileId) + '/' === currentPath) {
                         newFiles[currentPath].forEach((fileData, index) => {
                             if (fileData.id === fileId) {
                                 const newArray = [...newFiles[currentPath]];
                                 newArray.splice(index, 1);
                                 newFiles[currentPath] = newArray;
                             }
                         })
                     }
                 })
                 return newFiles;
             });
             console.log("removed", "selected", selectedFiles)
         }
     }, [removeLoading]);*/

    /*useEffect(() => {
        if (!moveLoading && !moveError && moveData) {
            const fileChanges = moveData.document.move;

            setFiles(oldFiles => {
                const newFiles = { ...oldFiles };
                fileChanges.forEach(fileChange => {
                    const newPath = path.dirname(fileChange.file.id) + '/'; 
                    const newArray =  oldFiles[newPath] ? [...oldFiles[newPath]] : []

                    const oldPath = path.dirname(fileChange.oldFile.id) + '/';

                    newArray.push({ id: fileChange.file.id, name: fileChange.file.name, isDir: fileChange.file.isDir });
                    const newFiles = {...oldFiles};
                    newFiles[newPath] = newArray
                    newFiles[oldPath]

        
                });
                return newFiles;
            });
        }
    }, [moveLoading]);*/

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

    useEffect(() => {
        if (destination)
            moveObjectsMutation();
    }, [destination]);

    const handleFileAction = (data: ChonkyFileActionData) => {
        if (data.id === ChonkyActions.ChangeSelection.id) {
            const l1 = data.state.selectedFiles.map(file => file.id);
            const l2 = selectedFiles.map(file => file.id);
            if (l1.length !== l2.length || !l1.every(file => l2.includes(file))) {
                setSelectedFiles(data.state.selectedFiles);
            }
            return;
        }
        else if (data.id === ChonkyActions.OpenParentFolder.id) {
            setFolderChain(oldFolderChain => {
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
            if (data.payload.targetFile.isDir) {
                const newPrefix = `${data.payload.targetFile.id.replace(/\/*$/, '')}/`;
                if (!folderChain.some(folder => folder.id === newPrefix)) {
                    setFolderChain(oldFolderChain => [...oldFolderChain, data.payload.targetFile]);
                    return;
                }
            }
        }
        else if (data.id === ChonkyActions.DeleteFiles.id) {
            removeObjectsMutation();
        }
        else if (data.id === ChonkyActions.UploadFiles.id) {
            setuploadModalOpen(true);
        }
        else if (data.id === ChonkyActions.CreateFolder.id) {
            const newFolder = window.prompt("Provide the name for the new folder:");
            const newFolderFileData = {
                id: `${currentPath}${newFolder}/`,
                name: newFolder,
                isDir: true,
            }
            addFileToFileObject(newFolderFileData);
        }
        else if (data.id === ChonkyActions.MoveFiles.id) {
            console.log("move");
            setDestination(data.payload.destination);
        }
        //Rename
        /*else if (data.id === ChonkyActions.RenameFile.id) {
            //const newName = window.prompt("Provide the new name for the file:");
        }*/
    }

    const currentFiles = filesObject[currentPath] ? Object.values(filesObject[currentPath]) : [];

    console.log("render")
    console.log(selectedFiles)

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