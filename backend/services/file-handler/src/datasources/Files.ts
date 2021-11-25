import { UserInputError } from "apollo-server";
import * as gql from '../types/graphql';
import path from 'path';
import { context, dbUtils, minio } from 'dsek-shared';
import { FileData } from 'chonky';
import { CopyConditions } from "dsek-shared/dist/minio";

const minio_base_url = `http://${process.env.MINIO_ENDPOINT || 'http://localhost'}:${process.env.MINIO_PORT || '9000'}/`;

export default class Files extends dbUtils.KnexDataSource {


    getFilesInBucket = (context: context.UserContext, bucket: string, prefix: string): Promise<gql.Maybe<gql.FileData[]>> =>
        this.withAccess(`fileHandler:${bucket}:read`, context, async () => {
            const basePath = '';
            const objectsList = await new Promise<gql.FileData[]>((resolve, reject) => {
                const stream = minio.listObjectsV2(bucket, prefix !== '/' ? basePath + prefix : basePath, false);
                const chonkyFiles: gql.FileData[] = [];

                stream.on('data', obj => {
                    console.log(obj);
                    if (obj.name) {
                        chonkyFiles.push({
                            id: obj.name,
                            name: path.basename(obj.name),
                            modDate: obj.lastModified,
                            size: obj.size,
                            thumbnailUrl: `${minio_base_url}${bucket}/${obj.name}`
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
        });

    getPresignedPutUrl = (context: context.UserContext, bucket: string, fileName: string): Promise<gql.Maybe<string>> =>
        this.withAccess(`fileHandler:${bucket}:create`, context, async () => {
            if (fileName == '') return undefined;

            const hour = 60 * 60;
            if (await this.fileExists(bucket, fileName)) {
                throw new UserInputError(`File ${fileName} already exists`);
            }
            let url: string = await minio.presignedPutObject(bucket, fileName, hour)
            return url;
        });

    removeObjects = (context: context.UserContext, bucket: string, fileNames: string[]) =>
        this.withAccess(`fileHandler:${bucket}:delete`, context, async () => {
            const deleted: FileData[] = [];

            await Promise.all(fileNames.map(async (fileName) => {
                if (fileName.charAt(fileName.length - 1) === '/') {
                    const filesInFolder = await this.getFilesInBucket(context, bucket, fileName);
                    if (filesInFolder) {
                        this.removeObjects(context, bucket, filesInFolder.map(file => file.id));
                    }
                    deleted.push({
                        id: fileName,
                        name: path.basename(fileName)
                    });
                }
                else {
                    await minio.removeObject(bucket, fileName);
                    deleted.push({
                        id: fileName,
                        name: path.basename(fileName)
                    });
                }
            }));
            return deleted;
        });

    moveObject = (context: context.UserContext, bucket: string, fileNames: string[], newFolder: string) =>
        this.withAccess(`fileHandler:${bucket}:update`, context, async () => {
            const conditions = new CopyConditions();
            const moved: gql.FileChange[] = [];

            await Promise.all(fileNames.map(async (fileName) => {

                const basename = path.basename(fileName);

                if (fileName.charAt(fileName.length - 1) === '/') {
                    const filesInFolder = await this.getFilesInBucket(context, bucket, fileName);
                    if (filesInFolder) {
                        const recursivedMoved = await this.moveObject(context, bucket, filesInFolder.map(file => file.id), newFolder + basename + '/');
                        const FileChange = {
                            file: { id: newFolder + basename + '/', name: basename, isDir: true },
                            oldFile: { id: fileName, name: basename, isDir: true },
                        }
                        moved.push(FileChange)
                        moved.push(...recursivedMoved);
                    }
                }
                else {
                    const newFileName = path.join(newFolder, basename);
                    let objectStream = undefined
                    let objectStats = undefined

                    try {
                        objectStream = await minio.getObject(bucket, fileName);
                        objectStats = await minio.statObject(bucket, fileName);
                    } catch (error) {
                        console.log(error);
                        return;
                    }

                    if (await this.fileExists(bucket, newFileName)) {
                        return;
                    }

                    const oldFile = {
                        id: fileName,
                        name: path.basename(fileName),
                        modDate: objectStats.lastModified,
                        size: objectStats.size,
                        thumbnailUrl: `${minio_base_url}${bucket}/${fileName}`
                    }

                    const newFile = {
                        id: newFileName,
                        name: path.basename(newFileName),
                        size: objectStats.size,
                        thumbnailUrl: `${minio_base_url}${bucket}/${newFileName}`
                    }

                    await minio.putObject(bucket, newFileName, (await objectStream), (await objectStats).size)

                    await minio.removeObject(bucket, fileName);

                    const FileChange = {
                        file: newFile,
                        oldFile: oldFile,
                    }

                    moved.push(FileChange);
                }

            }));
            return moved;
        });

    renameObject = (context: context.UserContext, bucket: string, fileName: string, newFileName: string) =>
        this.withAccess(`fileHandler:${bucket}:update`, context, async () => {

            const dirname = path.dirname(fileName);

            if (fileName.charAt(fileName.length - 1) === '/') {
                const filesInFolder = await this.getFilesInBucket(context, bucket, fileName);
                if (filesInFolder) {
                    this.moveObject(context, bucket, filesInFolder.map(file => file.id), dirname + newFileName + '/');
                }
            }
            else {
                const newFileId = path.join(dirname + '/', newFileName);
                let objectStream = undefined
                let objectStats = undefined

                try {
                    objectStream = await minio.getObject(bucket, fileName);
                    objectStats = await minio.statObject(bucket, fileName);
                } catch (error) {
                    console.log(error);
                    return;
                }

                if (await this.fileExists(bucket, newFileId)) {
                    return;
                }

                const oldFile = {
                    id: fileName,
                    name: path.basename(fileName),
                    modDate: objectStats.lastModified,
                    size: objectStats.size,
                    thumbnailUrl: `${minio_base_url}${bucket}/${fileName}`
                }

                const newFile = {
                    id: newFileId,
                    name: path.basename(newFileId),
                    size: objectStats.size,
                    thumbnailUrl: `${minio_base_url}${bucket}/${newFileId}`
                }

                await minio.putObject(bucket, newFileName, (await objectStream), (await objectStats).size)

                await minio.removeObject(bucket, fileName);

                const FileChange = {
                    file: newFile,
                    oldFile: oldFile,
                }

                return (FileChange);
            }
        });

    private async fileExists(bucket: string, fileName: string): Promise<boolean> {
        try {
            await minio.statObject(bucket, fileName);
            return true;
        } catch (error) {
            return false;
        }
    }
}
