import { Dispatch, SetStateAction, useCallback } from 'react';
import { ChonkyActions, ChonkyFileActionData, FileData } from 'chonky';

export default function useFileActionHandler(
  setFolderChain: Dispatch<SetStateAction<FileData[]>>,
  folderChain: FileData[],
  moveObjectsMutation,
  removeObjectsMutation,
  setuploadModalOpen,
  setSelectedFilesIds: Dispatch<SetStateAction<string[]>>,
  setFiles: Dispatch<SetStateAction<FileData[]>>,
  bucket: string,
  currentPath: string,
  t,
) {
  return useCallback(
    (data: ChonkyFileActionData) => {
      if (data.id === ChonkyActions.ChangeSelection.id) {
        setSelectedFilesIds(data.state.selectedFiles.map((file) => file.id));
      }
      if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile } = data.payload;
        if (targetFile && targetFile.isDir) {
          // console.log(targetFile);
          setFolderChain((oldFolderChain) => {
            if (oldFolderChain.some((folder) => folder.id === targetFile.id)) {
              const newFolderChain = [...oldFolderChain];
              while (newFolderChain.length > targetFile.id.split('/').length - 1) {
                newFolderChain.pop();
              }
              return newFolderChain;
            }
            return [...oldFolderChain, data.payload.targetFile];
          });
          return;
        } if (!targetFile?.isDir) {
          window.open(`${process.env.NEXT_PUBLIC_MINIO_ADDRESS}/${bucket}/${data.state.selectedFiles[0].id}`);
          return;
        }
      }
      if (data.id === ChonkyActions.DeleteFiles.id) {
        if (window.confirm(`${t('areYouSureYouWantToDeleteFiles')}`)) {
          removeObjectsMutation();
        }
        return;
      }
      if (data.id === ChonkyActions.UploadFiles.id) {
        setuploadModalOpen(true);
        return;
      }
      if (data.id === ChonkyActions.CreateFolder.id) {
        const input = prompt(t('NameOfTheNewFolder'));
        if (input) {
          setFiles((oldFiles) => [...oldFiles, { name: input, id: `${currentPath + input}/`, isDir: true }]);
        }
        return;
      }
      if (data.id === ChonkyActions.MoveFiles.id) {
        moveObjectsMutation({
          variables: {
            bucket,
            fileNames: data.state.selectedFilesForAction.map((file) => file.id),
            destination: data.payload.destination.id,
          },
        });
      }
    },
    [setFolderChain, bucket, t, removeObjectsMutation, setuploadModalOpen,
      setFiles, currentPath, moveObjectsMutation],
  );
}
