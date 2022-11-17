import { Dispatch, SetStateAction, useCallback } from 'react';
import { ChonkyActions, ChonkyFileActionData, FileData } from 'chonky';
import path from 'path';
import RenameFile, { renameFileId } from './RenameFile';
import { useRenameObjectMutation } from '~/generated/graphql';
import { useDialog } from '~/providers/DialogProvider';

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
  prefix: string,
  bucket: string,
  currentPath: string,
  t,
) {
  const { confirm } = useDialog();
  const [renameObject] = useRenameObjectMutation();
  const slashesInPrefix = prefix.split('/').length - 1;
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
              while (newFolderChain.length > targetFile.id.split('/').length - (1 + slashesInPrefix)) {
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
        confirm(t('areYouSureYouWantToDeleteFiles'), (value) => {
          if (value) removeObjectsMutation();
        });
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
        const selectedFile = data.state.selectedFilesForAction[0];
        const input = prompt(t('NewFileName'), selectedFile.name.split('.')[0]);
        if (input) {
          const fileName = selectedFile.id;
          const newFileName = `${currentPath}${input + path.extname(selectedFile.id)}${selectedFile.isDir ? '/' : ''}`;
          renameObject({
            variables: {
              bucket,
              fileName,
              newFileName,
            },
          }).then(() => {
            setFiles((oldFiles) => {
              const newFiles = oldFiles.filter((file) => file.id !== fileName);
              newFiles.push({ ...selectedFile, id: newFileName, name: path.basename(newFileName) });
              return newFiles;
            });
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
