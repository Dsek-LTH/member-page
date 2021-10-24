import { UserInputError } from "apollo-server";
import * as gql from '../types/graphql';
//import * as sql from '../types/database';
import path from 'path';
import { dbUtils, minio } from 'dsek-shared';
import {
    FileArray,
    FileData,
} from 'chonky';
import { CopyConditions } from "dsek-shared/dist/minio";

const BUCKET_NAME = "news";

const asyncForEach = async (array: any[], callback: (element: any, index: number, []: any) => void) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export default class Documents extends dbUtils.KnexDataSource {



    async getFilesInBucket(bucket: string, prefix: string): Promise<gql.Maybe<gql.FileData[]>> {
        const basePath = '';
        const objectsList = await new Promise<gql.FileData[]>((resolve, reject) => {
            const stream = minio.listObjectsV2(bucket, prefix !== '/' ? basePath + prefix : basePath, false);
            const chonkyFiles: gql.FileData[] = [];

            stream.on('data', obj => {
                if (obj.name) {
                    chonkyFiles.push({
                        id: obj.name,
                        name: path.basename(obj.name),
                        modDate: obj.lastModified,
                        size: obj.size,
                        thumbnailUrl: 'http://localhost:9000/news/' + obj.name
                    })
                }
                if (obj.prefix) {
                    chonkyFiles.push({
                        id: obj.prefix,
                        name: path.basename(obj.prefix),
                        isDir: true
                    })
                }
            });

            stream.on('error', reject);
            stream.on('end', () => {
                resolve(chonkyFiles);
            });
        });
        return objectsList;
    }

    async getPresignedPutUrl(fileName: string): Promise<gql.Maybe<string>> {
        const hour = 60 * 60;

        let url: string = await minio.presignedPutObject('news', fileName, hour)
        return url;
    }

    async removeObjects(fileNames: string[]) {
        const deleted: string[] = [];

        await asyncForEach(fileNames, async (fileName) => {
            await minio.removeObject(BUCKET_NAME, fileName);
            deleted.push(fileName);
        });
        return deleted;
    }

    async moveObject(fileNames: string[], newFolder: string) {
        const conditions = new CopyConditions();
        const moved: gql.FileChange[] = [];

        await asyncForEach(fileNames, async (fileName) => {
            const basename = path.basename(fileName);

            const newFileName = path.join(newFolder, basename);
            let objectStream = undefined
            let objectStats = undefined

            try {
                objectStream = await minio.getObject(BUCKET_NAME, fileName);
                objectStats = await minio.statObject(BUCKET_NAME, fileName);
            } catch (error) {
                return;
            }

            if (await minio.statObject(BUCKET_NAME, newFileName)) {
                return;
            }

            const oldFile = {
                id: fileName,
                name: path.basename(fileName),
                modDate: objectStats.lastModified,
                size: objectStats.size,
                thumbnailUrl: 'http://localhost:9000/news/' + fileName
            }

            const newFile = {
                id: newFileName,
                name: path.basename(newFileName),
                size: objectStats.size,
                thumbnailUrl: 'http://localhost:9000/news/' + newFileName
            }

            await minio.putObject(BUCKET_NAME, newFileName, (await objectStream), (await objectStats).size)
            await minio.removeObject(BUCKET_NAME, fileName);

            const FileChange = {
                file: newFile,
                oldFile: oldFile,
            }

            moved.push(FileChange);
        });
        return moved;
    }

    async renameObject(fileName: string, newFileName: string) {
        const renamed = await this.moveObject([fileName], path.dirname(fileName) + '/' + newFileName);
        if (renamed.length > 0)
            return renamed[0];
        else
            return undefined;
    }
}
