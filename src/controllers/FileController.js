const File = require('../models/File');
const Location = require('../models/Location');
const download = require('../utils/download');

const url = require("url");
const Fs = require('fs');
const csv = require('fast-csv');
const Path = require('path')

// TODO (jbalmant) - Move to a better place.
// TODO (jbalmant) - Create a task on RabbiMQ to import into database.
// TODO (jbalmant) - Find a better way to import.
// TODO (jbalmant) - How about big files?.
importCSV = (file, filename) => {
    const path = Path.resolve(__basedir, 'assets', filename)

    const locations = [];

    File.update({ status: FileStatus.IMPORTING }, { where: { id: file.id } });

    Fs.createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => {
            console.error(error);
            File.update({ status: FileStatus.IMPORTING_ERROR }, { where: { id: file.id } });
            throw error.message;
        })
        .on('data', row => {
            locations.push({ lat: row.latitude, lng: row.longitude, file_id: file.id });
        })
        .on('end', () => {
            Location.bulkCreate(locations).then(() => {
                console.log('Successfully imported')
                File.update({ status: FileStatus.IMPORTED }, { where: { id: file.id } });
            });
        });
}

// TODO (jbalmant) - Move to a better place
// TODO (jbalmant) - Create a task on RabbiMQ to download file
// TODO (jbalmant) - Study if is possible to download directly to database.
processFile = (file) => {
    console.log(`Downloading ${file.path}`);
    File.update({ status: FileStatus.DOWNLOADING }, { where: { id: file.id } });

    const filename = Date.now() + file.filename

    // TODO (jbalmant) - Create temp filename
    download(file.path, filename).then(function () {
        File.update({ status: FileStatus.DOWNLOADED }, { where: { id: file.id } });
        importCSV(file, filename)
        console.log('Download Done');
    }).catch(function (err) {
        console.log(`An error occured ${err}`)
        File.update({ status: FileStatus.DOWNLOADING_ERROR }, { where: { id: file.id } });
    });

}

// TODO (jbalmant) - How to use enum on NodeJS?
const FileStatus = Object.freeze({ "QUEUED": 1, "DOWNLOADING": 2, "DOWNLOADED": 3, "IMPORTING": 4, "IMPORTED": 5, "DOWNLOADING_ERROR": -1, "IMPORTING_ERROR": -2 });

module.exports = {
    async list(req, res) {
        const files = await File.findAll();
        return res.json(files);
    },
    async store(req, res) {
        const { path } = req.body;
        const status = FileStatus.QUEUED;
        const filename = Path.posix.basename(url.parse(path).pathname)

        const file = await File.create({ path, status, filename });

        processFile(file);

        return res.json(file)
    },

};