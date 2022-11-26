import { UserInputError } from 'apollo-server';
import path from 'path';
import { FileData } from 'chonky';
import { CopyConditions } from 'minio';
import { context, dbUtils, minio } from '../shared';
import * as gql from '../types/graphql';

const MINIO_BASE_URL = process.env.NODE_ENV === 'production'
  ? `https://${process.env.MINIO_ENDPOINT}/`
  : `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/`;

async function fileExists(bucket: string, fileName: string): Promise<boolean> {
  try {
    await minio.statObject(bucket, fileName);
    return true;
  } catch (error) {
    return false;
  }
}

function isDir(fileName: string): boolean {
  return fileName.charAt(fileName.length - 1) === '/';
}

function getFilesInFolder(bucket: string, prefix: string, recursive: boolean):
Promise<gql.FileData[]> {
  return new Promise<gql.FileData[]>((resolve, reject) => {
    const stream = minio.listObjectsV2(bucket, prefix, recursive);
    const chonkyFiles: gql.FileData[] = [];
    stream.on('data', async (obj) => {
      if (obj.name) {
        chonkyFiles.push({
          id: obj.name,
          name: path.basename(obj.name),
          modDate: obj.lastModified,
          size: obj.size,
          thumbnailUrl: `${MINIO_BASE_URL}${bucket}/${obj.name}`,
        });
      }
      if (obj.prefix) {
        chonkyFiles.push({
          id: obj.prefix,
          name: path.basename(obj.prefix),
          isDir: true,
        });
      }
    });
    stream.on('error', reject);
    stream.on('end', () => {
      resolve(chonkyFiles);
    });
  });
}

export default class Files extends dbUtils.KnexDataSource {
  getFilesInBucket(
    ctx: context.UserContext,
    bucket: string,
    prefix: string,
    recursive = false,
  ): Promise<gql.Maybe<gql.FileData[]>> {
    if (!bucket) {
      return Promise.resolve([]);
    }
    return this.withAccess(`fileHandler:${bucket}:read`, ctx, async () => {
      const basePath = '';
      const files = await getFilesInFolder(bucket, prefix !== '/' ? basePath + prefix : basePath, recursive);
      return files;
    });
  }

  getPresignedPutUrl(
    ctx: context.UserContext,
    bucket: string,
    fileName: string,
  ): Promise<gql.Maybe<string>> {
    return this.withAccess(`fileHandler:${bucket}:create`, ctx, async () => {
      if (fileName === '') return undefined;

      const hour = 60 * 60;
      if (await fileExists(bucket, fileName)) {
        throw new UserInputError(`File ${fileName} already exists`);
      }
      const url: string = await minio.presignedPutObject(bucket, fileName, hour);
      return url;
    });
  }

  removeObjects(ctx: context.UserContext, bucket: string, fileNames: string[]) {
    return this.withAccess(`fileHandler:${bucket}:delete`, ctx, async () => {
      const deleted: FileData[] = [];

      await Promise.all(fileNames.map(async (fileName) => {
        if (isDir(fileName)) {
          const filesInFolder = await this.getFilesInBucket(ctx, bucket, fileName);
          if (filesInFolder) {
            await this.removeObjects(ctx, bucket, filesInFolder.map((file) => file.id));
          }
          deleted.push({
            id: fileName,
            name: path.basename(fileName),
          });
        } else {
          await minio.removeObject(bucket, fileName);
          deleted.push({
            id: fileName,
            name: path.basename(fileName),
          });
        }
      }));
      return deleted;
    });
  }

  moveObject(ctx: context.UserContext, bucket: string, fileNames: string[], newFolder: string) {
    return this.withAccess(`fileHandler:${bucket}:update`, ctx, async () => {
      const moved: gql.FileChange[] = [];

      await Promise.all(fileNames.map(async (fileName) => {
        const basename = path.basename(fileName);

        if (isDir(fileName)) {
          const filesInFolder = await this.getFilesInBucket(ctx, bucket, fileName);
          if (filesInFolder) {
            const recursivedMoved = await this.moveObject(ctx, bucket, filesInFolder.map((file) => file.id), `${newFolder + basename}/`);
            const FileChange = {
              file: { id: `${newFolder + basename}/`, name: basename, isDir: true },
              oldFile: { id: fileName, name: basename, isDir: true },
            };
            moved.push(FileChange);
            moved.push(...recursivedMoved);
          }
        } else {
          const newFileName = path.join(newFolder, basename);

          const objectStats = await minio.statObject(bucket, fileName);

          if (await fileExists(bucket, newFileName)) {
            return;
          }

          const oldFile = {
            id: fileName,
            name: path.basename(fileName),
            modDate: objectStats.lastModified,
            size: objectStats.size,
            thumbnailUrl: `${MINIO_BASE_URL}${bucket}/${fileName}`,
          };

          const newFile = {
            id: newFileName,
            name: path.basename(newFileName),
            size: objectStats.size,
            thumbnailUrl: `${MINIO_BASE_URL}${bucket}/${newFileName}`,
          };

          await minio.copyObject(bucket, newFileName, `/${bucket}/${fileName}`, new CopyConditions());
          await minio.removeObject(bucket, fileName);

          const FileChange = {
            file: newFile,
            oldFile,
          };

          moved.push(FileChange);
        }
      }));
      return moved;
    });
  }

  renameObject(ctx: context.UserContext, bucket: string, fileName: string, newFileName: string) {
    return this.withAccess(`fileHandler:${bucket}:update`, ctx, async () => {
      if (await fileExists(bucket, newFileName) && ctx.roles) {
        throw new UserInputError(`File ${newFileName} already exists`);
      }
      const dirname = path.dirname(fileName);

      if (isDir(fileName)) {
        const filesInFolder = await this.getFilesInBucket(ctx, bucket, fileName);
        if (filesInFolder) {
          this.moveObject(ctx, bucket, filesInFolder.map((file) => file.id), `${newFileName}/`);
        }
        return undefined;
      }
      const newFileId = path.join(`${dirname}/`, newFileName);

      const objectStats = await minio.statObject(bucket, fileName);

      if (await fileExists(bucket, newFileId)) {
        return undefined;
      }

      const oldFile = {
        id: fileName,
        name: path.basename(fileName),
        modDate: objectStats.lastModified,
        size: objectStats.size,
        thumbnailUrl: `${MINIO_BASE_URL}${bucket}/${fileName}`,
      };

      const newFile = {
        id: newFileId,
        name: path.basename(newFileId),
        size: objectStats.size,
        thumbnailUrl: `${MINIO_BASE_URL}${bucket}/${newFileId}`,
      };

      await minio.copyObject(bucket, newFileName, `/${bucket}/${fileName}`, new CopyConditions());
      await minio.removeObject(bucket, fileName);

      const FileChange = {
        file: newFile,
        oldFile,
      };

      return FileChange;
    });
  }
}
