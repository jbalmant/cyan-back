const request = require('supertest');

const app = require('../../../src/app');
const truncate = require('../../utils/truncate');
const factory = require('../../factories');
const FileStatus = require('../../../src/app/enums/FileStatus');

jest.mock('../../../src/app/utils/downloadFile');
const downloadFile = require('../../../src/app/utils/downloadFile');

const sqlite = require('spatialite');

sqlite.Database.prototype.run_cp = sqlite.Database.prototype.run;
sqlite.Database.prototype.run = function run(...args) {
    this.spatialite(err => {
        return this.run_cp(...args);
    })
}

describe('Files', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('must return files for given user', async () => {
        const user = await factory.create('User')
        const another_user = await factory.create('User')

        const file1 = await factory.create('File', {user_id: user.id})
        const file2 = await factory.create('File', {user_id: user.id})
        await factory.create('File', {user_id: another_user.id})

        const response = await request(app).get("/files")
            .set('Authorization', `Bearer ${user.generateToken()}`)
            .send()

        expect(response.status).toBe(200);

        expect(response.body.length).toBe(2)

        expect(response.body).toEqual([
            expect.objectContaining({
                url_path: file1.url_path,
                name: file1.name,
                user_id: file1.user_id,
                status: file1.status
            }),
            expect.objectContaining({
                url_path: file2.url_path,
                name: file2.name,
                user_id: file2.user_id,
                status: file2.status
            })])
    });


    it('must create file', async () => {
        const user = await factory.create('User')

        const response = await request(app).post("/files")
            .set('Authorization', `Bearer ${user.generateToken()}`)
            .send({
                url_path: 'https://balmant.s3-sa-east-1.amazonaws.com/small.csv'
            })
        expect(response.status).toBe(200);

        let expected = expect.objectContaining({
            url_path: 'https://balmant.s3-sa-east-1.amazonaws.com/small.csv',
            name: 'small.csv',
            user_id: user.id,
            status: FileStatus.QUEUED
        })

        expect(response.body).toEqual(expected)

        expect(downloadFile).toHaveBeenCalledWith(expected)
    });
});

describe('Files/id', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('must return file details', async () => {
        const user = await factory.create('User')
        const file = await factory.create('File', {user_id: user.id})
        await factory.create('Location', {file_id: file.id})
        await factory.create('Location', {file_id: file.id})
        await factory.create('File', {user_id: user.id})

        const response = await request(app).get(`/files/${file.id}`)
            .set('Authorization', `Bearer ${user.generateToken()}`)
            .send()

        expect(response.status).toBe(200);

        let expected = expect.objectContaining({
            url_path: file.url_path,
            name: file.name,
            user_id: user.id,
            status: file.status
        })

        expect(response.body).toEqual(expected)
        expect(response.body.locations.length).toBe(2)
    });

    it('must return not found', async () => {
        const user = await factory.create('User')
        const file = await factory.create('File', {user_id: user.id})
        await factory.create('File', {user_id: user.id})

        const response = await request(app).get('/files/wrongfileid')
            .set('Authorization', `Bearer ${user.generateToken()}`)
            .send()

        expect(response.status).toBe(400);
    });

})
