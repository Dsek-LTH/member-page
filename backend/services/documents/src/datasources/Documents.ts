import { UserInputError } from "apollo-server";
import * as gql from '../types/graphql';
//import * as sql from '../types/database';
import path from 'path';
import { dbUtils, minio } from 'dsek-shared';
import {
    FileArray,
    FileData,
} from 'chonky';

export default class Documents extends dbUtils.KnexDataSource {

    async getFilesInBucket(bucket: string, prefix: string): Promise<gql.Maybe<gql.FileData[]>> {
        const basePath = '/public/'
        const objectsList = await new Promise<gql.FileData[]>((resolve, reject) => {
            const stream = minio.listObjectsV2(bucket, prefix !== '/' ? basePath + prefix : basePath, false);
            const chonkyFiles: gql.FileData[] = [];
            
            stream.on('data', obj => {
                if (obj.name) {
                    console.log(obj);
                    chonkyFiles.push({
                        id: obj.name,
                        name: path.basename(obj.name),
                        modDate: obj.lastModified,
                        size: obj.size,
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

}
