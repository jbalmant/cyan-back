const truncate = require('../../utils/truncate');
const factory = require('../../factories');
const FileStatus = require('../../../src/app/enums/FileStatus');
const {File} = require('../../../src/app/models');
const downloadFile = require('../../../src/app/utils/downloadFile');
const Fs = require('fs')
const Path = require('path')

jest.mock('../../../src/app/utils/importFile');
const importFile = require('../../../src/app/utils/importFile');


describe('DownloadFile', () => {
    beforeEach(async () => {
        // await truncate();
    });

    it('must download file', async () => {
        const user = await factory.create('User')
        const file = await factory.create('File', {
            user_id: user.id,
            url_path: process.env.TEST_FILE_URL_PATH,
            name: `${Date.now()}_small.csv`
        })
        // TODO (team) - Think about a wiser way to test this

        const download_path = Path.join(process.env.DOWNLOAD_FOLDER, file.name);

        expect(Fs.existsSync(download_path)).toBe(false)

        await downloadFile(file)

        const expected_file = await File.findOne({where: {id: file.id}});

        expect(expected_file.status).toBe(FileStatus.DOWNLOADED)
        expect(Fs.existsSync(download_path)).toBe(true)

        expect(importFile).toBeCalled()
    });

    it('must save error when fails to download file', async () => {
        const user = await factory.create('User')
        const file = await factory.create('File', {
            user_id: user.id,
            url_path: process.env.TEST_NOT_FOUND_URL_PATH,
            name: `${Date.now()}_small.csv`
        })
        // TODO (team) - Think about a wiser way to test this

        const download_path = Path.join(process.env.DOWNLOAD_FOLDER, file.name);

        expect(Fs.existsSync(download_path)).toBe(false)

        await downloadFile(file)

        const expected_file = await File.findOne({where: {id: file.id}});

        expect(expected_file.status).toBe(FileStatus.DOWNLOAD_ERROR)
        expect(Fs.existsSync(download_path)).toBe(false)

        expect(importFile).not.toBeCalled()
    });
});


