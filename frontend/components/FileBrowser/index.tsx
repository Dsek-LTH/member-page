import {
  ChonkyActions,
  FileData,
  setChonkyDefaults,
  FileAction,
  FileBrowserHandle,
  FullFileBrowser,
  FileBrowser,
  FileList,
  FileNavbar,
  FileToolbar,
  FileContextMenu,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React, { useMemo, useState } from 'react';
import {
  useFilesQuery,
  useMoveObjectsMutation,
  usePresignedPutUrlQuery,
  useRemoveObjectsMutation,
} from '~/generated/graphql';
import UploadModal from './UploadModal';
import putFile from '~/functions/putFile';
import Chonkyi18n from './Chonkyi18n';
import { useTranslation } from 'next-i18next';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useFileActionHandler } from './useFileActionHandler';
import { useTheme } from '@mui/material/styles';
import NoTitleLayout from '../NoTitleLayout';
import { MuiThemeProvider } from '@material-ui/core';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

type Props = {
  bucket: string;
};

interface CustomFileData extends FileData {
  parentId?: string;
  childrenIds?: string[];
}

export default function Browser({ bucket }: Props) {
  const theme = useTheme();
  const fileBrowserRef = React.useRef<FileBrowserHandle>(null);
  const [folderChain, setFolderChain] = useState<FileData[]>([
    { id: 'public/', name: 'root', isDir: true },
  ]);
  const currentPath = folderChain[folderChain.length - 1].id;
  const [files, setFiles] = useState<FileData[]>();
  const [uploadModalOpen, setuploadModalOpen] = useState<boolean>(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const { t, i18n } = useTranslation(['common', 'fileBrowser']);
  const apiContext = useApiAccess();

  const fileActions: FileAction[] = [
    hasAccess(apiContext, `fileHandler:${bucket}:create`) &&
      ChonkyActions.UploadFiles,
    hasAccess(apiContext, `fileHandler:${bucket}:create`) &&
      ChonkyActions.CreateFolder,
    hasAccess(apiContext, `fileHandler:${bucket}:delete`) &&
      ChonkyActions.DeleteFiles,
  ];

  useFilesQuery({
    variables: {
      bucket: hasAccess(apiContext, `fileHandler:${bucket}:read`) && bucket,
      prefix: currentPath,
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setFiles(data.files);
    },
  });

  usePresignedPutUrlQuery({
    variables: {
      bucket: bucket,
      fileName:
        hasAccess(apiContext, `fileHandler:${bucket}:create`) &&
        uploadFiles.length > 0
          ? currentPath + uploadFiles[0].name
          : '',
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (!uploadFiles || uploadFiles.length === 0) {
        return;
      }
      putFile(data.presignedPutUrl, uploadFiles[0], uploadFiles[0].type).then(
        () => {
          setFolderChain((oldFolderChain) => [...oldFolderChain]);
          setFiles((oldFiles) => [
            ...oldFiles,
            {
              name: uploadFiles[0].name,
              id: currentPath + uploadFiles[0].name,
              isDir: false,
              thumbnailUrl: `${
                process.env.NEXT_PUBLIC_MINIO_ADDRESS || 'http://localhost:9000'
              }/${bucket}/${currentPath}${uploadFiles[0].name}`,
            },
          ]);
        }
      );
      setUploadFiles((currentArray) => {
        const newArray = [...currentArray];
        newArray.shift();
        return newArray.length === 0 ? [] : newArray;
      });
    },
    onError: (error) => {
      if (hasAccess(apiContext, `fileHandler:${bucket}:create`) && error) {
        alert(error);
      }
      setUploadFiles((currentArray) => {
        const newArray = [...currentArray];
        newArray.shift();
        return newArray.length === 0 ? [] : newArray;
      });
    },
  });

  const selectedFilesIds = Array.from(
    fileBrowserRef.current?.getFileSelection() ?? ''
  );

  const [
    removeObjectsMutation,
    { data: removeData, loading: removeLoading, error: removeError },
  ] = useRemoveObjectsMutation({
    variables: {
      bucket: bucket,
      fileNames: selectedFilesIds,
    },
    onCompleted: (data) => {
      if (!data.files) {
        return;
      }
      const fileIdsRemoved = data.files.remove.map((file) => file.id);
      setFiles((oldFiles) => {
        return oldFiles.filter((file) => !fileIdsRemoved.includes(file.id));
      });
    },
    onError: (error) => {
      if (error) {
        alert(error);
      }
    },
  });
  const [
    moveObjectsMutation,
    { data: moveData, loading: moveLoading, error: moveError },
  ] = useMoveObjectsMutation({
    onCompleted: (data) => {
      const fileIdsRemoved = data.files.move.map((file) => file.oldFile.id);
      setFiles((oldFiles) => {
        return oldFiles.filter((file) => !fileIdsRemoved.includes(file.id));
      });
    },
    onError: (error) => {
      if (error) {
        alert(error);
      }
    },
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
    t
  );

  const MemoI18n = useMemo(
    () => (i18n.language !== 'en' ? Chonkyi18n(t) : {}),
    [i18n.language]
  );

  return (
    <NoTitleLayout>
      <div style={{ height: 400 }}>
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
      </div>
      {hasAccess(apiContext, `fileHandler:${bucket}:create`) && (
        <UploadModal
          open={uploadModalOpen}
          onClose={() => setuploadModalOpen(false)}
          onUpload={(files: File[]) => {
            setUploadFiles(files);
          }}
        />
      )}
    </NoTitleLayout>
  );
}
