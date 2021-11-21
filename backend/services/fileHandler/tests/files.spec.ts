import 'mocha';
import mockDb from 'mock-knex';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { context, knex, minio } from 'dsek-shared';
import FilesAPI from '../src/datasources/Files';
import { UserInputError } from 'apollo-server-errors';
import { BucketItemStat, BucketStream, BucketItem } from 'dsek-shared/node_modules/@types/minio';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const bucketItemStat: BucketItemStat = {
    size: 100,
    etag: "etag",
    lastModified: new Date(),
    metaData: {}
}

const bucketItem: BucketItem = {
    name: "public/filename.png",
    prefix: "",
    size: 100,
    etag: "etag",
    lastModified: new Date(),
}

const itemStream: BucketStream<BucketItem> = {
    on: (event: any, fn: any): BucketStream<BucketItem> => {
        if (event === 'data') {
            fn(bucketItem)
            fn({ ...bucketItem, name: "", prefix: "public/folder/", size: 0 })
        }
        if (event === 'end') {
            fn()
        }
        return itemStream
    }
} as BucketStream<BucketItem>

const filesAPI = new FilesAPI(knex);

describe('[FilesAPI]', () => {

    beforeEach(() => {
        sandbox.on(minio, "listObjectsV2", () => itemStream)
        sandbox.on(minio, "presignedPutObject", () => new Promise<string>((resolve, reject) => resolve('http://localhost:9000/test')));
        sandbox.on(minio, "removeObject", () => new Promise<void>((resolve, reject) => resolve()));
        sandbox.on(minio, "getObject", () => new Promise<any>((resolve, reject) => resolve({})));
        sandbox.on(minio, "statObject", () => new Promise<BucketItemStat>((resolve, reject) => resolve(bucketItemStat)));
        sandbox.on(minio, "putObject", () => new Promise<void>((resolve, reject) => resolve()));
        sandbox.on(filesAPI, 'withAccess', (name, context, fn) => fn())
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('[getFilesInBucket]', () => {
        it('returns all files in root', async () => {

            const res = await filesAPI.getFilesInBucket({},'documents', 'public');
            expect(res).to.be.an('array');
            expect(res).to.have.lengthOf(2);
            if (res) {
                expect(res[0].name).to.equal('filename.png');
                expect(res[0].id).to.equal(bucketItem.name);
                expect(res[0].size).to.equal(100);
                expect(res[0].modDate).to.equal(bucketItem.lastModified);
                expect(res[0].isDir).to.be.undefined;


                expect(res[1].id).to.equal('public/folder/');
                expect(res[1].name).to.equal("folder");
                expect(res[1].isDir).to.be.true;
            }
        });
        describe('[getPresignedPutUrl]', () => {
            it('returns all undefined when filename is ""', async () => {
                const res = await filesAPI.getPresignedPutUrl({},'documents', '');
                expect(res).to.be.undefined;
            });
            it('throws error if file does exist', async () => {
                try {
                    await filesAPI.getPresignedPutUrl({},'documents', 'public/filename.png')
                    expect.fail("Did not throw an error");
                } catch (e) {
                    expect(e).to.be.an.instanceof(UserInputError);
                }
            });
            it('return an url', async () => {
                sandbox.on(filesAPI, "fileExists", () => false);

                const res = await filesAPI.getPresignedPutUrl({},'documents', 'public/filename1.png');
                expect(res).to.be.a.string;
            });
        });
        describe('[removeObjects]', () => {
            it('return removed objects', async () => {
                const res = await filesAPI.removeObjects({},'documents', ['public/filename.png']);
                expect(res).to.be.an('array');
                expect(res).to.have.lengthOf(1);
                expect(res[0].id).to.equal('public/filename.png');
                expect(res[0].name).to.equal('filename.png');
            });
        });
        describe('[moveObject]', () => {
            it('return moved objects', async () => {
                sandbox.on(filesAPI, "fileExists", () => false);

                const res = await filesAPI.moveObject({},'documents', ['public/filename.png'], 'public1/');
                expect(res).to.be.an('array');
                expect(res).to.have.lengthOf(1);
                expect(res[0].oldFile?.id).to.equal('public/filename.png');
                expect(res[0].oldFile?.name).to.equal('filename.png');
                expect(res[0].file.id).to.equal('public1/filename.png');
                expect(res[0].file.name).to.equal('filename.png');
            });
        });
        describe('[renameObject]', () => {
            it('return renamed objects', async () => {
                sandbox.on(filesAPI, "fileExists", () => false);

                const res = await filesAPI.renameObject({},'documents', 'public/filename.png', 'filename1.png');
                if(res){
                    expect(res.oldFile?.id).to.equal('public/filename.png');
                    expect(res.oldFile?.name).to.equal('filename.png');
                    expect(res.file.id).to.equal('public/filename1.png');
                    expect(res.file.name).to.equal('filename1.png');
                }
            });
        });
    });
});