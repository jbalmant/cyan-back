const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');
const FileStatus = require('../../src/app/enums/FileStatus');
const File = require('../../src/app/models/File');

jest.mock('../../src/app/utils/processFile');
const processFile = require('../../src/app/utils/processFile');

describe('Files', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('must return files for given user', async () => {
        const user = await factory.create('User')
        const another_user = await factory.create('User')

        const file1 = await factory.create('File', { user_id: user.id })
        const file2 = await factory.create('File', { user_id: user.id })
        await factory.create('File', { user_id: another_user.id })

        const response = await request(app).get("/files")
            .set('Authorization', `Bearer ${user.generateToken()}`)
            .send()

        expect(response.status).toBe(200);

        expect(response.body.length).toBe(2)

        file1.createdAt = file1.createdAt.toString()

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

        expect(processFile).toHaveBeenCalledWith(expected)
    });
});


