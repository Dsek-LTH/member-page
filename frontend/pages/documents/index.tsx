import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import DefaultLayout from '~/layouts/defaultLayout';
import FileBrowser from '~/components/FileBrowser';
import putFile from '~/functions/putFile';
import { useBucketQuery, usePresignedPutDocumentUrlQuery } from '~/generated/graphql';

const BUCKET_NAME = 'news';

export default function DocumentPage() {
  const { t } = useTranslation('common');
  const [uploadFile, setUploadFile] = useState<File>(undefined);
  const [currentPath, setCurrentPath] = useState<string>(undefined);

  const uploadFileName = uploadFile ? currentPath + uploadFile.name : '';

  const fetchFiles = useBucketQuery({
    variables: {
        name: BUCKET_NAME,
        prefix: currentPath,
    },
});
  
  const fetchPutDocumentUrl = usePresignedPutDocumentUrlQuery({
    variables: {
      fileName: uploadFileName,
    },
  });


  const handleFileUpload = (file: File) => {
    if(!file) return false;
    setUploadFile(file);
    return true;
}

const handlePathChange = (currentPath: string) => {
  setCurrentPath(currentPath);
}

  return (
    <>
      <DefaultLayout>
        <FileBrowser
          fetchFiles={fetchFiles}
          fetchUploadUrl={fetchPutDocumentUrl}
          onFileUpload={handleFileUpload}
          handlePathChange={handlePathChange}
          bucket={BUCKET_NAME}
        />
      </DefaultLayout>
    </>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  }
})