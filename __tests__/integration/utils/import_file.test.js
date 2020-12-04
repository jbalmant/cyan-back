const truncate = require('../../utils/truncate');
const factory = require('../../factories');
const FileStatus = require('../../../src/app/enums/FileStatus');
const {File, Location} = require('../../../src/app/models');
const importFile = require('../../../src/app/utils/importFile');
const Fs = require('fs')
const Path = require('path')
const sqlite = require('spatialite');

sqlite.Database.prototype.run_cp = sqlite.Database.prototype.run;
sqlite.Database.prototype.run = function run(...args) {
    this.spatialite(err => {
        return this.run_cp(...args);
    })
}

describe('ImportFile', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('must import file', async () => {

        const user = await factory.create('User')
        const file = await factory.create('File', {
            user_id: user.id,
        })

        const file_path = Path.join(process.env.DOWNLOAD_FOLDER, file.name);

        Fs.appendFileSync(file_path, 'latitude,longitude\r\n')
        Fs.appendFileSync(file_path, '-16.0738,-53.9820\r\n')
        Fs.appendFileSync(file_path, '-6.5847,-51.4006\r\n')
        Fs.appendFileSync(file_path, '-16.0694,-53.9873\r\n')
        Fs.appendFileSync(file_path, '-6.5837,-51.3937\r\n')

        expect(Fs.existsSync(file_path)).toBe(true)

        await importFile(file, file_path)

        const expected_file = await File.findOne({where: {id: file.id}});

        expect(expected_file.status).toBe(FileStatus.IMPORTED)
    });
});


