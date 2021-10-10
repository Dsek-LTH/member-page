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

  const { data, loading, error, called,  } = useBucketQuery({
    variables: {
        name: BUCKET_NAME,
        prefix: currentPath,
    },
});
  console.log("Render")
  const { data: uploadUrlData, loading: uploadUrlLoading, error: uploadUrlError } = usePresignedPutDocumentUrlQuery({
    variables: {
      fileName: uploadFileName,
    },
  });


  const handleFileUpload = async (file: File) => {
    if(!file) return;
    setUploadFile(file);
}

useEffect(() => {
  console.log("LOADING")
},[loading])

const handlePathChange = (currentPath: string) => {
  setCurrentPath(currentPath);
}

useEffect(() => {
  if(!uploadUrlLoading && !uploadUrlError){
      putFile(uploadUrlData.presignedPutDocumentUrl, uploadFile, uploadFile.type);
  }
}, [uploadFile, uploadUrlLoading]);


  if(loading && !called) return <p>Loading...</p>;
  console.log(data?.bucket)
  return (
    <>
      <DefaultLayout>
        <FileBrowser
          files={data?.bucket}
          handleFileUpload={handleFileUpload}
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