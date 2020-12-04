const app = require('../../app')

const Fs = require('fs')
const Path = require('path')

const {File} = require('../models');
const FileStatus = require('../enums/FileStatus');
const Axios = require("axios");
const importFile = require("./importFile");


module.exports = async function (file) {
    await File.update({status: FileStatus.DOWNLOADING}, {where: {id: file.id}});

    const download_path = Path.join(process.env.DOWNLOAD_FOLDER, file.name);
    const writer = Fs.createWriteStream(download_path);

    try {
        const response = await Axios({
            url: file.url_path,
            method: 'GET',
            responseType: 'stream'
        })

        response.data.pipe(writer)

        await File.update({status: FileStatus.DOWNLOADED}, {where: {id: file.id}});

        importFile(file, download_path)
    } catch (err) {
        Fs.unlinkSync(download_path)
        await File.update({status: FileStatus.DOWNLOAD_ERROR}, {where: {id: file.id}});
    }

    // importCSV(file, filename)
    //
    // download(file.path, filename).then(function () {
    //     File.update({ status: FileStatus.DOWNLOADED }, { where: { id: file.id } });
    //     importCSV(file, filename)
    //     console.log('Download Done');
    // }).catch(function (err) {
    //     console.log(`An error occured ${err}`)
    //     File.update({ status: FileStatus.DOWNLOADING_ERROR }, { where: { id: file.id } });
    // });
};