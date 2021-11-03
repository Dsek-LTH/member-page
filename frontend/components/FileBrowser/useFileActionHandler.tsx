import { ChonkyActions, ChonkyFileActionData, FileData } from "chonky";
import { useCallback } from "react";

export const useFileActionHandler = (
    folderChain: FileData[],
    setFolderChain: React.Dispatch<React.SetStateAction<FileData[]>>,
    openFile: (file: FileData) => void,
    deleteFiles: (files: FileData[]) => void,
    uploadFiles: () => void,
    moveFiles: (files: FileData[], source: FileData, destination: FileData) => void,
    createFolder: (folderName: string) => void
) => {
    return useCallback(
        (data: ChonkyFileActionData) => {
            if (data.id === ChonkyActions.OpenParentFolder.id) {
                setFolderChain(oldFolderChain => {
                    const a = [...oldFolderChain];
                    a.pop();
                    return a;
                });
                return;
            }
            else if (data.id === ChonkyActions.OpenFiles.id) {
                const { targetFile, files } = data.payload;

                if (targetFile && targetFile.isDir) {
                    const newPrefix = `${data.payload.targetFile.id.replace(/\/*$/, '')}/`;
                    console.log("Golder chain")
                    if (!folderChain.some(folder => folder.id === newPrefix)) {
                        setFolderChain(oldFolderChain => [...oldFolderChain, data.payload.targetFile]);
                        return;
                    }
                }
                else if (!targetFile.isDir) {
                    openFile(targetFile);
                }
               
            } 
            else if (data.id === ChonkyActions.DeleteFiles.id) {
                deleteFiles(data.state.selectedFiles);
                
            } 
            else if (data.id === ChonkyActions.UploadFiles.id) {
                uploadFiles();
            }
            else if (data.id === ChonkyActions.CreateFolder.id) {
                const newFolderName = window.prompt("Provide the name for the new folder:");
                if (newFolderName) createFolder(newFolderName);

            }
            else if (data.id === ChonkyActions.MoveFiles.id) {
                moveFiles(
                    data.payload.files,
                    data.payload.source!,
                    data.payload.destination
                );
            }

        },
        [openFile, uploadFiles, createFolder, deleteFiles, moveFiles, folderChain]
    );
};