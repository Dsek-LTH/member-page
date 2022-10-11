import { Dispatch, SetStateAction, useCallback } from 'react';
import { ChonkyActions, ChonkyFileActionData, FileData } from 'chonky';
import path from 'path';
import RenameFile, { renameFileId } from './RenameFile';
import { useRenameObjectMutation } from '~/generated/graphql';

export default function useFileActionHandler(
  setFolderChain: Dispatch<SetStateAction<FileData[]>>,
  folderChain: FileData[],
  moveObjectsMutation,
  removeObjectsMutation,
  setuploadModalOpen,
  setSelectedFilesIds: Dispatch<SetStateAction<string[]>>,
  setFiles: Dispatch<SetStateAction<FileData[]>>,
  setUploadFiles: Dispatch<SetStateAction<File[]>>,
  setAdditionalPath: Dispatch<SetStateAction<String>>,
  refetch: () => void,
  bucket: string,
  currentPath: string,
  t,
) {
  const [renameObject] = useRenameObjectMutation();
  return useCallback(
    (data: ChonkyFileActionData & typeof RenameFile) => {
      if (data.id === ChonkyActions.ChangeSelection.id) {
        setSelectedFilesIds(data.state.selectedFiles.map((file) => file.id));
      }
      if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile } = data.payload;
        if (targetFile && targetFile.isDir) {
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
          const id = `${currentPath + input}/`;
          setFiles((oldFiles) => [...oldFiles, { name: input, id, isDir: true }]);
          const file = new File(['New empty folder'], '_folder-preserver');
          setAdditionalPath(`${input}/`);
          setUploadFiles([file]);
        }
        return;
      }
      if (data.id.toLocaleLowerCase() === renameFileId) {
        const input = prompt(t('NewFileName'), path.basename(data.state.selectedFilesForAction[0].id));
        if (input) {
          renameObject({
            variables: {
              bucket,
              fileName: data.state.selectedFilesForAction[0].id,
              newFileName: currentPath + input,
            },
          }).then(() => {
            refetch();
          });
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
