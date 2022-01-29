import {
  ChonkyActions,
  FileData,
  setChonkyDefaults,
  FileAction,
  FileBrowserHandle,
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
import useClientSide from '~/hooks/useClientSide';
import { useSnackbar } from '~/providers/SnackbarProvider';
import handleApolloError from '~/functions/handleApolloError';

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
  const clientSide = useClientSide();
  const fileBrowserRef = React.useRef<FileBrowserHandle>(null);
  const [folderChain, setFolderChain] = useState<FileData[]>([
    { id: 'public/', name: 'root', isDir: true },
  ]);
  const currentPath = folderChain[folderChain.length - 1].id;
  const [files, setFiles] = useState<FileData[]>();
  const [uploadModalOpen, setuploadModalOpen] = useState<boolean>(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const { t, i18n } = useTranslation();
  const { showMessage } = useSnackbar();
  const apiContext = useApiAccess();

  const fileActions: FileAction[] = [
    hasAccess(apiContext, `fileHandler:${bucket}:create`)
    && ChonkyActions.UploadFiles,
    hasAccess(apiContext, `fileHandler:${bucket}:create`)
    && ChonkyActions.CreateFolder,
    hasAccess(apiContext, `fileHandler:${bucket}:delete`)
    && ChonkyActions.DeleteFiles,
  ];

  useFilesQuery({
    variables: {
      bucket: hasAccess(apiContext, `fileHandler:${bucket}:read`) ? bucket : '',
      prefix: currentPath,
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setFiles(data.files);
    },
    onError: (error) => handleApolloError(error, showMessage, t),
  });

  usePresignedPutUrlQuery({
    variables: {
      bucket,
      fileName:
        hasAccess(apiContext, `fileHandler:${bucket}:create`)
          && uploadFiles.length > 0
          ? currentPath + uploadFiles[0].name
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

  const selectedFilesIds = Array.from(
    fileBrowserRef.current?.getFileSelection() ?? '',
  );

  const [
    removeObjectsMutation,
  ] = useRemoveObjectsMutation({
    variables: {
      bucket,
      fileNames: selectedFilesIds,
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
    setFiles,
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
      <div style={{ height: 400 }}>
        {clientSide && (
          <MuiThemeProvider theme={theme}>
            <FullFileBrowser
              darkMode={theme.palette.mode === 'dark'}
              files={files}
              folderChain={folderChain}
              fileActions={fileActions}
              onFileAction={handleFileAction}
              ref={fileBrowserRef}
              disableDragAndDrop={false}
              i18n={MemoI18n}
            />
          </MuiThemeProvider>
        )}
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
