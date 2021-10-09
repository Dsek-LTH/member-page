
import { Minio } from 'minio';
import {
    ChonkyActions,
    ChonkyFileActionData,
    FileArray,
    FullFileBrowser,
    FileData,
    FileNavbar,
    FileList,
    FileToolbar,
    FileBrowser,
    setChonkyDefaults,
    FileAction,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import path from 'path';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useBucketQuery, usePresignedPutDocumentUrlQuery } from '~/generated/graphql';
import UploadModal from './UploadModal';
import * as FileType from 'file-type/browser'
import putFile from '~/functions/putFile';

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const BUCKET_NAME = 'news';

  const fileActions : FileAction[] = [
    ChonkyActions.UploadFiles
];

export default function Browser() {
    const [files, setFiles] = useState<FileArray>([]);
    const [folderChain, setFolderChain] = useState<FileData[]>([{ id: 'public/', name: 'root', isDir: true}]);
    const [uploadModalOpen, setuploadModalOpen] = useState<boolean>(false);
    const [uploadFile, setUploadFile] = useState<File>(undefined);

    const currentPath = folderChain[folderChain.length - 1].id;
    const uploadFileName = uploadFile ? currentPath + uploadFile.name : '';
    console.log(folderChain)
    const { data, loading, error } = useBucketQuery({
        variables: {
            name: BUCKET_NAME,
            prefix: currentPath,
        },
    });
     const { data: uploadUrlData, loading: uploadUrlLoading, error: uploadUrlError } = usePresignedPutDocumentUrlQuery({
       variables: {
         fileName: uploadFileName,
       },
     });

    const handleFileAction = useCallback(
        (data: ChonkyFileActionData) => {
            if(data.id ===  ChonkyActions.OpenParentFolder.id){
                setFolderChain(oldFolderChain =>{
                    const a = [...oldFolderChain];
                    a.pop();
                    return a;
                }); 
                return;
            }
            else if (data.id === ChonkyActions.OpenFiles.id) {
                if (data.payload.files && data.payload.files.length !== 1) {
                    console.log("1")
                    return;
                }
                if (!data.payload.targetFile || !data.payload.targetFile.isDir) {
                    console.log("2")
                    window.open(`http://localhost:9000/news/${data.payload.targetFile.id}`).focus();
                    return;
                }
                if(data.payload.targetFile.isDir){
                    const newPrefix = `${data.payload.targetFile.id.replace(/\/*$/, '')}/`;
                    if(!folderChain.some(folder => folder.id === newPrefix)){
                        console.log("add to folder chanin", newPrefix)
                        setFolderChain(oldFolderChain => [...oldFolderChain, data.payload.targetFile]);
                        return;
                    }   
                }
            }
            else if(data.id === ChonkyActions.DeleteFiles.id){}
            else if(data.id === ChonkyActions.UploadFiles.id){
                console.log("upload", data.payload);
                setuploadModalOpen(true);


            }
            
           
        },
        [folderChain]
    );

    useEffect(() => {
        if(!uploadUrlLoading && !uploadUrlError){
            console.log("PUT")
            putFile(uploadUrlData.presignedPutDocumentUrl, uploadFile, uploadFile.type);
        }
      }, [uploadFile, uploadUrlLoading]);

    if (error) {
        console.log(error)
        return(<div></div>)
    }

    if (loading) {
        return(<div>loading</div>)
    }
    
    const handleFileUpload = async (file: File) => {

        if(!file) return;
        console.log("Set upload file")
        setUploadFile(file);
    }


    console.log("data", data);
    return (
        <div style={{ height: 400 }}>
            <FileBrowser
                files={data.bucket}
                onFileAction={handleFileAction}
                folderChain={folderChain}
                fileActions={fileActions}
            >
                <FileNavbar /> 
                <FileToolbar />
                <FileList />
            </FileBrowser>
            <UploadModal
                open={uploadModalOpen}
                onClose={() => setuploadModalOpen(false)}
                onUpload={(file:File) => handleFileUpload(file)}
            />
        </div>
    );
};