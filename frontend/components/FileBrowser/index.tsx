import {
  ChonkyActions,
  FileData,
  setChonkyDefaults,
  FileAction,
  FullFileBrowser,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useTheme } from '@mui/material/styles';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MuiThemeProvider } from '@material-ui/core';
/**
 * For some reason chonky borks the theme it is not wrapped in a
 *  import { MuiThemeProvider } from '@material-ui/core';
 * The technically correct ThemeProvider:
 *  import { ThemeProvider } from '@mui/material/styles';
 * does not work.
 */
import { CircularProgress } from '@mui/material';
import {
  useFilesQuery,
  useMoveObjectsMutation,
  usePresignedPutUrlQuery,
  useRemoveObjectsMutation,
} from '~/generated/graphql';
import UploadModal from './UploadModal';
import putFile from '~/functions/putFile';
import Chonkyi18n from './Chonkyi18n';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import useFileActionHandler from './useFileActionHandler';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';
import RenameFile from './RenameFile';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

type Props = {
  bucket: string;
};

/* interface CustomFileData extends FileData {
  parentId?: string;
  childrenIds?: string[];
} */

export default function Browser({ bucket }: Props) {
  const theme = useTheme();
  const [folderChain, setFolderChain] = useState<FileData[]>([
    { id: 'public/', name: 'public', isDir: true },
  ]);
  const currentPath = folderChain[folderChain.length - 1].id;
  // Used when creating new folders
  const [optionalAdditionalPath, setOptionalAdditionalPath] = useState('');
  const [files, setFiles] = useState<FileData[]>();
  const [uploadModalOpen, setuploadModalOpen] = useState<boolean>(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [selectedFileIds, setSelectedFilesIds] = useState<string[]>([]);

  const { t, i18n } = useTranslation('fileBrowser');
  const { showMessage } = useSnackbar();
  const apiContext = useApiAccess();

  const fileActions: FileAction[] = [
    hasAccess(apiContext, `fileHandler:${bucket}:create`)
    && ChonkyActions.UploadFiles,
    hasAccess(apiContext, `fileHandler:${bucket}:create`)
    && ChonkyActions.CreateFolder,
    hasAccess(apiContext, `fileHandler:${bucket}:delete`)
    && ChonkyActions.DeleteFiles,
    hasAccess(apiContext, `fileHandler:${bucket}:delete`)
    && RenameFile(t),
  ];

  const { refetch } = useFilesQuery({
    variables: {
      bucket: hasAccess(apiContext, `fileHandler:${bucket}:read`) ? bucket : '',
      prefix: currentPath,
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setFiles(data.files.filter((file) => !file.id.includes('_folder-preserver')));
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });
  usePresignedPutUrlQuery({
    variables: {
      bucket,
      fileName:
        hasAccess(apiContext, `fileHandler:${bucket}:create`)
          && uploadFiles.length > 0
          ? currentPath + optionalAdditionalPath + uploadFiles[0].name
          : '',
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (!uploadFiles || uploadFiles.length === 0) {
        return;
      }
      putFile(data.presignedPutUrl, uploadFiles[0], uploadFiles[0].type, showMessage, t).then(
        () => {
          setFolderChain((oldFolderChain) => [...oldFolderChain]);
          if (!optionalAdditionalPath) {
            setFiles((oldFiles) => [
              ...oldFiles,
              {
                name: uploadFiles[0].name,
                id: currentPath + uploadFiles[0].name,
                isDir: false,
                thumbnailUrl: `${process.env.NEXT_PUBLIC_MINIO_ADDRESS || 'http://localhost:9000'
                }/${bucket}/${currentPath}${uploadFiles[0].name}`,
              },
            ]);
          }
          setOptionalAdditionalPath('');
        },
      );
      setUploadFiles((currentArray) => {
        const newArray = [...currentArray];
        newArray.shift();
        return newArray.length === 0 ? [] : newArray;
      });
    },
    onError: (error) => {
      if (hasAccess(apiContext, `fileHandler:${bucket}:create`) && error) {
        showMessage(t('common:error'), 'error');
      }
      setUploadFiles((currentArray) => {
        const newArray = [...currentArray];
        newArray.shift();
        return newArray.length === 0 ? [] : newArray;
      });
    },
  });

  const [
    removeObjectsMutation,
  ] = useRemoveObjectsMutation({
    variables: {
      bucket,
      fileNames: selectedFileIds,
    },
    onCompleted: (data) => {
      if (!data.files) {
        return;
      }
      const fileIdsRemoved = data.files.remove.map((file) => file.id);
      setFiles((oldFiles) => oldFiles.filter((file) => !fileIdsRemoved.includes(file.id)));
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });
  const [
    moveObjectsMutation,
  ] = useMoveObjectsMutation({
    onCompleted: (data) => {
      const fileIdsRemoved = data.files.move.map((file) => file.oldFile.id);
      setFiles((oldFiles) => oldFiles.filter((file) => !fileIdsRemoved.includes(file.id)));
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });

  const handleFileAction = useFileActionHandler(
    setFolderChain,
    folderChain,
    moveObjectsMutation,
    removeObjectsMutation,
    setuploadModalOpen,
    setSelectedFilesIds,
    setFiles,
    setUploadFiles,
    setOptionalAdditionalPath,
    refetch,
    bucket,
    currentPath,
    t,
  );

  const MemoI18n = useMemo(
    () => (i18n.language !== 'en' ? Chonkyi18n(t) : {}),
    [i18n.language, t],
  );
  return (
    <>
      <div
        style={{ height: 400 }}
      >
        <CircularProgress style={{ visibility: uploadFiles.length > 0 ? 'visible' : 'hidden' }} />
        <MuiThemeProvider theme={theme}>

          <FullFileBrowser
            darkMode={theme.palette.mode === 'dark'}
            files={files}
            folderChain={folderChain}
            fileActions={fileActions}
            onFileAction={handleFileAction}
            disableDragAndDrop={false}
            i18n={MemoI18n}
            clearSelectionOnOutsideClick
          />
        </MuiThemeProvider>
      </div>
      {hasAccess(apiContext, `fileHandler:${bucket}:create`) && (
        <UploadModal
          open={uploadModalOpen}
          onClose={() => setuploadModalOpen(false)}
          onUpload={(filesToUpload: File[]) => {
            setUploadFiles(filesToUpload);
          }}
        />
      )}
    </>
  );
}
